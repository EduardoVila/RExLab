var ModbusRTU = require("modbus-serial");
var client = new ModbusRTU();
var fs = require('fs');

var list = JSON.parse(fs.readFileSync(__dirname+ '/modbus-calls.json', 'utf8'));

exports.connect = connect;
exports.command = command;
exports.disconnect = disconnect;


function connect(cb) {
    client.connectRTUBuffered("/dev/ttyAMA0", { // Deve ser usado RTU Buffered, somente RTU gera erro de CRC 
        baudRate: 57600
    }, function(err) {
        if (err) {
            cb(err);
        } else {
            client.setID(10);
            client.setTimeout(3000);
            cb();
        }
    });
}

function disconnect(cb) {
    if (typeof client.close != 'function') {
        if(typeof cb == 'function')
            cb();
        return;
    }
    client.close(function() {
        console.log("disconnected");
        if(typeof cb == 'function')
            cb();
    });
}

function command(operation, value, callback) {
    if (typeof list[operation] != 'object') callback("Invalid operation", null);

    var operationConf = list[operation];
    console.log(operationConf, operationConf.type);
    var modbusCall = null;

    if (operationConf.type == 'read') {
        modbusCall = function() {
            client.writeFC3(1, operationConf.address, operationConf.nRegs, function(err, data) {
            //    console.log('data buffered',data);
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, data);
                }
            });
        };
        exceptionWrap(modbusCall, callback);
    } else if (operationConf.type == 'write') {
        if (value instanceof Array) {
            modbusCall = function() {

                client.writeFC16(1, operationConf.address, value.slice(0, operationConf.nRegs), function(err, data) {
                    if (err) callback(err, null);
                    else callback(null, data);

                });
            }
        } else {
            modbusCall = function() {
                client.writeFC6(1, operationConf.address, value, function(err, data) {
                    if (err) callback(err, null);
                    else callback(null, data);

                });
            };
        }
        exceptionWrap(modbusCall, callback);
    } else {
        callback("Invalid operation " + operationConf.type, null);
    }
}

function exceptionWrap(modbusCall) {

    try {
        if (client.isOpen()) {
            modbusCall();
        } else {
           client.open(modbusCall);
        }
        
    } catch (e) {
        console.log(e);
    }
}
