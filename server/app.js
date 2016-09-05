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
        projectName: req.body.projectName,
        projectRequestingArea: req.body.projectRequestingArea,
        projectDescription: req.body.projectDescription
    });

    const email = {
        from: sender,
        to: recipient,
        subject: 'Nuevo Proyecto: ' + req.body.projectName,
        html: emailString
    };

    client.sendMail(email, function(err, info) {
        if (err) {
            console.error(err);
        } else {
            console.log('Message sent: ' + req.body.projectName);
            res.sendStatus(200);
        }
    });
});

app.options('/upload', function(req, res) {
    res.set('Access-Control-Allow-Methods', 'POST, DELETE');
    res.sendStatus(200);
});

app.post('/upload', function(req, res) {
    var projectFolderId;

    if (!req.files) {
        res.send('No files were uploaded.');
        return;
    }

    const files = Object.keys(req.files);

    const searchFolder = function(pageToken, pageFn, callback) {
        drive.files.list({
            q: "mimeType='application/vnd.google-apps.folder' AND trashed=false",
            fields: 'nextPageToken, files(id, name)',
            spaces: 'drive',
            pageToken: pageToken
        }, function(err, res) {
            if (err) {
                callback(err);
            } else {
                res.files.some(function(file) {
                    if (file.name === req.body.nombreProyecto) {
                        projectFolderId = file.id;

                        return true;
                    }
                });

                if (res.nextPageToken) {
                    console.log("Page token", res.nextPageToken);
                    pageFn(res.nextPageToken, pageFn, callback);
                } else {
                    callback(null, projectFolderId);
                }
            }
        });
    };

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
                }, function(err) {
                    if (err) console.error(err);
                    else {
                        filesUploaded++;

                        console.log('File \'' + req.files[element].name + '\' uploaded to Google Drive');

                        if (filesUploaded === files.length) {
                            res.sendStatus(201);
                        }
                    };
                });
            } else {
                res.sendStatus(415);
            }
        });
    }

    searchFolder(null, searchFolder, function(err, projectFolderId) {
        if (err) {
            console.error(err);
        } else if (projectFolderId) {
            uploadFiles(files, projectFolderId);
        } else {
            drive.files.create({
                resource: {
                    name: req.body.nombreProyecto,
                    mimeType: 'application/vnd.google-apps.folder',
                    parents: [mainFolderId],
                },
                fields: 'id'
            }, function(err, folder) {
                if (err) {
                    console.error('Error creando la carpeta');
                    console.error(err);
                } else {
                    uploadFiles(files, folder.id);
                }
            });
        }
    });
});

app.delete('/upload', function(req, res) {
    var projectFolderId;
    var fileId;

    const searchFile = function(pageToken, pageFn, callback) {

        var query = "trashed = false and '" + req.body.projectName + "' in parents and name = '" + req.body.fileName + "' and (mimeType not contains 'folder')";
        var compiledQuery = () => query.toString();

        drive.files.list({
            q: compiledQuery,
            fields: 'nextPageToken, files(id, name)',
            spaces: 'drive',
            pageToken: pageToken
        }, function(err, res) {
            if (err) {
                console.log("error en searchfile");
                callback(err);
            } else {
                fileId = res.files[0].id;

                callback(null, fileId);
            }
        });
    };

    const deleteFile = function(fileId) {
        drive.files.delete({
            'fileId': fileId
        }, function(err, resp) {
            if (err) console.error(err);
            else {
                console.log('File ' + req.body.fileName + ' deleted from Google Drive');
            }
        });
    }

    searchFile(null, searchFile, function(err, fileId) {
        if (err) {
            console.error(err);
        } else if (fileId) {
            deleteFile(fileId);
        }
    });
});

app.listen(5000, function() {
    console.log('Server app listening on port 5000!');
});