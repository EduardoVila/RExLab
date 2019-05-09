// Setup basic express server
var lab = require('./lab.js');
var express = require('express');
var app = express();
var fs = require('fs')
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var cors = require('cors');
var Auth = require('./auth.js');
var bodyParser = require('body-parser') 
var jsonexport = require('jsonexport');




app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public/'))
app.get('/', cors(), function(req, res, next) {
    var data = fs.readFileSync(__dirname + '/public/index.html', 'utf8');
    res.send(data);
});


app.post('/export', cors(), function(req, res, next) {
   var input = [];
   for(var obj in req.body){
       input.push(req.body[obj]); 
   }
   jsonexport(input,function(err, csv){ 
        if(err) 
            return console.log(err);
       res.set({"Content-Disposition":"attachment; filename=\"dados.csv\""});
       res.send(csv);
    });
});


//Global variables
var secret = '7dac9fdcf87d2800f8c90c22a675469x';
var port = 80;
var ssi_address = 'relle.ufsc.br:8080';
var lab_id = 26;
var pin1;
var pin2;
var pin3;


//Functions

function infoPort(){
    var x;
    lab.infoList(function(err, temp) {
        x = temp.data;
    }); 
    return x;
}
function configured(){
    lab.setList(19,function(err,data){ 
    });
}

//With a new connection
io.on('connection', function(socket) {
    var auth = new Auth(ssi_address, secret, lab_id)
    socket.on('new connection', function(data) {
        console.log('new connection ', data, new Date());
        if (typeof(data.pass) === 'undefined') {
            socket.emit('err', {
                code: 402,
                message: 'Missing authentication token.'
            });
            console.log('erro 402');
            return;
        }
        var ev = auth.Authorize(data.pass);
        ev.on("not authorized", function() {
            socket.emit('err', {
                code: 403,
                message: 'Permission denied. Note: Resource is using external scheduling system.'
            });
            console.log('not authorized');
            return;
        })

        //If connection is autorized 
        ev.on("authorized", function() {    
            interval = true;
            socket.emit('oldDate',pin1,pin2,pin3);

            socket.on('new list', function(data){
                lab.setList(data,function(err,data){ 
                    console.log('setList',err,data);    
                });
                console.log(infoPort())
                if(!infoPort()){
                    lab.setList(data,function(err,data){ 
                        console.log('setList',err,data);    
                    });
                    setTimeout(function(){
                        socket.emit('button-on',true);
                    },10000);
                }
            });
            socket.on('dataSave', function(pin1,pin2,pin3){
                pin1 = pin1;
                pin2 = pin2;
                pin3 = pin3;
            });

            //Verifica se há permissão
            socket.on('start', function(data) {
                if (!auth.isAuthorized()) {
                    socket.emit('err', {
                        code: 403,
                        message: 'Permission denied. Note: Resource is using external scheduling system.'
                    });
                    console.log('erro 403');
                    return;
                }
            });
            
            //function for stop this experiment 
            socket.on('stop', function(data) {
                data == 0;
                configured();
                if (!auth.isAuthorized()) {
                    socket.emit('err', {
                        code: 403,
                        message: 'Permission denied. Note: Resource is using external scheduling system.'
                    });
                    console.log('erro 403');
                    return;
                }
                if (data.stopTempStreaming) {
                    clearInterval(interval);
                }
                lab.stop(function(err2, data) {
                    if (err2) socket.emit('err', err2);
                    else {
                        socket.emit('scale', data);
                    }
                });
            });
        }); 
    });

//End of connection
    socket.on('disconnect', function() {
        if (!auth.isAuthorized()) {
            socket.emit('err', {
                code: 403,
                message: 'Permission denied. Note: Resource is using external scheduling system.'
            });
            console.log('erro 403');
            return;
        }
        console.log('disconnected', new Date());
        configured();
    });
});
server.listen(port, function() {
    console.log('Server listening at port %d', port);
    console.log(new Date());
});