var async = require('async');
var Backoff = require('backoff');
var modbus = require('./modbus.js');

var connected = false;

var queue = async.queue(work, 1);


function work(item, cb) {
    ensureConnected(function () {
        modbus.command(item.command, item.options, callback);
    }, callback);
    
    function callback(err, data) {
        if (err) {
            modbus.disconnect(function () {
                connected = false;
                try {
                    cb(err, data);
                } catch (e) {
                    console.log(e);
                }
            });

        } else
            cb(err, data);
    }
}

exports.command = pushCommand;

function pushCommand(command, options, cb) {
    var work = {
        command: command,
        options: options
    };
    queue.push(work, cb);
}

function ensureConnected(cb, fail) {
    var error = null;
    if (connected === true) {
        return cb();

    } else {
        var backoff = Backoff.fibonacci({
            randomisationFactor: 0,
            initialDelay: 100,
            maxDelay: 500
        });

        backoff.failAfter(10)
        backoff.on('backoff', connect);

        backoff.on('fail', function () {
            fail(error, null);
        });

        backoff.on('ready', function (number, value) {
            backoff.backoff();
        });

        backoff.backoff();
    }

    function connect() {
        modbus.connect(fconnected);
    }

    function fconnected(err) {
        if (err) {
            error = err;
            try {
                backoff.backoff();
            } catch (e) {
                console.log('backoff', err);
            }
        } else {
            backoff.reset();
            connected = true;
            console.log('client connected')
            cb();
        }
    }
}

exports.disconnect = disconnect;

function disconnect() {
    if (!queue.length()) {
        modbus.disconnect();
        connected = false;
    } else {
        queue.drain = function () {
            modbus.disconnect();
            connected = false;
        };
    }
}