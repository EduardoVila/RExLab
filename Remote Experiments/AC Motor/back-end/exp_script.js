$('head').append('<link rel="stylesheet" href="http://relle.ufsc.br/css/shepherd-theme-arrows.css" type="text/css"/>');

var rpi_server = "http://200.135.162.6";
var results;
var $window = $(window);
window.charts = [];
//SUBIU

var lineChartData = {
    labels: [],
    datasets: [
        { 
            label: "Barra 1",
            fillColor: "rgba(255, 211, 198, 0.1)",
            strokeColor: "#FDA98F",
            pointColor: "#FDA98F",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: []
        }
    ]

};

$.getScript('http://relle.ufsc.br/exp_data/10/1/welcome.js', function () {
    var shepherd = setupShepherd();
    addShowmeButton('<button id="btnIntro" class="btn btn-sm btn-default"> <span class="long">' + lang.showme + '</span><span class="short">' + lang.showmeshort + '</span> <span class="how-icon fui-question-circle"></span></button>');
    $('#btnIntro').on('click', function (event) {
        event.preventDefault();
        shepherd.start();
    });
});

$.getScript('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.2.2/Chart.min.js');

$(function () {
    $('head').append('<link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css" type="text/css" />');

    $('.switch').bootstrapToggle({
        onstyle: "success",
        offstyle: "danger",
        size: "small"
    });

    function enable() {
        document.getElementById("check").disabled = false;    
    }
    
    function disable() {
        document.getElementById("check").disabled = true;
    }


    $('#sw0').change(function() {
        if ($(this).prop('checked')) {
            document.getElementById("#sw3").addEventListener("click", disable);            
            socket.emit('switch', '1');
            window.myLine.data.datasets[0].data = [];
            init_chart();
        } else { 
            document.getElementById("#sw3").addEventListener("click", enable);
            socket.emit('switch', '0');
           
        }
    })  

    $('#sw3').change(function() {
        if ($(this).prop('checked')) {
            document.getElementById("#sw0").addEventListener("click", disable);
            lab_socket.emit('switch', '2');
            socket.emit('switch', '2');
            window.myLine.data.datasets[0].data = [];
            init_chart();
        } else {
            lab_socket.emit('switch', '0');
            socket.emit('switch', '0');
            document.getElementById("#sw0").addEventListener("click", enable);
        }
    })  

    $.getScript(rpi_server + '/socket.io/socket.io.js', function () {

        console.log('loading');
        socket = io.connect(rpi_server);

        $(".controllers").show();
        $(".loading").hide();
       
        socket.emit('new connection', {pass: $('meta[name=csrf-token]').attr('content')});
        
        socket.on('reconnect', function () {
            socket.emit('new connection', {pass: $('meta[name=csrf-token]').attr('content')} );
        });

        socket.on('reconnecting', function () {
            console.log('reconnecting');
        });

        socket.on('sampling done', function (data) {
            $(".sampling").removeAttr("disabled");
            $(".hiddenchart").show();

            if (data.action == "charging")
                $("#sw0").bootstrapToggle('on');

            if (data.action == "discharging")
                $("#sw0").bootstrapToggle('off');


            var ctx = document.getElementById("canvas").getContext("2d");
            var chart = {
                type: 'line',
                data: {
                    datasets: [{
                            label: lang.voltage + ' [V] x ' + lang.time + ' [s]',
                            data: []
                        }]
                },
                options: {
                    scales: {
                        xAxes: [{
                                type: 'linear',
                                position: 'bottom'
                            }]
                    }
                }
            };

            for (var i = 0; i < data.voltmeter.length; i++) {
                chart.data.datasets[0].data.push({
                    x: (data.period * i).toFixed(3),
                    y: data.voltmeter[i]
                });
            }
            console.log(chart.data.datasets[0].data);

            if (typeof (window.myLine) != 'undefined')
                window.myLine.destroy();

            window.myLine = new Chart(ctx, chart);
 
        });   

        //Visores da pagina
        socket.on('correnteOut', function(data) {
            console.log(data); 
            $("#correnteOut").readings.push(data.meanValue);
            $("#correnteOut").update_chart(data.meanValue);
            $("#correnteOut").val(data.data);  
        });
        socket.on('rpmOut', function (data) {
            $("#rpmOut").val(data.data )
        });
        socket.on('tempMotorOut', function (data) {
            $("#tempMotorOut").val(data.data + "C")
        });
        socket.on('tempAmbOut', function (data) {
            $("#tempAmbOut").val(data.data + "C")
        });
        $("#send").click(function () {
            var data = {};
            data.motor = parseInt($("#motor_pos").val());
            console.log("Enviando " + (parseInt($("#motor_pos").val())));
            socket.emit('motor', data);
        }); 

         /*$('.switch').change(function (el) {
            var data = {};
            data[el.target.id] = $("input[id='" + el.target.id + "']:checked").length;
            console.log(data);
            socket.emit('switch', data);
         });
         */
        $('.sampling').click(function (el) {
            $(".sampling").attr("disabled", true);
            var data = {};
            data.action = el.target.id;

            data.sampletime = $("#sampletime").val();
            console.log(data)
            socket.emit('sampling', data);
        });


        // $("#show-error span p").html(message[0]);
        // $("#show-error").show();


    });



});

