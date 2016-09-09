/*jshint esnext: true */

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const fileUpload = require('express-fileupload');
const google = require('googleapis');
const auth = require(path.join(__dirname, 'modules', 'drive'));
const mainFolderId = '0B9JlDEI5e4b-U2lHQngxbDFROEk';
const drive = google.drive({
    version: 'v3',
    auth: auth
});
const allowedMimetypes = [
    'application/x-rar-compressed',
    'application/zip',
    'image/jpeg',
    'image/png',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/pdf'
];

var tempFolderParents;
var tempFolderId;
var fileIds = [];


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Control");
    next();
});

app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(fileUpload());


app.options('/mail', function(req, res) {
    res.sendStatus(200);
});

app.post('/mail', function(req, res) {
    const recipient = 'laboratoriogobab@gmail.com';
    const sender = 'laboratoriogobab@gmail.com';

    const options = {
        auth: {
            api_user: 'demo',
                 api_key: 'demo'
        }
    };

    const client = nodemailer.createTransport(sgTransport(options));
    const templateString = fs.readFileSync('views/email.ejs', 'utf-8');
    const emailString = ejs.render(templateString, {
        data: req.body
    });

    const email = {
        from: sender,
        to: recipient,
        subject: req.body['data[proyecto][nombre]'],
        html: emailString
    };

    const cleanup = function() {
        tempFolderParents = '';
        tempFolderId = undefined;
        fileIds = [];
    };


    client.sendMail(email, function(err, info) {
        if (err) {
            console.error('Error al enviar el mail')
            console.error(err);
        } else {
            console.log('Message sent: ' + req.body['data[proyecto][nombre]']);
        }
    });

    drive.files.update({
        fileId: tempFolderId,
        resource: {'name': req.body['data[proyecto][nombre]']},
        fields: 'id'
    }, function(err, file) {
        if (err) {
            console.error('Error al renombrar la carpeta temporal');
            console.error(err);

            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }

        cleanup();
    });
});

app.options('/upload', function(req, res) {
    res.set('Access-Control-Allow-Methods', 'POST, DELETE');
    res.sendStatus(200);
});

app.post('/upload', function(req, res) {
    if (!req.files) {
        res.send('No files were uploaded.');
        return;
    }

    const files = Object.keys(req.files);
    var found = false;

    const uploadFiles = function(files, folderId) {
        var filesUploaded = 0;

        files.forEach(function(element) {
            if (allowedMimetypes.indexOf(req.files[element].mimetype) !== -1) {
                drive.files.create({
                    resource: {
                        name: req.files[element].name,
                        mimeType: req.files[element].mimetype,
                        parents: [folderId]
                    },
                    media: {
                        mimeType: req.files[element].mimetype,
                        body: req.files[element].data
                    }
                }, function(err, file) {
                    if (err) {
                        console.log('Error en la subida de archivos');
                        console.error(err);

                        res.sendStatus(500);
                    } else {
                        filesUploaded++;
                        fileIds.push(file.id);

                        console.log('File \'' + req.files[element].name + '\' uploaded to Google Drive');

                        if (filesUploaded === files.length) {
                            filesUploaded = 0;

                            res.sendStatus(201);
                            setTimeout(function(){ 
                                cleanup(); 
                            }, 180000);
                        }
                    };
                });
            } else {
                res.sendStatus(415);
            }
        });
    }

    if (!tempFolderId) {
        drive.files.create({
            resource: {
                name: 'temp',
                mimeType: 'application/vnd.google-apps.folder',
                parents: [mainFolderId],
            },
            fields: 'id'
        }, function(err, folder) {
            if (err) {
                console.error('Error creando la carpeta');
                console.error(err);
            } else {
                console.log('Carpeta temporal creada');
                tempFolderId = folder.id;
                console.log('tempFolderId: ' + tempFolderId);
                uploadFiles(files, tempFolderId);
            }
        });
    } else {
        console.log('La carpeta temporal ya existe');
        console.log('tempFolderId: ' + tempFolderId);
        uploadFiles(files, tempFolderId);
    };
});

app.delete('/upload', function(req, res) {
    var projectFolderId;
    var fileId;

    const searchFile = function(pageToken, pageFn, callback) {
        var query = "trashed = false and '" + tempFolderId + "' in parents and name = '" + req.body.fileName + "' and (mimeType not contains 'folder')";
        var compiledQuery = () => query.toString();

        drive.files.list({
            q: compiledQuery,
            fields: 'nextPageToken, files(id, name)',
            spaces: 'drive',
            pageToken: pageToken
        }, function(err, res) {
            if (err) {
                callback(err);
            } else {
                fileId = res.files[0].id;
                callback(null, fileId);
            }
        });
    };

    const deleteFile = function(fileId) {
        var errorResponseSent = false;

        drive.files.delete({
            'fileId': fileId
        }, function(err, resp) {
            if (err) {
                console.error('Error al borrar el archivo');
                console.error(err);
                errorResponseSent = true;
                res.sendStatus(500);
            } else {
                const fileIndex = fileIds.indexOf(fileId);

                if (fileIndex > -1) fileIds.splice(fileIndex, 1);
                else {
                    console.log('fileIndex not found on files array');
                    if (!errorResponseSent) res.sendStatus(500);
                };

                console.log('File \'' + req.body.fileName + '\' deleted from Google Drive');
                if (!errorResponseSent) res.sendStatus(200);
            }
        });
    }

    if (!req.body.formSent && tempFolderId) {
        searchFile(null, searchFile, function(err, fileId) {
            if (err) {
                console.error('Error al buscar archivo para borrar');
                console.error(err);
            } else if (fileId) {
                deleteFile(fileId);
            }
        });
    }
});

app.listen(5000, function() {
    console.log('Server app listening on port 5000!');
});