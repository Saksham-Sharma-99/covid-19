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
