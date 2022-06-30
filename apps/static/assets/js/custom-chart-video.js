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
        
        $.ajax({
            type: "GET",
            url: "report/tags",
            data: {},
            contentType: "application/json",
            dataType: "json",
            success: function(response) {
                
                var selectopt = '<h6 style=" margin-top: 15px; ">Time : </h6><h6 class="mb-0 text-sm btn" id="time_added" style="margin-right: 20px; margin-top: 8px; "></h6><select class="tagSelect" id="tagSelect"  class="form-control">';
                Object.keys(response['result']).forEach(function(key) {
 

                    selectopt = selectopt+'<option value="'+response['result'][key]+'">'+key+'</option>';
                  
                  });
                  selectopt = selectopt+'</select>';

                  $('#time_added_tag').html(selectopt);
            }

            
        });

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

        
        

        $.ajax({
            type: "GET",
            url: "report/data/"+startDate+"/"+endDate+"/"+ye,
            data: {},
            contentType: "application/json",
            dataType: "json",
            success: function(response) {

                data = (response['result']['time_report_time'][myDate[2]+'-'+myDate[1]+'-'+myDate[0]])
                 
                
                
                //episodes
                episodes = '';
                listss = ['15-60','10-15','5-10','3-5','2-3'];
                 
                ep = 1;
                for (i = 0; i<listss.length; i++){
                    for (s=0;s<data[listss[i]].length;s++){ 
                        var className = 'bg-gradient-success';
                        if (parseInt(data[listss[i]][s]['diff'])>=15) {
                            className = 'bg-gradient-success';
                        }
                        if (parseInt(data[listss[i]][s]['diff'])>=10 && parseInt(data[listss[i]][s]['diff'])<15) {
                            className = 'bg-gradient-danger';
                        }
                        if (parseInt(data[listss[i]][s]['diff'])>=5 && parseInt(data[listss[i]][s]['diff'])<10) {
                            className = 'bg-gradient-info';
                        }
                        if (parseInt(data[listss[i]][s]['diff'])>=3 && parseInt(data[listss[i]][s]['diff'])<5) {
                            className = 'bg-gradient-warning';
                        }
                        if (parseInt(data[listss[i]][s]['diff'])>=2 && parseInt(data[listss[i]][s]['diff'])<3) {
                            className = 'bg-gradient-dark';
                        }
                        var tagMe = '';
                        if(data[listss[i]][s]['tag'] == null) {
                            tagMe = '';
                        } else {
                            tagMe = '<button type="button" class="btn btn-outline-primary btn-sm mb-0">'+data[listss[i]][s]['tag']+'</button>';
                        }
                        var pFrom = data[listss[i]][s]['from'];
                        var pTo = data[listss[i]][s]['to'];
                        pFrom = pFrom.split(" ");
                        pTo = pTo.split(" ");
                        episodes = episodes + '<tr  > <td> <div class="d-flex px-2 py-1">';
                        episodes = episodes + '<div class="d-flex flex-column justify-content-center"><h6 class="mb-0 text-sm">Episode'+ep+'</h6></div></div>';
                        episodes = episodes + '</td><td><p class="text-xs font-weight-bold mb-0">'+pFrom[1]+' - '+pTo[1]+'</p></td>';
                        episodes = episodes + '<td><span class="badge badge-sm '+className+'">'+data[listss[i]][s]['diff']+'</span></td>';
                        episodes = episodes + '<td class="align-middle text-center text-sm">'+tagMe;
                        episodes = episodes + '</td><td class="align-middle"><a href="javascript:;" class="text-secondary dataval font-weight-bold text-xs"   data-toggle="modal"  data-original-title="Edit user" data-realtime="'+pFrom[1]+' - '+pTo[1]+'"  data-date="'+data[listss[i]][s]['from']+'" data-from="'+data[listss[i]][s]['from']+'" data-to="'+data[listss[i]][s]['to']+'" data-startTime="'+data[listss[i]][s]['startTime']+'" data-endTime="'+data[listss[i]][s]['endTime']+'" data-target="#exampleModal" >Add Tag</a></td>';
                        episodes = episodes + '</tr>';
                         
                        ep = ep + 1; 
                    
                }
                } 
                $('#episodes').html(episodes);
                
            }
    
        });
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

         
        var from = $(this).data('from'); 
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
        fromTime = fromDate[1].split(":");
        tim = fromTime[0].toString().replace(/^0+/, '');
        overallTime = parseInt((23*60))-5;
        tim1 = parseInt((fromTime[1]*60/2.5))-5
        

        $("#video_hr").val(tim);
        
        
        var video = document.getElementById('vido_src');
        video.pause();
        video.src = "/static/videos/"+yrs+"/"+tim+"/"+tim+".mp4#t="+tim1+","+overallTime;
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