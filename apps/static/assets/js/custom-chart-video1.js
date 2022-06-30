$(document).ready(function() {
    
    $.ajax({
        type: "GET",
        url: "/report/tag/data",
        data: {},
        contentType: "application/json",
        dataType: "json",
        success: function(response) {
            console.log(response['result']);
        }
    });

    $('#mob-gig-date-gteq').change(function() {
        var date = $(this).val();
        $('#choosendate').val(date)
        

        

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        ye = 0
        today = yyyy + '-' + mm + '-' + dd;

        if(date == today){
            ye = 1;
        }
        
        var myDate = date;  
        myDate = myDate.split("-");
        var newDate = new Date( myDate[0], myDate[1] - 1, myDate[2]);

        startDate = newDate.getTime()
        endDate = newDate.getTime() + (24 * 60 * 60 * 1000)

        // var video = document.getElementById('vido_src');

        // var yrs = myDate[0]+''+(myDate[1]).toString().replace(/^0+/, '')+''+myDate[2].toString().replace(/^0+/, '');
        
        
        // video.src = "/static/videos/"+yrs+"/7/7.mp4";
        // video.play();
        
       

        LoadGrid(startDate,endDate,ye,date);
        
    });

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    ye = 0
    today = yyyy + '-' + mm + '-' + dd;

    $('#mob-gig-date-gteq').val(today).change();

    function LoadGrid(startDate,endDate,ye,date) {

        var myDate = date;  
        myDate = myDate.split("-");
        var newDate = new Date( myDate[0], myDate[1] - 1, myDate[2]);

        startDate = newDate.getTime()
        endDate = newDate.getTime() + (24 * 60 * 60 * 1000)

        
        
        $('#episodes').html('<td class="align-middle"><a href="javascript:;" class="text-secondary dataval font-weight-bold text-xs"   data-toggle="modal"  data-original-title="Edit user" data-realtime="0"  data-date="0" data-from="0" data-to="0" data-startTime="0" data-endTime="0" data-target="#exampleModal" >Show Video</a></td>');
                
        
    }


    $(document).on('click', '#butt', function(){
         
        var date = $('#choosendate').val()
        var tag = $('#tagSelect').val();
        var starttime = $('#fromTime').val();
        var endtime = $('#toTime').val();
        var station = $('#station').val();
        

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        ye = 0
        today = yyyy + '-' + mm + '-' + dd;

        if(date == today){
            ye = 1;
        }

        $.ajax({
            type: "POST",
            url: $("#butt").data('camera_blueprint'),
            data: JSON.stringify({tag:tag,starttime:starttime,endtime:endtime,station:station}),
            contentType: "application/json",
            dataType: "json",
            success: function (response) {
                incrementCoords = 0
                coordinateArr = []
                coordinateArr_ser = [];
                $('#alert-container').bootstrapAlert({
                  message:'Added Successfully!',
                    dismissible:true,
                    type:'success',// or 'info', 'warning', 'danger'
    
                });
    
                 $('#closeThis').trigger('click');
            },
          });
        LoadGrid(startDate,endDate,ye,date);
    });


    $(document).on('click', '#pre', function(){

        var video = document.getElementById('vido_src');
        splitscr = video.src.split("/");
        tim = parseInt(splitscr[6])-1;
        video.pause();
        video.src = "/static/videos/"+splitscr[5]+"/"+tim+"/"+tim+".mp4";
        video.play();
    });

    $(document).on('click', '#next', function(){
        var video = document.getElementById('vido_src');
        splitscr = video.src.split("/");
        tim = parseInt(splitscr[6])+1;
        video.pause();
        video.src = "/static/videos/"+splitscr[5]+"/"+tim+"/"+tim+".mp4";
        video.play(); 
    });


    $(document).on('click', '.dataval', function(){

        var date = $('#choosendate').val()
        var from = date
        var fromTime = $(this).data('starttime'); 
        var toTime = $(this).data('endtime');
        $('#time_added').html($(this).data('realtime')); 
        $('#fromTime').val(fromTime);
        $('#toTime').val(toTime);
        var to = $(this).data('to'); 
        
        //2022-03-14 11:53:07
        fromDate = from.split(" ");
        myDate = fromDate[0].split("-");
       
        var yrs = myDate[0]+''+(myDate[1]).toString().replace(/^0+/, '')+''+myDate[2].toString().replace(/^0+/, '');
         
        tim = 6;
          
        

        $("#video_hr").val(tim);
        
        
        var video = document.getElementById('vido_src');
        video.pause();
        video.src = "/static/videos/"+yrs+"/"+tim+"/"+tim+".mp4";
        video.play();
        
        
    });

     
    var firstMotion;
    var firstShipping;
    var timeIntervalCount;
    var shippingCusCount;
    var warehouses;
    var customers;
    var last_week_count;
    var total_hours;
    var total_wrk_hrs;
    var last_shipping_active;

    var lab = []
    var lab_num = []
    for (var da = 6; da >= 0; da--) {
        var date = new Date();
        date.setDate(date.getDate() - da);

        var finalDate = ("0" + date.getDate()).slice(-2) + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear();
        var finalDateNum = ("0" + (date.getMonth() + 1)).slice(-2) + '/' + ("0" + date.getDate()).slice(-2);
        lab.push(finalDate)
        lab_num.push(finalDateNum)
    }

 

    $.ajax({
        type: "GET",
        url: "report/box",
        data: {},
        contentType: "application/json",
        dataType: "json",
        success: function(response) {
             
          
            $("#station_name").html(response['result']['station_name']); 
            $("#station").val(response['result']['station_name']); 
        }

    });

    $.ajax({
        type: "GET",
        url: "report",
        data: {},
        contentType: "application/json",
        dataType: "json",
        success: function(response) {
            let weeklySum = [];
            var removeLoop = 0;
           
        }

    });

 
});