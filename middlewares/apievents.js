const { EventEmitter } = require('events');
const { json } = require('express');
const textLogger = require('./logger');
const eventEmitter = new EventEmitter();

const httpRequestEvent = (req, res, next) => {
    let method = `${req.method}:${req.url}`;
    let statusCode = res.statusCode;
    let params = JSON.stringify(req.params);
    let query = JSON.stringify(req.query);
    let body = JSON.stringify(req.body);
    let timeStamp = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
    let message = `\n\n${timeStamp}\t${method}\nparams:\t${params}\nquery:\t${query}\nbody:\t${body}`;
    
    textLogger.textLogger(message);

    next();
};

eventEmitter.on('OnHttpRequestEvent', httpRequestEvent);

module.exports = eventEmitter;