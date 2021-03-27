var guildID;
var zones = {
    1000: false,
    1001: false,
    1002: false,
    1003: false,
    1004: false
};
var players = [];
var reportsParsed = 0;
var reportsTotal = 0;
var wclpage;
var emptyPage = ["","","","","","","","","","","","","","","",""];

function getAttendanceTable(getUrl = "") {

    guildID = $("#inp-guild").val();
    zones["1000"] = $("#inp-zone10").is(":checked");
    zones["1001"] = $("#inp-zone11").is(":checked");
    zones["1002"] = $("#inp-zone12").is(":checked");
    zones["1003"] = $("#inp-zone13").is(":checked");

console.log("Fetching reports for: " + guildID);

$("#report-container").show();

var wclurl;

if (getUrl=="") {
wclurl = 'https://classic.warcraftlogs.com/guild/attendance-table/' + guildID + '/0/0?page=1'; 
//wclurl = 'https://classic.warcraftlogs.com/guild/attendance/' + guildID + '#page=1'; 
}
else {
wclurl = getUrl;
}

var equalsSign = wclurl.indexOf("=") + 1;
var pageNum = wclurl.substr(equalsSign,wclurl.length);

//var pageNum = wclurl.charAt(wclurl.length-1);

var cors_api_url = 'https://cors-anywhere.herokuapp.com/';

  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      let response = this.responseText;

let attTable = 'attTable' + pageNum;
//document.getElementById('report-container').innerHTML += response;
$('<div/>', {
    id: attTable,
    'class': 'attTables'
}).appendTo('#report-container');
$('#'+attTable).html(response);
         }
  }

  xhr.open("GET", cors_api_url + wclurl, false);
  xhr.setRequestHeader("Accept", 'application/json');
 xhr.send();
    
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function getAttendanceLinks(){
  var tableUrls = [];
  
  $('#attTable1 #pagination-hook').find('a').each(function(){
  
//$('#attTable1').find('.page-link').each(function(){

//$('#report-container').find('.page-link').each(function(){

//$('.page-link').each(function(){

tableUrls.push($(this).attr("href"));
});


//tableUrls.pop();
//tableUrls = tableUrls.filter( Boolean );

var tableUrlsUnique = tableUrls.filter(onlyUnique);

console.log(tableUrlsUnique);

wclurl = tableUrlsUnique[tableUrlsUnique.length - 1];

var equalsSign = wclurl.indexOf("=") + 1;
var pageNum = wclurl.substr(equalsSign,wclurl.length);
var pagelessUrl = wclurl.substr(0,equalsSign);
console.log(pagelessUrl);

var fullTableUrls = [];

for (let i = 1; i <= pageNum; ++i) {
fullTableUrls.push(pagelessUrl + i);
}

console.log(fullTableUrls);


return fullTableUrls;
}

function getAllAttendanceTables(){

getAttendanceTable();

var tableUrls = getAttendanceLinks();

for (let i = 0; i < tableUrls.length; ++i) {
    getAttendanceTable(tableUrls[i]);
  }

}

function analyzeAttendanceTable() {
console.clear();

var fixTable = [];  
var headerRow = ['Name', 'Att'];
var cellHtml;


// Fill in the Raid Date Row at the Top
$('#attendance-table th a').each(function() {
    cellHtml = $(this).html().trim();
cellHtml = cellHtml.replace(/(<|&lt;)br\s*\/*(>|&gt;)/g,' ');
headerRow.push(cellHtml);    
});  

console.log(headerRow);

fixTable.push(headerRow);

// Create the Player Column at the Left
var playerList = [];

$('#attendance-table tr').each(function() {
var row = [];
let playerName = $(this).find('td').eq(0).html() == undefined ? '' : $(this).find('td').eq(0).html().trim();

var playerExists = playerList.indexOf(playerName);

if (playerExists == -1){
playerList.push(playerName);
}

$(this).find('td').each(function() {

row.push($(this).html().trim());
  });
  
var tableID = $(this).closest('.attTables').attr("id");
tableID = tableID.substr(8);
var tableNumber = parseInt(tableID);

var numRecords = Math.min(tableNumber*16, headerRow.length);

if (playerExists > -1){
row = row.slice(2);
  

if(tableNumber > 1 && (fixTable[playerExists].length + row.length) < numRecords){
var fillTimes = Math.floor(numRecords/(fixTable[playerExists].length + row.length) ) 
var fillRow = [];
for(var i=0; i<fillTimes; i++){
        fillRow = fillRow.concat(emptyPage);                  
       }
row = fillRow.concat(row);
}

fixTable[playerExists] = fixTable[playerExists].concat(row);
} else {

  if (tableNumber == 1 && row.length > 1){
    fixTable.push(row);  
  } else if (row.length > 1) {
    let addRow = row.slice(0,2);
    let remainRow = row.slice(2);
    
    var fillRow = [];
    for(var i=1; i<tableNumber; i++){
        fillRow = fillRow.concat(emptyPage);                          
       }
    addRow = addRow.concat(fillRow);
    addRow = addRow.concat(remainRow);
    fixTable.push(addRow);
  }

  
}
  });




for (var j = 1; j<fixTable.length; j++){
      var fillCells = fixTable[0].length - fixTable[j].length; 
      if(fillCells > 0){
    for (var k = 0; k < fillCells; k++){
      fixTable[j].push("");
    }
  }
}

   console.log(fixTable);

let csvContent = "data:text/csv;charset=utf-8,%EF%BB%BF";

fixTable.forEach(function(rowArray) {
    let row = rowArray.join(",");
    csvContent += row + "\r\n";
});

var link = document.createElement("a");
link.setAttribute("href", csvContent);
link.setAttribute("download", "WCLFullAttendance.csv");
document.body.appendChild(link); // Required for FF

link.click();

//var testTable = fixTable.slice(0,2);

//console.log(testTable);

//var playerArray = getPlayers (fixTable);
//console.log(playerArray);

}

function getPlayers(fixTable, col=0){
       var column = [];
       for(var i=0; i<fixTable.length; i++){
          column.push(fixTable[i][col]);
       }
       return column;
    }
