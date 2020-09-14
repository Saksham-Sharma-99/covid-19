google.charts.load('current', {'packages':['corechart']});

google.charts.setOnLoadCallback(drawChart1);
function drawChart1() {

  var data = google.visualization.arrayToDataTable([
    ['Task', 'Hospitals Ratio'],
    ['Urban Hospitals', Number(document.getElementById('uH').textContent)],
    ['Rural Hospitals', Number(document.getElementById('rH').textContent)],
  ]);

  var options = {
    title: document.getElementById('piechart1').textContent,
    is3D: true
  };

  var chart = new google.visualization.PieChart(document.getElementById('piechart1'));

  chart.draw(data, options);
}


google.charts.setOnLoadCallback(drawChart2);
function drawChart2() {

  var data = google.visualization.arrayToDataTable([
    ['Task', 'Beds Ratio'],
    ['Beds in Urban Hospitals', Number(document.getElementById('uB').textContent)],
    ['Beds in Rural Hospitals', Number(document.getElementById('rB').textContent)],
  ]);

  var options = {
    title: document.getElementById('piechart2').textContent,
    is3D: true
  };

  var chart = new google.visualization.PieChart(document.getElementById('piechart2'));

  chart.draw(data, options);
}


google.charts.setOnLoadCallback(drawChart);

      function drawChart() {
        var data = google.visualization.arrayToDataTable([
          ['Date', 'Hospitalized', 'Recovered', 'Deceased'],
          ['30/01/2020',  Number(document.getElementById("d1h").textContent), Number(document.getElementById("d1r").textContent), Number(document.getElementById("d1d").textContent)],
          ['03/02/2020',  Number(document.getElementById("d2h").textContent), Number(document.getElementById("d2r").textContent), Number(document.getElementById("d2d").textContent)],
          ['04/03/2020',  Number(document.getElementById("d3h").textContent), Number(document.getElementById("d3r").textContent), Number(document.getElementById("d3d").textContent)],
          ['24/03/2020',  Number(document.getElementById("d4h").textContent), Number(document.getElementById("d4r").textContent), Number(document.getElementById("d4d").textContent)],
          ['07/04/2020',  Number(document.getElementById("d5h").textContent), Number(document.getElementById("d5r").textContent), Number(document.getElementById("d5d").textContent)],
          ['24/04/2020',  Number(document.getElementById("d6h").textContent), Number(document.getElementById("d6r").textContent), Number(document.getElementById("d6d").textContent)],
        ]);

        var options = {
          title: document.getElementById("sN").textContent,
          curveType: 'function',
          legend: { position: 'bottom' }
        };

        var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

        chart.draw(data, options);
      }


      //1000 document.getElementById("d1h").textContent
      //400 document.getElementById("d1r")
      ///document.getElementById("d1d")
      ///
