$(document).ready(function() {
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


var color = {0:'#ffffff',
              1:'#ffffff',
              2:'#ffffff',
              3:'#ffffff',
              4:'#800080',
              5:'#00008B',
              6:'#FFC0CB',
              7:'#FFA500',
              8:'#FFFF00',
              9:'#808080',
              10:'#FFA000',
              11:'#657383',
              12:'#16E2F5',
              13:'#848B79',
              14:'#550A35',
              15:'#7E587E',
              16:'#FBFBF9',
              17:'#8B0000',
              18:'#ffffff',
              19:'#ffffff',
              20:'#ffffff',
              21:'#ffffff',
              22:'#ffffff',
              23:'#ffffff'
              }

    $.ajax({
        type: "GET",
        url: "report/box",
        data: {},
        contentType: "application/json",
        dataType: "json",
        success: function(response) {
            var charbars = charbar()
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
            $("#station_name").html(response['result']['station_name']);

            last_week_count = response['result']['last_week_count']
            for (so = 0; so <= 6; so++) {
                if (response['result']['time_report_hrs'][lab[so]] === undefined) {
                    response['result']['time_report_hrs'][lab[so]] = {
                        "1-2": 0
                    };
                    response['result']['time_report_hrs'][lab[so]] = {
                        "1-2": 0
                    };
                    response['result']['time_report_hrs'][lab[so]] = {
                        "1-2": 0
                    };

                }
            }




//            var ctx2 = document.getElementById("chart-line-shipping").getContext("2d");
//
//            new Chart(ctx2, {
//                type: "line",
//                data: {
//                    labels: lab_num,
//                    datasets: [{
//                        label: "Boxing area",
//                        tension: 0,
//                        borderWidth: 0,
//                        pointRadius: 5,
//                        pointBackgroundColor: "rgba(255, 255, 255, .6)",
//                        pointBorderColor: "transparent",
//                        borderColor: "rgba(255, 255, 255, .6)",
//                        borderColor: "rgba(255, 255, 255, .6)",
//                        borderWidth: 4,
//                        backgroundColor: "transparent",
//                        fill: true,
//                        data: [response['result']['time_report_hrs'][lab[0]]['1-2'], response['result']['time_report_hrs'][lab[1]]['1-2'], response['result']['time_report_hrs'][lab[2]]['1-2'], response['result']['time_report_hrs'][lab[3]]['1-2'], response['result']['time_report_hrs'][lab[4]]['1-2'], response['result']['time_report_hrs'][lab[5]]['1-2'], response['result']['time_report_hrs'][lab[6]]['1-2']],
//                        maxBarThickness: 6,
//                        hoverOffset: 4
//
//                    }],
//                },
//                options: {
//                    responsive: true,
//                    maintainAspectRatio: false,
//                    plugins: {
//                        legend: {
//                            display: false,
//                        },
//                        tooltip: {
//                            callbacks: {
//                                label: function(context) {
//                                    var label = context.dataset.label || '';
//
//                                    if (label) {
//                                        label += ': ';
//                                    }
//                                    if (context.parsed.y !== null) {
//                                        label += parseInt(context.parsed.y) + ' min';
//                                    }
//                                    return label;
//                                }
//                            }
//                        }
//                    },
//                    interaction: {
//                        intersect: false,
//                        mode: 'index',
//                    },
//                    scales: {
//                        y: {
//                            grid: {
//                                drawBorder: false,
//                                display: true,
//                                drawOnChartArea: true,
//                                drawTicks: false,
//                                borderDash: [5, 5],
//                                color: 'rgba(255, 255, 255, .2)'
//                            },
//                            ticks: {
//                                display: true,
//                                color: '#f8f9fa',
//                                callback: function(label, index, labels) {
//                                    return label + ' min';
//
//                                    // return _label;
//                                },
//                                padding: 10,
//                                font: {
//                                    size: 14,
//                                    weight: 300,
//                                    family: "Roboto",
//                                    style: 'normal',
//                                    lineHeight: 2
//                                },
//                            }
//                        },
//                        x: {
//                            grid: {
//                                drawBorder: false,
//                                display: false,
//                                drawOnChartArea: false,
//                                drawTicks: false,
//                                borderDash: [5, 5]
//                            },
//                            ticks: {
//                                display: true,
//                                color: '#f8f9fa',
//                                padding: 10,
//                                font: {
//                                    size: 14,
//                                    weight: 300,
//                                    family: "Roboto",
//                                    style: 'normal',
//                                    lineHeight: 2
//                                },
//                            }
//                        },
//                    },
//                },
//            });



        }

    });

    function charbar() {
        $.ajax({
            type: "GET",
            url: "report",
            data: {},
            contentType: "application/json",
            dataType: "json",
            success: function(response) {
                var ctx = document.getElementById("chart-bars").getContext("2d");

                firstMotion = response['result']['pretime'];
                var yesterday;
                for (so = 0; so <= 6; so++) {
                    if (so == 5) {
                        yesterday = lab[so];

                    }
                    if (response['result']['time_report_count'][lab[so]] === undefined) {
                        response['result']['time_report_count'][lab[so]] = {
                            "1-2": 0,
                            "2-3": 0,
                            "3-5": 0,
                            "5-10": 0,
                            "10-15": 0,
                            "15-60": 0
                        };
                        response['result']['time_report_hrs'][lab[so]] = {
                            "1-2": 0,
                            "2-3": 0,
                            "3-5": 0,
                            "5-10": 0,
                            "10-15": 0,
                            "15-60": 0
                        };
                        response['result']['time_report'][lab[so]] = {
                            "1-2": 0,
                            "2-3": 0,
                            "3-5": 0,
                            "5-10": 0,
                            "10-15": 0,
                            "15-60": 0
                        };

                    }
                }

                let weeklySum = [];
                var removeLoop = 0;
                for (so = 6; so >= 0; so--) {

                    var sumTotal = parseFloat(response['result']['time_report_hrs'][lab[so]]['1-2'] +
                        response['result']['time_report_hrs'][lab[so]]['2-3'] +
                        response['result']['time_report_hrs'][lab[so]]['3-5'] +
                        response['result']['time_report_hrs'][lab[so]]['5-10'] +
                        response['result']['time_report_hrs'][lab[so]]['10-15'] +
                        response['result']['time_report_hrs'][lab[so]]['15-60']);
                    weeklySum.push()
                    if (sumTotal > 0 && removeLoop == 0) {
                        removeLoop = 1;
                        if (so != 6) {
                            $('#data-activity').html(lab[so]);

                        }
                        $('#inactive_today').html(sumTotal.toFixed(2));
                    }
                }


                var dataset = [{
                    label: "1-2",
                    borderWidth: 0,
                    borderRadius: 1,
                    borderSkipped: false,
                    backgroundColor: "rgba(200, 105, 255, .6)",
                    data: [response['result']['time_report_hrs'][lab[0]]['1-2'], response['result']['time_report_hrs'][lab[1]]['1-2'], response['result']['time_report_hrs'][lab[2]]['1-2'], response['result']['time_report_hrs'][lab[3]]['1-2'], response['result']['time_report_hrs'][lab[4]]['1-2'], response['result']['time_report_hrs'][lab[5]]['1-2'], response['result']['time_report_hrs'][lab[6]]['1-2']],
                    maxBarThickness: 10,
                    hoverOffset: 4
                }, {
                    label: "2-3",
                    borderWidth: 0,
                    borderRadius: 1,
                    borderSkipped: false,
                    backgroundColor: "rgba(100, 155, 200, .6)",
                    data: [response['result']['time_report_hrs'][lab[0]]['2-3'], response['result']['time_report_hrs'][lab[1]]['2-3'], response['result']['time_report_hrs'][lab[2]]['2-3'], response['result']['time_report_hrs'][lab[3]]['2-3'], response['result']['time_report_hrs'][lab[4]]['2-3'], response['result']['time_report_hrs'][lab[5]]['2-3'], response['result']['time_report_hrs'][lab[6]]['2-3']],
                    maxBarThickness: 10,
                    hoverOffset: 4
                }, {
                    label: "3-5",
                    borderWidth: 0,
                    borderRadius: 1,
                    borderSkipped: false,
                    backgroundColor: "rgba(0, 200, 200, .6)",
                    data: [response['result']['time_report_hrs'][lab[0]]['3-5'], response['result']['time_report_hrs'][lab[1]]['3-5'], response['result']['time_report_hrs'][lab[2]]['3-5'], response['result']['time_report_hrs'][lab[3]]['3-5'], response['result']['time_report_hrs'][lab[4]]['3-5'], response['result']['time_report_hrs'][lab[5]]['3-5'], response['result']['time_report_hrs'][lab[6]]['3-5']],
                    maxBarThickness: 10,
                    hoverOffset: 4
                }, {
                    label: "5-10",
                    borderWidth: 0,
                    borderRadius: 1,
                    borderSkipped: false,
                    backgroundColor: "rgba(204,0,0, .6)",
                    data: [response['result']['time_report_hrs'][lab[0]]['5-10'], response['result']['time_report_hrs'][lab[1]]['5-10'], response['result']['time_report_hrs'][lab[2]]['5-10'], response['result']['time_report_hrs'][lab[3]]['5-10'], response['result']['time_report_hrs'][lab[4]]['5-10'], response['result']['time_report_hrs'][lab[5]]['5-10'], response['result']['time_report_hrs'][lab[6]]['5-10']],
                    maxBarThickness: 10,
                    hoverOffset: 4
                }, {
                    label: "10-15",
                    borderWidth: 0,
                    borderRadius: 1,
                    borderSkipped: false,
                    backgroundColor: "rgba(102,0,51, .6)",
                    data: [response['result']['time_report_hrs'][lab[0]]['10-15'], response['result']['time_report_hrs'][lab[1]]['10-15'], response['result']['time_report_hrs'][lab[2]]['10-15'], response['result']['time_report_hrs'][lab[3]]['10-15'], response['result']['time_report_hrs'][lab[4]]['10-15'], response['result']['time_report_hrs'][lab[5]]['10-15'], response['result']['time_report_hrs'][lab[6]]['10-15']],
                    maxBarThickness: 10,
                    hoverOffset: 4
                }, {
                    label: "15-60",
                    borderWidth: 0,
                    borderRadius: 1,
                    borderSkipped: false,
                    backgroundColor: "rgba(255,153,51, .6)",
                    data: [response['result']['time_report_hrs'][lab[0]]['15-60'], response['result']['time_report_hrs'][lab[1]]['15-60'], response['result']['time_report_hrs'][lab[2]]['15-60'], response['result']['time_report_hrs'][lab[3]]['15-60'], response['result']['time_report_hrs'][lab[4]]['15-60'], response['result']['time_report_hrs'][lab[5]]['15-60'], response['result']['time_report_hrs'][lab[6]]['15-60']],
                    maxBarThickness: 10,
                    hoverOffset: 4
                }];
                var tim_lmt_ar = ['1-2', '2-3', '3-5', '5-10', '10-15', '15-60'];
                total_hours = 0;
                total_wrk_hrs = 0;
                var yesterday_hrs;
                yesterday_hrs = [];

                for (l = 0; l <= lab.length; l++) {
                    var p = 0;
                    yesterday_hrs[lab[l]] = 0
                    for (s = 0; s <= tim_lmt_ar.length; s++) {
                        if (response['result']['time_report_hrs'][lab[l]] != undefined) {
                            if (response['result']['time_report_hrs'][lab[l]][tim_lmt_ar[s]] > 0) {

                                p = 1;
                                total_wrk_hrs = (response['result']['time_report_hrs'][lab[l]][tim_lmt_ar[s]] * 60) + total_wrk_hrs;
                                yesterday_hrs[lab[l]] = yesterday_hrs[lab[l]] + (response['result']['time_report_hrs'][lab[l]][tim_lmt_ar[s]] * 60);
                            }
                        }
                    }

                    if (p == 1) {
                        total_hours = total_hours + (3600 * 5.5);
                    }

                }

                var diff_number = (total_hours - total_wrk_hrs)
                console.log(total_hours)
                console.log(total_wrk_hrs)

                var non_prod = Math.round((total_wrk_hrs/ total_hours ) * 100);

                var s = 0;
                var processDate = 'Yesterday';
                var processDate_Count;
                processDate_Count = 0;
                for (var da = 5; da >= 0; da--) {

                    if (yesterday_hrs[lab[da]] > 0 && s == 0) {
                        processDate = lab[da];
                        const d = new Date();
                        let day = d.getDay();

                        if (day == 1) {

                            processDate_Count = yesterday_hrs[lab[3]];
                        } else {
                            processDate_Count = yesterday_hrs[lab[da]];

                            if (processDate_Count == 0) {
                                processDate_Count = yesterday_hrs[lab[da-1]];
                            }
                        }
                        s = s + 1;
                    }
                }

                var diff_number_1 = ((3600 * 7) - processDate_Count)

                var non_prod_1 = Math.round((processDate_Count/(3600 * 7)) * 100);


                var ctx2_dg = document.getElementById("chart-line-activity").getContext("2d");


                const alwaysShowTooltip = {
                    id: 'alwaysShowTooltip ',
                    afterDraw(chart, args, options) {


                        const {
                            ctx
                        } = chart;
                        ctx.save();
                        for (gx = 0; gx <= 1; gx++) {
                            const {
                                x,
                                y
                            } = chart.getDatasetMeta(0).data[gx].tooltipPosition();

                            const text = chart.data.labels[gx] + ':' + chart.data.datasets[0].data[gx];
                            const textWidth = ctx.measureText(text).width + 10;

                            ctx.fillStyle = 'rgb(0, 0, 0, 0.8)';
                            width = 20;
                            ctx.fillRect(x - (textWidth + 10) / 2, y - 25, textWidth + 10, 20)

                            ctx.beginPath();
                            ctx.moveTo(x, y);
                            ctx.lineTo(x + 5, y + 5);
                            ctx.lineTo(x + 15, y + 15);

                            ctx.fill();
                            ctx.restore();

                            ctx.font = '12 Arial';
                            ctx.fillStyle = 'white';
                            ctx.fillText(text + ' % ', x - (textWidth / 2), y - 11);
                            ctx.restore();

                        }

                    }
                }

                var cxprt = new Chart(ctx2_dg, {
                    type: 'doughnut',
                    data: {
                        labels: ["Barren", "Productive"],
                        datasets: [{
                            data: [ non_prod_1, (100 - non_prod_1)],
                            backgroundColor: [
                                'rgb(244, 67, 53)',
                                'rgb(102, 187, 106)'
                            ],
                            hoverOffset: 4
                        }]
                    },
                    options: {

                        responsive: true,
                        maintainAspectRatio: false,
                        color: 'rgba(255, 255, 255, .2)',
                        plugins: {
                            tooltip: {
                                enabled: true,
                            },
                            legend: {

                                display: false,

                            },


                        }
                    },
                    plugins: [alwaysShowTooltip]
                });


                var ctx2_dg = document.getElementById("chart-bars-activity").getContext("2d");
                var cxprt = new Chart(ctx2_dg, {
                    type: 'doughnut',
                    data: {
                        labels: ["Barren", "Productive"],
                        datasets: [{
                            data: [ non_prod, (100 - non_prod)],
                            backgroundColor: [
                                'rgb(244, 67, 53)',
                                'rgb(102, 187, 106)'
                            ],
                            hoverOffset: 4
                        }]
                    },
                    options: {

                        responsive: true,
                        maintainAspectRatio: false,
                        color: 'rgba(255, 255, 255, .2)',
                        plugins: {
                            tooltip: {
                                enabled: true,
                            },
                            legend: {

                                display: false,

                            },


                        }
                    },
                    plugins: [alwaysShowTooltip]
                });


                var timedata = new Chart(ctx, {
                    type: "bar",
                    data: {
                        labels: lab_num,
                        datasets: dataset,
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false,
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        var label = context.dataset.label || '';

                                        if (label) {
                                            label += ': ';
                                        }
                                        if (context.parsed.y !== null) {
                                            label += parseInt(context.parsed.y) + ' min';
                                        }
                                        return label;
                                    }
                                }
                            }
                        },
                        interaction: {
                            intersect: false,
                            mode: 'index',
                        },
                        scales: {
                            y: {
                                stacked: true,
                                grid: {
                                    drawBorder: false,
                                    display: true,
                                    drawOnChartArea: true,
                                    drawTicks: false,
                                    borderDash: [5, 5],
                                    color: 'rgba(255, 255, 255, .2)'
                                },
                                ticks: {
                                    suggestedMin: 0,
                                    suggestedMax: 500,
                                    beginAtZero: true,
                                    padding: 10,
                                    font: {
                                        size: 14,
                                        weight: 300,
                                        family: "Roboto",
                                        style: 'normal',
                                        lineHeight: 2
                                    },
                                    color: "#fff",
                                    callback: function(label, index, labels) {
                                        return label + ' min';

                                        // return _label;
                                    }
                                },
                            },
                            x: {
                                stacked: true,
                                grid: {
                                    drawBorder: false,
                                    display: true,
                                    drawOnChartArea: true,
                                    drawTicks: false,
                                    borderDash: [5, 5],
                                    color: 'rgba(255, 255, 255, .2)',

                                },
                                ticks: {
                                    display: true,
                                    color: '#f8f9fa',
                                    padding: 10,
                                    font: {
                                        size: 14,
                                        weight: 300,
                                        family: "Roboto",
                                        style: 'normal',
                                        lineHeight: 2
                                    }
                                }
                            },
                        },
                    },
                });




                var shippingCharbar = ShippingCharBar()
            },
        });
    }

$.ajax({
        type: "GET",
        url: "/report/tag/data",
        data: {},
        contentType: "application/json",
        dataType: "json",
        success: function(response) {
            tagDates = response['result']
            console.log(response)
            var ctx = document.getElementById("chart-line").getContext("2d");
            tags = Object.values(response['tags']);
                    var dataset = [];
                    for (w = 0; w <= tags.length; w++) {
                        var dataarr = []
                        for (o = 0; o <= 6; o++) {
                            if(tagDates[lab[o]] !== undefined){
                                var c = 0;
                                if (tagDates[lab[o]][tags[w]] !== undefined) {
                                    c = tagDates[lab[o]][tags[w]]
                                }
                                dataarr[o] = tagDates[lab[o]][tags[w]]
                            }
                        }
                        var dset = {
                            label: tags[w],
                            borderWidth: 0,
                            borderRadius: 1,
                            borderSkipped: false,
                            backgroundColor: color[w + 3],
                            data: dataarr,
                            maxBarThickness: 15
                        }
                        dataset.push(dset)

                    }




                    var timedata = new Chart(ctx, {
                        type: "bar",
                        data: {
                            labels: lab_num,
                            datasets: dataset,
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: false,
                                },
                                tooltip: {
                                    callbacks: {
                                        label: function(context) {
                                            var label = context.dataset.label || '';

                                            if (label) {
                                                label += ': ';
                                            }
                                            if (context.parsed.y !== null) {
                                                label += parseInt(context.parsed.y);
                                            }
                                            return label;
                                        }
                                    }
                                }
                            },
                            interaction: {
                                intersect: false,
                                mode: 'index',
                            },
                            scales: {
                                y: {
                                    stacked: true,
                                    grid: {
                                        drawBorder: false,
                                        display: true,
                                        drawOnChartArea: true,
                                        drawTicks: false,
                                        borderDash: [5, 5],
                                        color: 'rgba(255, 255, 255, .2)'
                                    },
                                    ticks: {
                                        suggestedMin: 0,
                                        suggestedMax: 500,
                                        beginAtZero: true,
                                        padding: 10,
                                        font: {
                                            size: 14,
                                            weight: 300,
                                            family: "Roboto",
                                            style: 'normal',
                                            lineHeight: 2
                                        },
                                        color: "#fff",
                                        callback: function(label, index, labels) {
                                            return label;

                                            // return _label;
                                        }
                                    },
                                },
                                x: {
                                    stacked: true,
                                    grid: {
                                        drawBorder: false,
                                        display: true,
                                        drawOnChartArea: true,
                                        drawTicks: false,
                                        borderDash: [5, 5],
                                        color: 'rgba(255, 255, 255, .2)',

                                    },
                                    ticks: {
                                        display: true,
                                        color: '#f8f9fa',
                                        padding: 10,
                                        font: {
                                            size: 14,
                                            weight: 300,
                                            family: "Roboto",
                                            style: 'normal',
                                            lineHeight: 2
                                        }
                                    }
                                },
                            },
                        },
                    });
        }
    });

        function ShippingCharBar() {
            $.ajax({
                type: "GET",
                url: "report/shipping",
                data: {},
                contentType: "application/json",
                dataType: "json",
                success: function(response) {


                    var ctx = document.getElementById("chart-bars-shipping").getContext("2d");

                    firstShipping = response['result']['pretime'];
                    timeIntervalCount = response['result']['hrShippingCount']
                    shippingCusCount = response['result']['shipping_cus_count']
                    warehouses = response['result']['warehouses']
                    customers = response['result']['customers']





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

                    for (so = 0; so <= 6; so++) {
                        if (response['result']['time_report_count'][lab[so]] === undefined) {
                            response['result']['time_report_count'][lab[so]] = {
                                "0-1": 0,
                                "1-2": 0,
                                "2-3": 0,
                                "3-5": 0,
                                "5-10": 0,
                                "10-15": 0,
                                "15-60": 0
                            };
                            response['result']['time_report_hrs'][lab[so]] = {
                                "0-1": 0,
                                "1-2": 0,
                                "2-3": 0,
                                "3-5": 0,
                                "5-10": 0,
                                "10-15": 0,
                                "15-60": 0
                            };
                            response['result']['time_report'][lab[so]] = {
                                "0-1": 0,
                                "1-2": 0,
                                "2-3": 0,
                                "3-5": 0,
                                "5-10": 0,
                                "10-15": 0,
                                "15-60": 0
                            };

                        }
                    }



                    var dataset = [{
                        label: "0-1",
                        tension: 0.8,
                        borderWidth: 0,
                        borderRadius: 0,
                        borderSkipped: false,
                        backgroundColor: "rgba(255,69,0, .6)",
                        data: [response['result']['time_report_hrs'][lab[0]]['0-1'], response['result']['time_report_hrs'][lab[1]]['0-1'], response['result']['time_report_hrs'][lab[2]]['0-1'], response['result']['time_report_hrs'][lab[3]]['0-1'], response['result']['time_report_hrs'][lab[4]]['0-1'], response['result']['time_report_hrs'][lab[5]]['0-1'], response['result']['time_report_hrs'][lab[6]]['0-1']],
                        maxBarThickness: 10
                    }, {
                        label: "1-2",
                        tension: 0.8,
                        borderWidth: 0,
                        borderRadius: 0,
                        borderSkipped: false,
                        backgroundColor: "rgba(255,215,0, .6)",
                        data: [response['result']['time_report_hrs'][lab[0]]['1-2'], response['result']['time_report_hrs'][lab[1]]['1-2'], response['result']['time_report_hrs'][lab[2]]['1-2'], response['result']['time_report_hrs'][lab[3]]['1-2'], response['result']['time_report_hrs'][lab[4]]['1-2'], response['result']['time_report_hrs'][lab[5]]['1-2'], response['result']['time_report_hrs'][lab[6]]['1-2']],
                        maxBarThickness: 10
                    }, {
                        label: "2-3",
                        tension: 0.8,
                        borderWidth: 0,
                        borderRadius: 0,
                        borderSkipped: false,
                        backgroundColor: "rgba(100, 155, 200, .6)",
                        data: [response['result']['time_report_hrs'][lab[0]]['2-3'], response['result']['time_report_hrs'][lab[1]]['2-3'], response['result']['time_report_hrs'][lab[2]]['2-3'], response['result']['time_report_hrs'][lab[3]]['2-3'], response['result']['time_report_hrs'][lab[4]]['2-3'], response['result']['time_report_hrs'][lab[5]]['2-3'], response['result']['time_report_hrs'][lab[6]]['2-3']],
                        maxBarThickness: 10
                    }, {
                        label: "3-5",
                        tension: 0.8,
                        borderWidth: 0,
                        borderRadius: 0,
                        borderSkipped: false,
                        backgroundColor: "rgba(0, 200, 200, .6)",
                        data: [response['result']['time_report_hrs'][lab[0]]['3-5'], response['result']['time_report_hrs'][lab[1]]['3-5'], response['result']['time_report_hrs'][lab[2]]['3-5'], response['result']['time_report_hrs'][lab[3]]['3-5'], response['result']['time_report_hrs'][lab[4]]['3-5'], response['result']['time_report_hrs'][lab[5]]['3-5'], response['result']['time_report_hrs'][lab[6]]['3-5']],
                        maxBarThickness: 10
                    }, {
                        label: "5-10",
                        tension: 0.8,
                        borderWidth: 0,
                        borderRadius: 0,
                        borderSkipped: false,
                        backgroundColor: "rgba(204,0,0, .6)",
                        data: [response['result']['time_report_hrs'][lab[0]]['5-10'], response['result']['time_report_hrs'][lab[1]]['5-10'], response['result']['time_report_hrs'][lab[2]]['5-10'], response['result']['time_report_hrs'][lab[3]]['5-10'], response['result']['time_report_hrs'][lab[4]]['5-10'], response['result']['time_report_hrs'][lab[5]]['5-10'], response['result']['time_report_hrs'][lab[6]]['5-10']],
                        maxBarThickness: 10
                    }, {
                        label: "10-15",
                        tension: 0.8,
                        borderWidth: 0,
                        borderRadius: 0,
                        borderSkipped: false,
                        backgroundColor: "rgba(102,0,51, .6)",
                        data: [response['result']['time_report_hrs'][lab[0]]['10-15'], response['result']['time_report_hrs'][lab[1]]['10-15'], response['result']['time_report_hrs'][lab[2]]['10-15'], response['result']['time_report_hrs'][lab[3]]['10-15'], response['result']['time_report_hrs'][lab[4]]['10-15'], response['result']['time_report_hrs'][lab[5]]['10-15'], response['result']['time_report_hrs'][lab[6]]['10-15']],
                        maxBarThickness: 10
                    }, {
                        label: "15-60",
                        tension: 0.8,
                        borderWidth: 0,
                        borderRadius: 0,
                        borderSkipped: false,
                        backgroundColor: "rgba(255,153,51, .6)",
                        data: [response['result']['time_report_hrs'][lab[0]]['15-60'], response['result']['time_report_hrs'][lab[1]]['15-60'], response['result']['time_report_hrs'][lab[2]]['15-60'], response['result']['time_report_hrs'][lab[3]]['15-60'], response['result']['time_report_hrs'][lab[4]]['15-60'], response['result']['time_report_hrs'][lab[5]]['15-60'], response['result']['time_report_hrs'][lab[6]]['15-60']],
                        maxBarThickness: 10
                    }];
                    var timedata = new Chart(ctx, {
                        type: "bar",
                        data: {
                            labels: lab_num,
                            datasets: dataset,
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: false,
                                },
                                tooltip: {
                                    callbacks: {
                                        label: function(context) {
                                            var label = context.dataset.label || '';

                                            if (label) {
                                                label += ': ';
                                            }
                                            if (context.parsed.y !== null) {
                                                label += parseInt(context.parsed.y) + ' min';
                                            }
                                            return label;
                                        }
                                    }
                                }
                            },
                            interaction: {
                                intersect: false,
                                mode: 'index',
                            },
                            scales: {
                                y: {
                                    stacked: true,
                                    grid: {
                                        drawBorder: false,
                                        display: true,
                                        drawOnChartArea: true,
                                        drawTicks: false,
                                        borderDash: [5, 5],
                                        color: 'rgba(255, 255, 255, .2)'
                                    },
                                    ticks: {
                                        suggestedMin: 0,
                                        suggestedMax: 500,
                                        beginAtZero: true,
                                        padding: 10,
                                        font: {
                                            size: 14,
                                            weight: 300,
                                            family: "Roboto",
                                            style: 'normal',
                                            lineHeight: 2
                                        },
                                        color: "#fff",
                                        callback: function(label, index, labels) {
                                            return label + ' min';

                                            // return _label;
                                        }
                                    },
                                },
                                x: {
                                    stacked: true,
                                    grid: {
                                        drawBorder: false,
                                        display: true,
                                        drawOnChartArea: true,
                                        drawTicks: false,
                                        borderDash: [5, 5],
                                        color: 'rgba(255, 255, 255, .2)',

                                    },
                                    ticks: {
                                        display: true,
                                        color: '#f8f9fa',
                                        padding: 10,
                                        font: {
                                            size: 14,
                                            weight: 300,
                                            family: "Roboto",
                                            style: 'normal',
                                            lineHeight: 2
                                        }
                                    }
                                },
                            },
                        },
                    });

                    var ctx2 = document.getElementById("chart-line-shipping").getContext("2d");
                    var dataset = [{
                        label: "0-1",
                        tension: 0.8,
                        borderWidth: 0,
                        borderRadius: 0,
                        borderSkipped: false,
                        backgroundColor: "rgba(255,69,0, .6)",
                        data: [response['result']['time_report_count'][lab[0]]['0-1'], response['result']['time_report_count'][lab[1]]['0-1'], response['result']['time_report_count'][lab[2]]['0-1'], response['result']['time_report_count'][lab[3]]['0-1'], response['result']['time_report_count'][lab[4]]['0-1'], response['result']['time_report_count'][lab[5]]['0-1'], response['result']['time_report_count'][lab[6]]['0-1']],
                        maxBarThickness: 10
                    }, {
                        label: "1-2",
                        tension: 0.8,
                        borderWidth: 0,
                        borderRadius: 0,
                        borderSkipped: false,
                        backgroundColor: "rgba(255,215,0, .6)",
                        data: [response['result']['time_report_count'][lab[0]]['1-2'], response['result']['time_report_count'][lab[1]]['1-2'], response['result']['time_report_count'][lab[2]]['1-2'], response['result']['time_report_count'][lab[3]]['1-2'], response['result']['time_report_count'][lab[4]]['1-2'], response['result']['time_report_count'][lab[5]]['1-2'], response['result']['time_report_count'][lab[6]]['1-2']],
                        maxBarThickness: 10
                    }, {
                        label: "2-3",
                        tension: 0.8,
                        borderWidth: 0,
                        borderRadius: 0,
                        borderSkipped: false,
                        backgroundColor: "rgba(100, 155, 200, .6)",
                        data: [response['result']['time_report_count'][lab[0]]['2-3'], response['result']['time_report_count'][lab[1]]['2-3'], response['result']['time_report_count'][lab[2]]['2-3'], response['result']['time_report_count'][lab[3]]['2-3'], response['result']['time_report_count'][lab[4]]['2-3'], response['result']['time_report_count'][lab[5]]['2-3'], response['result']['time_report_count'][lab[6]]['2-3']],
                        maxBarThickness: 10
                    }, {
                        label: "3-5",
                        tension: 0.8,
                        borderWidth: 0,
                        borderRadius: 0,
                        borderSkipped: false,
                        backgroundColor: "rgba(0, 200, 200, .6)",
                        data: [response['result']['time_report_count'][lab[0]]['3-5'], response['result']['time_report_count'][lab[1]]['3-5'], response['result']['time_report_count'][lab[2]]['3-5'], response['result']['time_report_count'][lab[3]]['3-5'], response['result']['time_report_count'][lab[4]]['3-5'], response['result']['time_report_count'][lab[5]]['3-5'], response['result']['time_report_count'][lab[6]]['3-5']],
                        maxBarThickness: 10
                    }, {
                        label: "5-10",
                        tension: 0.8,
                        borderWidth: 0,
                        borderRadius: 0,
                        borderSkipped: false,
                        backgroundColor: "rgba(204,0,0, .6)",
                        data: [response['result']['time_report_count'][lab[0]]['5-10'], response['result']['time_report_count'][lab[1]]['5-10'], response['result']['time_report_count'][lab[2]]['5-10'], response['result']['time_report_count'][lab[3]]['5-10'], response['result']['time_report_count'][lab[4]]['5-10'], response['result']['time_report_count'][lab[5]]['5-10'], response['result']['time_report_count'][lab[6]]['5-10']],
                        maxBarThickness: 10
                    }, {
                        label: "10-15",
                        tension: 0.8,
                        borderWidth: 0,
                        borderRadius: 0,
                        borderSkipped: false,
                        backgroundColor: "rgba(102,0,51, .6)",
                        data: [response['result']['time_report_count'][lab[0]]['10-15'], response['result']['time_report_count'][lab[1]]['10-15'], response['result']['time_report_count'][lab[2]]['10-15'], response['result']['time_report_count'][lab[3]]['10-15'], response['result']['time_report_count'][lab[4]]['10-15'], response['result']['time_report_count'][lab[5]]['10-15'], response['result']['time_report_count'][lab[6]]['10-15']],
                        maxBarThickness: 10
                    }, {
                        label: "15-60",
                        tension: 0.8,
                        borderWidth: 0,
                        borderRadius: 0,
                        borderSkipped: false,
                        backgroundColor: "rgba(255,153,51, .6)",
                        data: [response['result']['time_report_count'][lab[0]]['15-60'], response['result']['time_report_count'][lab[1]]['15-60'], response['result']['time_report_count'][lab[2]]['15-60'], response['result']['time_report_count'][lab[3]]['15-60'], response['result']['time_report_count'][lab[4]]['15-60'], response['result']['time_report_count'][lab[5]]['15-60'], response['result']['time_report_count'][lab[6]]['15-60']],
                        maxBarThickness: 10
                    }];
                    var timedata = new Chart(ctx2, {
                        type: "bar",
                        data: {
                            labels: lab_num,
                            datasets: dataset,
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: false,
                                },
                                tooltip: {
                                    callbacks: {
                                        label: function(context) {
                                            var label = context.dataset.label || '';

                                            if (label) {
                                                label += ': ';
                                            }
                                            if (context.parsed.y !== null) {
                                                label += parseInt(context.parsed.y) + '';
                                            }
                                            return label;
                                        }
                                    }
                                }
                            },
                            interaction: {
                                intersect: false,
                                mode: 'index',
                            },
                            scales: {
                                y: {
                                    stacked: true,
                                    grid: {
                                        drawBorder: false,
                                        display: true,
                                        drawOnChartArea: true,
                                        drawTicks: false,
                                        borderDash: [5, 5],
                                        color: 'rgba(255, 255, 255, .2)'
                                    },
                                    ticks: {
                                        suggestedMin: 0,
                                        suggestedMax: 500,
                                        beginAtZero: true,
                                        padding: 10,
                                        font: {
                                            size: 14,
                                            weight: 300,
                                            family: "Roboto",
                                            style: 'normal',
                                            lineHeight: 2
                                        },
                                        color: "#fff",
                                        callback: function(label, index, labels) {
                                            return label + '';

                                            // return _label;
                                        }
                                    },
                                },
                                x: {
                                    stacked: true,
                                    grid: {
                                        drawBorder: false,
                                        display: true,
                                        drawOnChartArea: true,
                                        drawTicks: false,
                                        borderDash: [5, 5],
                                        color: 'rgba(255, 255, 255, .2)',

                                    },
                                    ticks: {
                                        display: true,
                                        color: '#f8f9fa',
                                        padding: 10,
                                        font: {
                                            size: 14,
                                            weight: 300,
                                            family: "Roboto",
                                            style: 'normal',
                                            lineHeight: 2
                                        }
                                    }
                                },
                            },
                        },
                    });





                    var ctx = document.getElementById("chart-bars-warehouse").getContext("2d");
                    customers = Object.values(customers);
                    var dataset = [];
                    for (w = 0; w <= customers.length; w++) {
                        var dataarr = []
                        for (o = 0; o <= 6; o++) {
                            var c = 0;
                            if (shippingCusCount[lab[o]][customers[w]] !== undefined) {
                                c = shippingCusCount[lab[o]][customers[w]]
                            }
                            dataarr[o] = shippingCusCount[lab[o]][customers[w]]
                        }
                        var dset = {
                            label: customers[w],
                            borderWidth: 0,
                            borderRadius: 1,
                            borderSkipped: false,
                            backgroundColor: color[w + 2],
                            data: dataarr,
                            maxBarThickness: 15
                        }
                        dataset.push(dset)

                    }




                    var timedata = new Chart(ctx, {
                        type: "bar",
                        data: {
                            labels: lab_num,
                            datasets: dataset,
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: false,
                                },
                                tooltip: {
                                    callbacks: {
                                        label: function(context) {
                                            var label = context.dataset.label || '';

                                            if (label) {
                                                label += ': ';
                                            }
                                            if (context.parsed.y !== null) {
                                                label += parseInt(context.parsed.y);
                                            }
                                            return label;
                                        }
                                    }
                                }
                            },
                            interaction: {
                                intersect: false,
                                mode: 'index',
                            },
                            scales: {
                                y: {
                                    stacked: true,
                                    grid: {
                                        drawBorder: false,
                                        display: true,
                                        drawOnChartArea: true,
                                        drawTicks: false,
                                        borderDash: [5, 5],
                                        color: 'rgba(255, 255, 255, .2)'
                                    },
                                    ticks: {
                                        suggestedMin: 0,
                                        suggestedMax: 500,
                                        beginAtZero: true,
                                        padding: 10,
                                        font: {
                                            size: 14,
                                            weight: 300,
                                            family: "Roboto",
                                            style: 'normal',
                                            lineHeight: 2
                                        },
                                        color: "#fff",
                                        callback: function(label, index, labels) {
                                            return label;

                                            // return _label;
                                        }
                                    },
                                },
                                x: {
                                    stacked: true,
                                    grid: {
                                        drawBorder: false,
                                        display: true,
                                        drawOnChartArea: true,
                                        drawTicks: false,
                                        borderDash: [5, 5],
                                        color: 'rgba(255, 255, 255, .2)',

                                    },
                                    ticks: {
                                        display: true,
                                        color: '#f8f9fa',
                                        padding: 10,
                                        font: {
                                            size: 14,
                                            weight: 300,
                                            family: "Roboto",
                                            style: 'normal',
                                            lineHeight: 2
                                        }
                                    }
                                },
                            },
                        },
                    });

                    var chartLine = ChartLine(lab)

                },
            });


        }

    function ChartLine(lab) {

        var lab = []
        var lab_num = []
        for (var da = 7; da >= 0; da--) {
            var date = new Date();
            date.setDate(date.getDate() - da);

            var finalDate = ("0" + date.getDate()).slice(-2) + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear();
            var finalDateNum = ("0" + (date.getMonth() + 1)).slice(-2) + '/' + ("0" + date.getDate()).slice(-2);
            lab.push(finalDate)
            lab_num.push(finalDateNum)
        }

        // var ctx2 = document.getElementById("chart-line").getContext("2d");

        // for (so = 0; so <= 6; so++) {
        //     if (firstMotion[lab[so]] === undefined) {
        //         firstMotion[lab[so]] = 0;
        //         firstShipping[lab[so]] = 0;

        //     }
        // }

        // new Chart(ctx2, {
        //     type: "line",
        //     data: {
        //         labels: lab_num,
        //         datasets: [{
        //             label: "Boxing area",
        //             tension: 0,
        //             borderWidth: 0,
        //             pointRadius: 5,
        //             pointBackgroundColor: "rgba(255, 255, 255, .6)",
        //             pointBorderColor: "transparent",
        //             borderColor: "rgba(255, 255, 255, .6)",
        //             borderColor: "rgba(255, 255, 255, .6)",
        //             borderWidth: 4,
        //             backgroundColor: "transparent",
        //             fill: true,
        //             data: [parseInt(firstShipping[lab[0]] - firstMotion[lab[0]]) / 60, parseInt(firstShipping[lab[1]] - firstMotion[lab[1]]) / 60, parseInt(firstShipping[lab[2]] - firstMotion[lab[2]]) / 60, parseInt(firstShipping[lab[3]] - firstMotion[lab[3]] ) / 60, parseInt(firstShipping[lab[4]] - firstMotion[lab[4]] ) / 60, parseInt(firstShipping[lab[5]]- firstMotion[lab[5]] ) / 60, parseInt(firstShipping[lab[6]] - firstMotion[lab[6]] ) / 60],
        //             maxBarThickness: 6,
        //             hoverOffset: 4

        //         }],
        //     },
        //     options: {
        //         responsive: true,
        //         maintainAspectRatio: false,
        //         plugins: {
        //             legend: {
        //                 display: false,
        //             },
        //             tooltip: {
        //                 callbacks: {
        //                     label: function(context) {
        //                         var label = context.dataset.label || '';

        //                         if (label) {
        //                             label += ': ';
        //                         }
        //                         if (context.parsed.y !== null) {
        //                             label += parseInt(context.parsed.y) + ' min';
        //                         }
        //                         return label;
        //                     }
        //                 }
        //             }
        //         },
        //         interaction: {
        //             intersect: false,
        //             mode: 'index',
        //         },
        //         scales: {
        //             y: {
        //                 grid: {
        //                     drawBorder: false,
        //                     display: true,
        //                     drawOnChartArea: true,
        //                     drawTicks: false,
        //                     borderDash: [5, 5],
        //                     color: 'rgba(255, 255, 255, .2)'
        //                 },
        //                 ticks: {
        //                     display: true,
        //                     color: '#f8f9fa',
        //                     callback: function(label, index, labels) {
        //                         return label + ' min';

        //                         // return _label;
        //                     },
        //                     padding: 10,
        //                     font: {
        //                         size: 14,
        //                         weight: 300,
        //                         family: "Roboto",
        //                         style: 'normal',
        //                         lineHeight: 2
        //                     },
        //                 }
        //             },
        //             x: {
        //                 grid: {
        //                     drawBorder: false,
        //                     display: false,
        //                     drawOnChartArea: false,
        //                     drawTicks: false,
        //                     borderDash: [5, 5]
        //                 },
        //                 ticks: {
        //                     display: true,
        //                     color: '#f8f9fa',
        //                     padding: 10,
        //                     font: {
        //                         size: 14,
        //                         weight: 300,
        //                         family: "Roboto",
        //                         style: 'normal',
        //                         lineHeight: 2
        //                     },
        //                 }
        //             },
        //         },
        //     },
        // });




        var chartLineData = chartLineDataAdd()

    }



    function chartLineDataAdd() {
        var ctx2 = document.getElementById("chart-line-date").getContext("2d");

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

        for (so = 0; so <= 6; so++) {
            if (timeIntervalCount[lab[so]] === undefined) {
                timeIntervalCount[lab[so]] = {
                    0: 0,
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0,
                    6: 0,
                    7: 0,
                    8: 0,
                    9: 0,
                    10: 0,
                    11: 0,
                    12: 0,
                    13: 0,
                    14: 0,
                    15: 0,
                    16: 0,
                    17: 0,
                    18: 0,
                    19: 0,
                    20: 0,
                    21: 0,
                    22: 0,
                    23: 0
                };
            }
        }


        var data = {
            labels: lab_num,
            datasets: []
        };

        var cxp = new Chart(ctx2, {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                color: 'rgba(255, 255, 255, .2)',
                plugins: {
                    legend: {
                        position: false,
                    },
                    scales: {
                        y: {
                            grid: {
                                drawBorder: false,
                                display: true,
                                drawOnChartArea: true,
                                drawTicks: false,
                                borderDash: [5, 5],
                                color: 'rgba(255, 255, 255, .2)'
                            },
                            ticks: {
                                display: true,
                                color: '#f8f9fa',
                                callback: function(label, index, labels) {
                                    return label + ' min';

                                    // return _label;
                                },
                                padding: 10,
                                font: {
                                    size: 14,
                                    weight: 300,
                                    family: "Roboto",
                                    style: 'normal',
                                    lineHeight: 2
                                },
                            }
                        },
                        x: {
                            grid: {
                                drawBorder: false,
                                display: false,
                                drawOnChartArea: false,
                                drawTicks: false,
                                borderDash: [5, 5]
                            },
                            ticks: {
                                display: true,
                                color: '#f8f9fa',
                                padding: 10,
                                font: {
                                    size: 14,
                                    weight: 300,
                                    family: "Roboto",
                                    style: 'normal',
                                    lineHeight: 2
                                },
                            }
                        },
                    }
                }
            },
        });

        var lb_hrs = {};
        for (xp = 0; xp <= 6; xp++) {
            for (x = 0; x <= 23; x++) {
                if (parseInt(timeIntervalCount[lab[xp]][x]) > 0) {
                var frm_chat = lab[xp].split("-")
                    $('#hr-t-body').prepend('<tr><td><div class="d-flex px-2 py-1"><div class="d-flex flex-column justify-content-center"><span class="mb-0 text-sm">' +frm_chat[2]+'-'+frm_chat[1]+'-'+frm_chat[0]+ ' ' + x + ':00:00</span></div></div></td><td><p class="text-xs font-weight-bold mb-0">' + timeIntervalCount[lab[xp]][x] + '</p></td></tr>');
                }
            }
        }
        for (x = 0; x <= 23; x++) {

            lb_hrs[x] = x + 'hrs';
            var newDataset = {
                label: 'Hr ' + (x),
                backgroundColor: color[x],
                borderWidth: 0,
                tension: 0,
                maxBarThickness: 1,
                hoverOffset: 4
            };
            cxp.data.datasets.push(newDataset);
            cxp.update();

            for (xp = 0; xp <= 6; xp++) {
                cxp.data.datasets[x].data.push(timeIntervalCount[lab[xp]][x]);

            }
        }



        var weekTotal;
        weekTotal = 0;
        var yesterday_total;
        yesterday_total = 0;
        var pre_yesterday_total;
        pre_yesterday_total = 0;
        var high_volume;
        high_volume = 0;
        removeLoop = 0;
        var hrCount;
        hrCount = [];
        for (xp = 6; xp >= 0; xp--) {
            if (yesterday_total > 0 && removeLoop == 0) {
                removeLoop = 1
            }
            for (x = 0; x <= 23; x++) {
                weekTotal = timeIntervalCount[lab[xp]][x] + weekTotal;
                hrCount.push(timeIntervalCount[lab[xp]][x]);
                if (removeLoop == 0) {

                    if (xp != 6) {
                        $('#yes_shipment').html(lab[xp]);
                    }
                    yesterday_total = timeIntervalCount[lab[xp]][x] + yesterday_total;

                    const d = new Date();

                    let day = d.getDay();
                    if (day == 1) {
                        pre_yesterday_total = timeIntervalCount[lab[3]][x] + pre_yesterday_total;
                    } else {
                        pre_yesterday_total = timeIntervalCount[lab[xp - 1]][x] + pre_yesterday_total;
                    }

                    if (high_volume < timeIntervalCount[lab[xp]][x]) {
                        high_volume = timeIntervalCount[lab[xp]][x];

                    }
                }


            }
        }

        let max = -Infinity,
            result = -Infinity;

        for (const value of hrCount) {
            const nr = Number(value)

            if (nr > max) {
                [result, max] = [max, nr] // save previous max
            } else if (nr < max && nr > result) {
                result = nr; // new second biggest
            }
        }




        $('#week_shipment').html(weekTotal);
        var diff_number = (weekTotal - last_week_count)
        if (diff_number > 0) {
            $('#last_week_count').addClass("text-success");
        } else {
            $('#last_week_count').addClass("text-danger");
        }
        $('#last_week_count').html(Math.round((diff_number / last_week_count) * 100) + '% ');
        $('#yesterday_total').html(yesterday_total);
        $('#high_volume').html(high_volume);
        var diff_number = (yesterday_total - pre_yesterday_total)


        if (diff_number > 0) {
            $('#pre_yesterday_count').addClass("text-success");
        } else {
            $('#pre_yesterday_count').addClass("text-danger");
        }
        $('#pre_yesterday_count').html(Math.round((diff_number / pre_yesterday_total) * 100) + '% ');

        var diff_number = (high_volume - result)

        if (diff_number > 0) {
            $('#last_volume_highest').addClass("text-success");
        } else {
            $('#last_volume_highest').addClass("text-danger");
        }
        $('#last_volume_highest').html(Math.round((diff_number / high_volume) * 100) + '% ');

        var diff_number_1 = ((150 * 7 * 5.5) - weekTotal)


        var non_prod_1 = Math.round((weekTotal/diff_number_1) * 100);


        var ctx2_dg = document.getElementById("chart-line-activity-Shipping").getContext("2d");


        const alwaysShowTooltipadded = {
            id: 'alwaysShowTooltipadded ',
            afterDraw(chart, args, options) {


                const {
                    ctx
                } = chart;
                ctx.save();
                for (gx = 0; gx <= 1; gx++) {
                    const {
                        x,
                        y
                    } = chart.getDatasetMeta(0).data[gx].tooltipPosition();

                    const text = chart.data.labels[gx] + ':' + chart.data.datasets[0].data[gx];
                    const textWidth = ctx.measureText(text).width + 10;

                    ctx.fillStyle = 'rgb(0, 0, 0, 0.8)';
                    width = 20;
                    ctx.fillRect(x - (textWidth + 10) / 2, y - 25, textWidth + 10, 20)

                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + 5, y + 5);
                    ctx.lineTo(x + 15, y + 15);

                    ctx.fill();
                    ctx.restore();

                    ctx.font = '12 Arial';
                    ctx.fillStyle = 'white';
                    ctx.fillText(text + ' % ', x - (textWidth / 2), y - 11);
                    ctx.restore();

                }

            }
        }

        var cxprt = new Chart(ctx2_dg, {
            type: 'doughnut',
            data: {
                labels: ["Barren", "Productive"],
                datasets: [{
                    data: [ non_prod_1, (100 - non_prod_1)],
                    backgroundColor: [
                        'rgb(244, 67, 53)',
                        'rgb(102, 187, 106)'
                    ],
                    hoverOffset: 4
                }]
            },
            options: {

                responsive: true,
                maintainAspectRatio: false,
                color: 'rgba(255, 255, 255, .2)',
                plugins: {
                    tooltip: {
                        enabled: true,
                    },
                    legend: {

                        display: false,

                    },


                }
            },
            plugins: [alwaysShowTooltipadded]
        });




        var ctx2 = document.getElementById("chart-doughnut").getContext("2d");


        var newcolor = [];
        var newLab = [];
        var pp = 0;
        var pp = 0;
        for (x = 0; x <= 23; x++) {
            var sum = 0;
            for (xp = 0; xp <= 6; xp++) {
                sum = sum + timeIntervalCount[lab[xp]][x];

            }
            if (sum > 0) {
                newcolor[pp] = color[x];
                newLab[x + 'Hrs'] = x + 'Hrs';
                pp = pp + 1;
            }
        }


        var xpop = 0;
        var data = {
            labels: newLab,
            datasets: []
        };
        const alwaysShowTooltip = {
            id: 'alwaysShowTooltip ',
            afterDraw(chart, args, options) {


                const {
                    ctx
                } = chart;
                ctx.save();
                for (gx = 0; gx <= 23; gx++) {
                    const {
                        x,
                        y
                    } = chart.getDatasetMeta(0).data[gx].tooltipPosition();

                    const text = chart.data.labels[gx] + ':' + chart.data.datasets[0].data[gx];
                    const textWidth = ctx.measureText(text).width;
                    ctx.fillStyle = 'rgb(0, 0, 0, 0.8)';
                    width = 20;
                    ctx.fillRect(x - (textWidth + 10) / 2, y - 25, textWidth + 10, 20)

                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + 5, y + 5);
                    ctx.lineTo(x + 15, y + 15);
                    ctx.fill();
                    ctx.restore();

                    ctx.font = '12 Arial';
                    ctx.fillStyle = 'white';
                    ctx.fillText(text, x - (textWidth / 2), y - 11);
                    ctx.restore();

                    xpop = xpop + 1;
                }
    }
}

var pp = 0; lab_data = []; data_set = [];
for (x = 0; x <= 23; x++) {
    var sum = 0;
    for (xp = 0; xp <= 6; xp++) {
        sum = sum + timeIntervalCount[lab[xp]][x];

    }
    lab_data.push(x + 'Hr');
    data_set.push(sum);

}

var cxprt = new Chart(ctx2, {
    type: 'doughnut',
    data: {
        labels: lab_data,
        datasets: [{
            data: data_set,
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(0, 205, 86)',
                'rgb(255, 205, 86)',
                'rgb(255, 2, 86)',
                'rgb(26, 205, 86)',
                'rgb(255, 100, 86)',
                'rgb(150, 45, 255)',
                'rgb(255, 255, 86)',
                'rgb(100, 255, 86)',
                'rgb(255, 0, 0)',
                'rgb(255, 125, 255)',
                'rgb(255, 75, 120)',
                'rgb(0, 200, 86)',
                'rgb(255, 150, 86)',
                'rgb(100, 150, 36)',
                'rgb(200, 100, 0)',
                'rgb(255, 100, 86)',
                'rgb(255, 45, 30)',
                'rgb(12, 205, 86)',
                'rgb(255, 0, 86)',
                'rgb(25, 205, 86)',
                'rgb(255, 22, 86)',
                'rgb(255, 3, 86)'
            ],
            hoverOffset: 4
        }]
    },
    options: {

        responsive: true,
        maintainAspectRatio: false,
        color: 'rgba(255, 255, 255, .2)',
        plugins: {
            tooltip: {
                enabled: true,
            },
            legend: {

                display: false,

            },


        }
    },
    plugins: [alwaysShowTooltip]
});
}
});