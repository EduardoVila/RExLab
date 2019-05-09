var modbus = require('./modbus_queue.js');

module.exports = {
    setMotor: setMotor,
    getRPM: getRPM,
    getTemperaturaMotor: getTemperaturaMotor,
    getCorrente: getCorrente,
    getInfo: getInfo,
    setVisor1:setVisor1,
    setVisor2:setVisor2,
    setVisor3:setVisor3,
    getTemperaturaAmbiente:getTemperaturaAmbiente, 
    checkMotor:checkMotor,
    val1:val1,
    val2:val2,
    val4:val4,
    val5:val5,
    val6:val6,
    val7:val7,
    val8:val8,
    val9:val9,
    val10:val10,
    val11:val11,
    val12:val12
}
function setMotor(value, callback){
    modbus.command('setMotor',value,function(err, data) {
        if (err) {
            callback({
                message: err.message,
                strack: err.strack
            });
        } else {
            data = data.data
            callback(null, data);
        }
    }); 
}
function setVisor3(value, callback){
   console.log('value received was '+ value);
    modbus.command('setVisor3',value,function(err, data) {
        if (err) {
            callback({
                message: err.message,
                strack: err.strack
            });
        } else {
            data = data.data
            callback(null, data);
        }
    }); 
}
function setVisor2(value, callback){
    modbus.command('setVisor2',value,function(err, data) {
        if (err) {
            callback({
                message: err.message,
                strack: err.strack
            });
        } else {
            data = data.data
            callback(null, data);
        }
    }); 
}
function setVisor1(value, callback){
    modbus.command('setVisor1',value,function(err, data) {
        if (err) {
            callback({
                message: err.message,
                strack: err.strack
            });
        } else {
            data = data.data
            callback(null, data);
        }
    }); 
}
function getCorrente(callback) {
    modbus.command('getCorrente',null ,function(err, data) {
        if (err) {
            callback({
                message: err.message,
                strack: err.strack
            });
        } else {
            var data = data;
            callback(null, data);
            console.log("Corrente", data);
        }
    });
}
function checkMotor(callback) {
    modbus.command('checkMotor',null ,function(err, data) {
        if (err) {
            callback({
                message: err.message,
                strack: err.strack
            });
        } else {
            var data = data.data
            callback(null, data);
            console.log("Motor:", data);
        }
    });
}

function getTemperaturaMotor(callback) {
    modbus.command('getTemperaturaMotor', null, function(err, data) {
        console.log(err,data);
        if (err) {
            callback({
                message: err.message,
                strack: err.strack
            });
        } else {
            var data = data.data /10;
            callback(null,data);
        }
    }); 
}
function getTemperaturaAmbiente(callback) {
    modbus.command('getTemperaturaAmbiente', null, function(err, data) {
        console.log(err,data);
        if (err) {
            callback({
                message: err.message,
                strack: err.strack
            });
        } else {
            var data = data.data /10;
            callback(null,data);
        }
    }); 
}
function getRPM(callback){
    modbus.command('getRPM',null, function(err, data) {
        console.log(err,data);
        if (err) {
            callback({
                message: err.message,
                strack: err.strack
            });
        } else {
            var data = data;
            callback(null, data);
        }
    });
}
function getInfo(callback) {
    
    modbus.command('getInfo',null, function(err, data) {
        console.log(err,data.data);
        if (err) {
            callback({
                message: err.message,
                strack: err.strack
            });
        } else {
            var data = data.data
            ;
            var str = String.fromCharCode((data[0] & 0xFF), (data[0] >> 8), (data[1] & 0xFF), (data[1] >> 8), 0, (data[2] & 0xFF), (data[2] >> 8), 0);
            callback(null, str);
        }
    });
}
function val2(callback) {
    modbus.command('val2',null ,function(err, data) {
        if (err) {
            callback({
                message: err.message,
                strack: err.strack
            });
        } else {
            var data = data;
            callback(null, data);
            console.log("val2", data);
        }
    });
}
function val1(callback) {
    modbus.command('val1',null ,function(err, data) {
        if (err) {
            callback({
                message: err.message,
                strack: err.strack
            });
        } else {
            var data = data;
            callback(null, data);
            console.log("val1", data);
        }
    });
}
function val4(callback) {
    modbus.command('val4',null ,function(err, data) {
        if (err) {
            callback({
                message: err.message,
                strack: err.strack
            });
        } else {
            var data = data;
            callback(null, data);
            console.log("val4", data);
        }
    });
}
function val5(callback) {
    modbus.command('val5',null ,function(err, data) {
        if (err) {
            callback({
                message: err.message,
                strack: err.strack
            });
        } else {
            var data = data;
            callback(null, data);
            console.log("val5", data);
        }
    });
}
function val6(callback) {
    modbus.command('val5',null ,function(err, data) {
        if (err) {
            callback({
                message: err.message,
                strack: err.strack
            });
        } else {
            var data = data;
            callback(null, data);
            console.log("val5", data);
        }
    });
}
function val7(callback) {
    modbus.command('val5',null ,function(err, data) {
        if (err) {
            callback({
                message: err.message,
                strack: err.strack
            });
        } else {
            var data = data;
            callback(null, data);
            console.log("val5", data);
        }
    });
}
function val8(callback) {
    modbus.command('val5',null ,function(err, data) {
        if (err) {
            callback({
                message: err.message,
                strack: err.strack
            });
        } else {
            var data = data;
            callback(null, data);
            console.log("val5", data);
        }
    });
}
function val9(callback) {
    modbus.command('val5',null ,function(err, data) {
        if (err) {
            callback({
                message: err.message,
                strack: err.strack
            });
        } else {
            var data = data;
            callback(null, data);
            console.log("val5", data);
        }
    });
}
function val10(callback) {
    modbus.command('val5',null ,function(err, data) {
        if (err) {
            callback({
                message: err.message,
                strack: err.strack
            });
        } else {
            var data = data;
            callback(null, data);
            console.log("val5", data);
        }
    });
}
function val11(callback) {
    modbus.command('val5',null ,function(err, data) {
        if (err) {
            callback({
                message: err.message,
                strack: err.strack
            });
        } else {
            var data = data;
            callback(null, data);
            console.log("val5", data);
        }
    });
}
function val12(callback) {
    modbus.command('val5',null ,function(err, data) {
        if (err) {
            callback({
                message: err.message,
                strack: err.strack
            });
        } else {
            var data = data;
            callback(null, data);
            console.log("val5", data);
        }
    });
}