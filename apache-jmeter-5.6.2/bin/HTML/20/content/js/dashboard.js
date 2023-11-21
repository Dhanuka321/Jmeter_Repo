/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.93686868686869, "KoPercent": 0.06313131313131314};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.12435476302205538, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Select a Game"], "isController": true}, {"data": [0.13186813186813187, 500, 1500, "/deposits-145"], "isController": false}, {"data": [1.0, 500, 1500, "/css/app.css-173"], "isController": false}, {"data": [0.0, 500, 1500, "Log Out"], "isController": true}, {"data": [0.975, 500, 1500, "/js/app.js-39"], "isController": false}, {"data": [0.1715686274509804, 500, 1500, "/login-113"], "isController": false}, {"data": [0.011764705882352941, 500, 1500, "/logout-400"], "isController": false}, {"data": [0.041237113402061855, 500, 1500, "/login-144"], "isController": false}, {"data": [0.07211538461538461, 500, 1500, "/-37"], "isController": false}, {"data": [0.17010309278350516, 500, 1500, "/login-141"], "isController": false}, {"data": [0.12941176470588237, 500, 1500, "/logout-400-0"], "isController": false}, {"data": [0.07211538461538461, 500, 1500, "Home Page"], "isController": true}, {"data": [0.1568627450980392, 500, 1500, "Click On Login Button"], "isController": true}, {"data": [1.0, 500, 1500, "/css/app.css-146"], "isController": false}, {"data": [0.01764705882352941, 500, 1500, "/logout-400-1"], "isController": false}, {"data": [0.06741573033707865, 500, 1500, "/games/play-204"], "isController": false}, {"data": [0.09770114942528736, 500, 1500, "/games/play-223"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": true}, {"data": [0.08333333333333333, 500, 1500, "/games/10-171"], "isController": false}, {"data": [0.09302325581395349, 500, 1500, "/games/play-262"], "isController": false}, {"data": [0.10344827586206896, 500, 1500, "/games/10-227"], "isController": false}, {"data": [0.03529411764705882, 500, 1500, "/-403"], "isController": false}, {"data": [0.12371134020618557, 500, 1500, "/login-144-1"], "isController": false}, {"data": [0.06666666666666667, 500, 1500, "Select and Click On Pragmatic"], "isController": true}, {"data": [0.1134020618556701, 500, 1500, "/login-144-0"], "isController": false}, {"data": [1.0, 500, 1500, "/css/app.css-114"], "isController": false}, {"data": [1.0, 500, 1500, "/css/app.css-412"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1584, 1, 0.06313131313131314, 2879.118686868683, 32, 13776, 2471.5, 5335.0, 6962.75, 8200.300000000003, 8.585970827212757, 118.31580295122421, 11.872369606327275], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Select a Game", 89, 0, 0.0, 8985.168539325841, 1988, 11465, 9872.0, 11299.0, 11380.0, 11465.0, 0.5043864620406683, 7.891631382047242, 2.5459074918391402], "isController": true}, {"data": ["/deposits-145", 91, 0, 0.0, 2201.736263736263, 372, 3062, 2403.0, 2759.6, 2810.0, 3062.0, 0.512214342001576, 5.0680878327986045, 0.6102553684003152], "isController": false}, {"data": ["/css/app.css-173", 20, 0, 0.0, 72.05, 32, 278, 50.0, 237.20000000000036, 276.79999999999995, 278.0, 0.5983366241847664, 41.23935848964877, 0.6579365613594208], "isController": false}, {"data": ["Log Out", 85, 0, 0.0, 11218.635294117646, 1803, 13870, 11727.0, 13497.2, 13702.9, 13870.0, 0.4859392061468451, 19.37713290687404, 1.975579589695802], "isController": true}, {"data": ["/js/app.js-39", 20, 0, 0.0, 115.94999999999997, 63, 512, 73.0, 217.00000000000017, 497.6499999999998, 512.0, 0.8723339294281851, 236.23433206481442, 0.9251510228115323], "isController": false}, {"data": ["/login-113", 102, 0, 0.0, 2094.558823529411, 398, 3004, 2376.5, 2755.0, 2801.3999999999996, 2999.5899999999997, 0.565974919542781, 4.515027423080125, 0.6726479268394185], "isController": false}, {"data": ["/logout-400", 85, 0, 0.0, 6681.4, 1088, 8520, 7018.0, 8112.2, 8232.3, 8520.0, 0.5013122585591696, 6.397093448659727, 1.3120281766978266], "isController": false}, {"data": ["/login-144", 97, 0, 0.0, 4384.701030927835, 749, 5614, 4778.0, 5478.2, 5497.1, 5614.0, 0.5338176214847835, 6.3033882112982225, 1.2704233823812667], "isController": false}, {"data": ["/-37", 104, 1, 0.9615384615384616, 4121.307692307692, 608, 5576, 4650.5, 5374.0, 5413.75, 5569.05, 0.5646741992756967, 6.097649950862486, 0.5681737201170614], "isController": false}, {"data": ["/login-141", 97, 0, 0.0, 2113.0721649484535, 376, 3001, 2439.0, 2804.2000000000003, 2854.7, 3001.0, 0.5485525564245683, 0.8517453655791754, 0.7347261955759519], "isController": false}, {"data": ["/logout-400-0", 85, 0, 0.0, 2191.2352941176473, 326, 2812, 2356.0, 2717.2, 2729.2, 2812.0, 0.518738671662832, 0.9641900105426006, 0.6975616707809763], "isController": false}, {"data": ["Home Page", 104, 1, 0.9615384615384616, 4143.615384615384, 668, 5576, 4650.5, 5374.0, 5413.75, 5569.05, 0.564668067477834, 35.50454398302738, 0.6833323492363407], "isController": true}, {"data": ["Click On Login Button", 102, 0, 0.0, 2106.362745098039, 403, 3004, 2380.5, 2755.0, 2801.3999999999996, 2999.5899999999997, 0.565974919542781, 12.163686874028965, 0.7943524754466763], "isController": true}, {"data": ["/css/app.css-146", 20, 0, 0.0, 79.80000000000003, 35, 356, 43.5, 319.1000000000005, 355.25, 356.0, 0.6306363120388472, 43.464791032745794, 0.6934536009333417], "isController": false}, {"data": ["/logout-400-1", 85, 0, 0.0, 4489.823529411766, 659, 5812, 4648.0, 5387.0, 5519.8, 5812.0, 0.5026106186841063, 5.479448953978607, 0.6395523790482329], "isController": false}, {"data": ["/games/play-204", 89, 0, 0.0, 2356.516853932585, 509, 3003, 2524.0, 2865.0, 2885.0, 3003.0, 0.5049101089811595, 1.010623544483148, 0.6646668231509795], "isController": false}, {"data": ["/games/play-223", 87, 0, 0.0, 2295.057471264368, 426, 2916, 2476.0, 2834.4, 2866.6, 2916.0, 0.5041520105234488, 1.0082304536064253, 0.6636688576031339], "isController": false}, {"data": ["Login", 97, 0, 0.0, 8579.793814432991, 1611, 11136, 9591.0, 10468.000000000002, 11092.0, 11136.0, 0.5321308273811484, 19.611164984214366, 2.694555190744215], "isController": true}, {"data": ["/games/10-171", 90, 0, 0.0, 2308.966666666666, 388, 3019, 2420.0, 2788.1, 2858.25, 3019.0, 0.5089950740587832, 5.08011988954807, 0.6103964364689315], "isController": false}, {"data": ["/games/play-262", 86, 0, 0.0, 2234.662790697674, 438, 2919, 2473.5, 2839.2, 2879.0499999999997, 2919.0, 0.4917320403448986, 0.983581340555886, 0.6473191312352766], "isController": false}, {"data": ["/games/10-227", 87, 0, 0.0, 2276.9885057471265, 373, 2896, 2417.0, 2784.6, 2797.0, 2896.0, 0.49756080822176346, 4.966141424868318, 0.5966842504846929], "isController": false}, {"data": ["/-403", 85, 0, 0.0, 4520.9764705882335, 658, 5720, 4665.0, 5371.0, 5381.5, 5720.0, 0.49464618249534453, 5.390501111135358, 0.589324553363594], "isController": false}, {"data": ["/login-144-1", 97, 0, 0.0, 2208.1237113402067, 406, 2901, 2407.0, 2756.2, 2766.4, 2901.0, 0.5353171340114017, 5.302694331846955, 0.6377801791932716], "isController": false}, {"data": ["Select and Click On Pragmatic", 90, 0, 0.0, 2324.988888888888, 426, 3019, 2434.0, 2788.1, 2858.25, 3019.0, 0.5089921954530031, 12.875967173538061, 0.7347691154846737], "isController": true}, {"data": ["/login-144-0", 97, 0, 0.0, 2176.278350515463, 306, 2773, 2359.0, 2718.6, 2729.7, 2773.0, 0.5420084486265394, 1.0311300387228717, 0.6441643378696275], "isController": false}, {"data": ["/css/app.css-114", 20, 0, 0.0, 60.2, 33, 352, 42.5, 65.10000000000002, 337.6999999999998, 352.0, 0.8192020971573687, 56.46110454042762, 0.8984022999098877], "isController": false}, {"data": ["/css/app.css-412", 20, 0, 0.0, 69.05000000000001, 35, 340, 48.5, 140.10000000000014, 330.29999999999984, 340.0, 0.4451666036013978, 30.68234737045652, 0.4860315066663699], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 1, 100.0, 0.06313131313131314], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1584, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/-37", 104, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
