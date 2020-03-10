/*
Written by Tim Ings <tim@tim-ings.com>
Copyright 2017 All rights reserved
 */
/*
var guild;
var realm;
var region;
var wclkey;
var zones = {
    10: false,
    11: false,
    12: false,
    13: false,
    14: false
};
var playerClasses = [
    "DeathKnight",
    "DemonHunter",
    "Druid",
    "Hunter",
    "Mage",
    "Monk",
    "Paladin",
    "Priest",
    "Rogue",
    "Shaman",
    "Warlock",
    "Warrior"
];
var players = [];
var reportsParsed = 0;
var reportsTotal = 0;

function updateProgBar() {
    var pb = $("#prog-parse");
    pb.attr("style", "width:" + reportsParsed / reportsTotal * 100 + "%");
    pb.text(reportsParsed + " / " + reportsTotal);
}

function colorData(tableSelector) {
    $(tableSelector + " td").each(function (index) {
        var rate = $(this).text();
        if (rate == 100) {
            $(this).addClass("artifact");
        } else if (rate > 94) {
            $(this).addClass("legendary");
        } else if (rate > 74) {
            $(this).addClass("epic");
        } else if (rate > 49) {
            $(this).addClass("rare");
        } else if (rate > 24) {
            $(this).addClass("uncommon");
        } else {
            $(this).addClass("common");
        }
    })
}

function tryOutputReport() {
    // dont output an incomplete report
    if (reportsParsed != reportsTotal) {
        return;
    }
    console.log("Outputting attendance report for " + players.length + " players");

    // attendance rates for each week day
    var weekdayAttendanceData = [];
    for (var i = 0; i < players.length; i++) {
        var player = players[i];
        var dayRates = [];
        for (var j = 0; j < 7; j++) {
            dayRates[j] = (Math.round(player.presentDays[j] / player.totalDays[j] * 100) || 0);
        }
        var row = {
            "name": player.name,
            "monday": dayRates[0],
            "tuesday": dayRates[1],
            "wednesday": dayRates[2],
            "thursday": dayRates[3],
            "friday": dayRates[4],
            "saturday": dayRates[5],
            "sunday": dayRates[6]
        };
        weekdayAttendanceData.push(row);
    }
    $("#tb-weekday-attendance-rates").bootstrapTable({
        search: true,
        columns: [{
            sortable: true,
            field: "name",
            title: "Name"
        }, {
            sortable: true,
            field: "monday",
            title: "Monday"
        }, {
            sortable: true,
            field: "tuesday",
            title: "Tuesday"
        }, {
            sortable: true,
            field: "wednesday",
            title: "Wednesday"
        }, {
            sortable: true,
            field: "thursday",
            title: "Thursday"
        }, {
            sortable: true,
            field: "friday",
            title: "Friday"
        }, {
            sortable: true,
            field: "saturday",
            title: "Saturday"
        }, {
            sortable: true,
            field: "sunday",
            title: "Sunday"
        }],
        data: weekdayAttendanceData,
        onAll: function (name, args) {
            colorData("#tb-weekday-attendance-rates");
        }
    });

    // late rates for each weekday
    var weekdayLateData = [];
    for (var i = 0; i < players.length; i++) {
        var player = players[i];
        var dayRates = [];
        for (var j = 0; j < 7; j++) {
            dayRates[j] = (Math.round(player.lateDays[j] / player.totalDays[j] * 100) || 0);
        }
        var row = {
            "name": player.name,
            "monday": dayRates[0],
            "tuesday": dayRates[1],
            "wednesday": dayRates[2],
            "thursday": dayRates[3],
            "friday": dayRates[4],
            "saturday": dayRates[5],
            "sunday": dayRates[6]
        };
        weekdayLateData.push(row);
    }
    $("#tb-weekday-late-rates").bootstrapTable({
        search: true,
        columns: [{
            sortable: true,
            field: "name",
            title: "Name"
        }, {
            sortable: true,
            field: "monday",
            title: "Monday"
        }, {
            sortable: true,
            field: "tuesday",
            title: "Tuesday"
        }, {
            sortable: true,
            field: "wednesday",
            title: "Wednesday"
        }, {
            sortable: true,
            field: "thursday",
            title: "Thursday"
        }, {
            sortable: true,
            field: "friday",
            title: "Friday"
        }, {
            sortable: true,
            field: "saturday",
            title: "Saturday"
        }, {
            sortable: true,
            field: "sunday",
            title: "Sunday"
        }],
        data: weekdayLateData,
        onAll: function (name, args) {
            colorData("#tb-weekday-late-rates");
        }
    });

    // early leave rates for each weekday
    var weekdayEarlyLeaveData = [];
    for (var i = 0; i < players.length; i++) {
        var player = players[i];
        var dayRates = [];
        for (var j = 0; j < 7; j++) {
            dayRates[j] = (Math.round(player.earlyLeaveDays[j] / player.totalDays[j] * 100) || 0);
        }
        var row = {
            "name": player.name,
            "monday": dayRates[0],
            "tuesday": dayRates[1],
            "wednesday": dayRates[2],
            "thursday": dayRates[3],
            "friday": dayRates[4],
            "saturday": dayRates[5],
            "sunday": dayRates[6]
        };
        weekdayEarlyLeaveData.push(row);
    }
    $("#tb-weekday-early-leave-rates").bootstrapTable({
        search: true,
        columns: [{
            sortable: true,
            field: "name",
            title: "Name"
        }, {
            sortable: true,
            field: "monday",
            title: "Monday"
        }, {
            sortable: true,
            field: "tuesday",
            title: "Tuesday"
        }, {
            sortable: true,
            field: "wednesday",
            title: "Wednesday"
        }, {
            sortable: true,
            field: "thursday",
            title: "Thursday"
        }, {
            sortable: true,
            field: "friday",
            title: "Friday"
        }, {
            sortable: true,
            field: "saturday",
            title: "Saturday"
        }, {
            sortable: true,
            field: "sunday",
            title: "Sunday"
        }],
        data: weekdayEarlyLeaveData,
        onAll: function (name, args) {
            colorData("#tb-weekday-early-leave-rates");
        }
    });

    // show the report container
    $("#report-container").show();
}

function discoverPlayers(report) {
    for (var i = 0; i < report.friendlies.length; i++) {
        var friend = report.friendlies[i];
        if (playerClasses.indexOf(friend.type) != -1) {
            var alreadyInSet = false;
            for (var j = 0; j < players.length; j++) {
                var player = players[j];
                if (player.guid == friend.guid) {
                    alreadyInSet = true;
                    break;
                }
            }
            if (!alreadyInSet) {
                friend.presentReports = [];
                friend.lateReports = [];
                friend.earlyLeaveReports = [];
                friend.absentReports = [];
                friend.presentDays = [0, 0, 0, 0, 0, 0, 0, 0];
                friend.lateDays = [0, 0, 0, 0, 0, 0, 0, 0];
                friend.earlyLeaveDays = [0, 0, 0, 0, 0, 0, 0, 0];
                friend.absentDays = [0, 0, 0, 0, 0, 0, 0, 0];
                friend.totalDays = [0, 0, 0, 0, 0, 0, 0, 0];
                players.push(friend);
            }
        }
    }
}

function playerWasLate(player) {
    return player.fights.length > 0 &&
        player.fights[0].id != 1;
}

function playerLeftEarly(player, report) {
    return player.fights.length > 0 &&
        report.fights.length > 0 &&
        player.fights[player.fights.length - 1].id != report.fights[report.fights.length - 1].id;
}

function parseReport(report) {
    // parse the report
    console.log("Parsing report: " + report.title);
    // add unique players to our player list
    discoverPlayers(report);
    for (var i = 0; i < players.length; i++) {
        var player = players[i];
        playerInReport = false;
        startDate = new Date(report.start);
        // keep track of how many reports we see on each given week day
        player.totalDays[startDate.getDay() - 1]++;
        // try and find the player in the report
        for (var j = 0; j < report.friendlies.length; j++) {
            var friend = report.friendlies[j];
            if (friend.guid == player.guid) {
                // keep track of the reports the player is in
                playerInReport = true;
                player.presentReports.push(report);
                player.presentDays[startDate.getDay() - 1]++;
                // check if the player was late
                if (playerWasLate(player)) {
                    player.lateReports.push(report);
                    player.lateDays[startDate.getDay() - 1]++;
                }
                // check if the player left early
                if (playerLeftEarly(player, report)) {
                    player.earlyLeaveReports.push(report);
                    player.earlyLeaveDays[startDate.getDay() - 1]++;
                }
            }
            // keep track of the reports the player missed
            if (!playerInReport) {
                player.absentReports.push(report);
                player.absentDays[startDate.getDay() - 1]++;
            }
        }
    }
    reportsParsed++;
    updateProgBar();
    tryOutputReport();
}

function fetchFights(reports) {
    // fetch each individual report
    console.log("Received " + reports.length + " reports.");
    for (var i = 0; i < reports.length; i++) {
        // check if the report is in a valid zone
        var report = reports[i];
        var validZone = false;
        for (var zone in zones) {
            if (zones[report.zone]) {
                validZone = true;
                break;
            }
        }
        if (validZone) {
            // fetch the report
            reportsTotal++;
            console.log("Fetching report: " + report.id);
            var request_url = "https://www.warcraftlogs.com:443/v1/report/fights/" + report.id + "?api_key=" + wclkey;
            $.get(request_url, function (reportData) {
                parseReport(reportData);
            });
        }
    }
}

function generateReport() {
    // reset counters
    reportsParsed = 0;
    reportsTotal = 0;

    // gather input
    guild = $("#inp-guild").val();
    realm = $("#inp-realm").val();
    region = $("#inp-region").val();
    wclkey = $("#inp-wclkey").val();
    zones["1000"] = $("#inp-zone10").is(":checked");
    zones["1001"] = $("#inp-zone11").is(":checked");
    zones["1002"] = $("#inp-zone12").is(":checked");
    zones["1003"] = $("#inp-zone13").is(":checked");

    // request wcl reports for given guild
    console.log("Fetching reports for: " + region + "/" + realm + "/" + guild);
   
/*   var request_url = "https://classic.warcraftlogs.com:443/v1/reports/guild/" + guild + "/" + realm + "/" + region + "?api_key=" + wclkey;
    $.ajax({
        url: request_url,
        type: "GET",
        success: fetchFights,
        statusCode: {
            400: function () {
                alert("Error 400: Unable to find reports for the given guild/realm/region");
            },
            401: function () {
                alert("Error 401: Invalid public key");
            },
            404: function () {
                alert("Error 404: Unable to find reports for the given guild/realm/region");
            }
        }
    });*/
	
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

function getAttendanceTable() {
  /*var x = document.getElementById("report-container");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }*/
    guildID = $("#inp-guild").val();
    zones["1000"] = $("#inp-zone10").is(":checked");
    zones["1001"] = $("#inp-zone11").is(":checked");
    zones["1002"] = $("#inp-zone12").is(":checked");
    zones["1003"] = $("#inp-zone13").is(":checked");

console.log("Fetching reports for: " + guildID);
console.log("You did it");

$("#report-container").show();

var wclurl = 'https://www.warcraftlogs.com/guild/attendance-table/' + guildID + '/0?page=1'

var cors_api_url = 'https://cors-anywhere.herokuapp.com/';

var x = new XMLHttpRequest();
    x.open("GET", cors_api_url + wclurl);
 /*   x.onload = x.onerror = function() {
      printResult(
        console.log(x.status + ' ' + x.statusText + '\n\n' +
        (x.responseText || ''))
      );
    };
*/
console.log(x);
	
}
