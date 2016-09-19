/*jshint esnext: true */
"use strict";

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const request = require('request');

const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const sendEmail = (client, email, projectName) => {
    client.sendMail(email, function(err, info) {
        if (err) {
            console.error('Error al enviar el mail')
            console.error(err);
        } else {
            console.log('Message sent: ' + projectName);
        }
    });
};

const fileUpload = require('express-fileupload');
const excelExport = require('excel-export-es6');
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
const cleanup = function() {
    tempFolderParents = '';
    tempFolderId = undefined;
    fileIds = [];
};

const changeCase = require('change-case');
const teamworkRequest = (method, path, options) => {
    const user = 'gobiernodelaciudaddebuenosaires';
    const token = 'table592rice';
    const auth = new Buffer(token + ':xxx').toString('base64');

    const base = {
        uri: 'http://' + user + '.teamwork.com' + path,
        method: method,
        encoding: 'utf8',
        followRedirect: true,
        headers: {
            'Authorization': 'BASIC ' + auth,
            'Content-Type': 'application/json'
        }
    };

    return Object.assign({}, base, options);
};
const parseData = (data) => {
    const regex = /\[(.*?)\]/g;
    var result = {};

    for (var property in data) {
        if (Object.prototype.hasOwnProperty.call(data, property)) {
            let keys = [];
            let propertyCopy = property + '';

            propertyCopy.replace(/\[(.*?)\]/g, function(g0, g1) {
                keys.push(changeCase.sentenceCase(g1));
            });

            if (keys[keys.length - 1] === '') keys.pop();
            if (result[keys[0]]) {
                result[keys[0]].push([keys[1], data[property]]);
            } else {
                result[keys[0]] = [];
            };
        }
    }

    return result;
};
const renderData = (parsedData) => {
    var result = '';

    for (var property in parsedData) {
        if (parsedData.hasOwnProperty(property)) {
            result += '\n\n' + property + '\n\n';
            parsedData[property].forEach(function(element) {
                result += element[0] + ': ' + element[1] + '\n';
            }, this);
        }
    }

    return result;
};
const postTask = (rawData, parsedData) => {
    const tasklistId = '964678';
    const projectId = '303503';
    const userId = '234141';
    const path = `/tasklists/${tasklistId}/tasks.json`;
    const payload = {
        json: {
            "todo-item": {
                "content": rawData['data[proyecto][nombre]'],
                "responsible-party-id": userId,
                "notify": true,
                "description": renderData(parsedData),
                "positionAfterTask": -1
            }
        }
    };
    const requestData = teamworkRequest('POST', path, payload);

    var req = request(requestData, function(err, res, body) {
        if (err) {
            console.error('Error al enviar la task a TeamWork: ', err);
        } else {
            if (body['STATUS'] === 'OK') console.log('Proyecto enviado a TeamWork');
            else console.error('Error al enviar la task a TeamWork: ', body['STATUS']);
        }
    });
};

const generateExcelFile = (rawData, parsedData) => {
    var data = [];

    for (var property in parsedData) {
        if (parsedData.hasOwnProperty(property)) {
            if (data.length > 0) {
                data.push(['', '']);
                data.push(['', '']);
            }

            data.push([property, '']);
            data.push(['', '']);

            parsedData[property].forEach(function(element) {
                data.push(element);
            }, this);
        }
    }

    const config = {
        cols: [{
            caption: '',
            type: 'string',
            width: 40
        }, {
            caption: '',
            type: 'string',
            width: 70
        }],
        rows: data,
        name: rawData['data[proyecto][nombre]'],
        stylesXmlFile: 'styles/styles.xml'
    };


    excelExport.execute(config, (err, path) => {
        if (err) {
            console.error('Error creando el archivo xlsx');
            console.error(err);

            cleanup();
        } else {
            const file = fs.readFileSync(path);

            if (!tempFolderId) {
                drive.files.create({
                    resource: {
                        name: rawData['data[proyecto][nombre]'],
                        mimeType: 'application/vnd.google-apps.folder',
                        parents: [mainFolderId],
                    },
                    fields: 'id'
                }, function(err, folder) {
                    if (err) {
                        console.error('Error creando la carpeta');
                        console.error(err);

                        cleanup();
                    } else {
                        console.log('Carpeta creada');
                        uploadExcelFile(file, rawData['data[proyecto][nombre]'], path, folder.id);
                    }
                });
            } else {
                uploadExcelFile(file, rawData['data[proyecto][nombre]'], path, tempFolderId);
            };
        }
    });
}
const uploadExcelFile = (file, fileName, filePath, folderId) => {
    drive.files.create({
        resource: {
            name: fileName + '.xlsx',
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            parents: [folderId]
        },
        media: {
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            body: file
        }
    }, function(err, file) {
        if (err) {
            console.error('Error al subir el archivo xlsx');
            console.error(err);
        } else {
            fs.stat(filePath, function(err, stats) {
                if (err) {
                    console.error(err);
                }

                fs.unlink(filePath, function(err) {
                    if (err) {
                        console.error('Error al borrar el archivo xlsx');
                        console.error(err);
                    } else {
                        console.log('Archivo xlsx borrado exitosamente');
                        console.log('\n');
                    }
                });
            });

            console.log('File \'' + file.name + '\' uploaded to Google Drive');
        }

        cleanup();
    });
}


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


app.options('/project', function(req, res) {
    res.sendStatus(200);
});

app.post('/project', function(req, res) {
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

    if (tempFolderId) {
        drive.files.update({
            fileId: tempFolderId,
            resource: {
                'name': req.body['data[proyecto][nombre]']
            },
            fields: 'id'
        }, function(err, file) {
            if (err) {
                console.error('Error al renombrar la carpeta temporal');
                console.error(err);

                res.sendStatus(500);
            }
            else {
                res.sendStatus(200);
            }
        });
    }
    else {
        res.sendStatus(200);
    }


    const parsedData = parseData(req.body);

    sendEmail(client, email, req.body['data[proyecto][nombre]']);
    postTask(req.body, parsedData);
    generateExcelFile(req.body, parsedData);
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
                            setTimeout(function() {
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

                res.sendStatus(500);
            } else {
                const fileIndex = fileIds.indexOf(fileId);

                if (fileIndex > -1) fileIds.splice(fileIndex, 1);

                console.log('File \'' + req.body.fileName + '\' deleted from Google Drive');
                res.sendStatus(200);
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