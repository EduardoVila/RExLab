var lab = require('./lab.js');
 

lab.getTemperaturaMotor(function(err, temp) {
    console.log('getTemperaturaMotor',err,temp);
});

lab.getTemperaturaAmbiente(function(err, temp) {
    console.log('getTemperaturaAmbiente',err,temp);
});

/*lab.getCorrente(function(err, temp) {
    console.log('getCorrente',err,temp);
});

/*lab.getRPM(function(err, temp) {
    console.log('getRPM',err,temp);
}); 
/*lab.getInfo(function(err, temp) {
    console.log('getInfo',err,temp);
}); 

lab.setMotor(0,function(err,data){
    data = 1; 
    console.log('setStart',1,err,data);
});
/*lab.setVisor1(1,function(err,data){
    data = 1; 
    console.log('setStart',1,err,data);
});*/
/*
lab.setVisor2(2,function(err,data){
    data = 2; 
    console.log('setStart',2,err,data);
});
lab.setVisor3(3,function(err,data){
    data = 3; //Sensor 1
    console.log('setStart',3,err,data);
});
*/
