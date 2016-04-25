// chaves
var base_url = "http://ws.audioscrobbler.com/2.0/"
var apikey = "87422e7f74c0fd168849b27c3baab250";
var base_request = "http://ws.audioscrobbler.com/2.0/?api_key=87422e7f74c0fd168849b27c3baab250&format=json&method=";

var username1;
var username2;

var topartists1 = new Array();
var toptracks1 = {};
var topalbums1 = {};

var topartists2 = new Array();
var toptracks2 = {};
var topalbums2 = {};

var topartistsboth = [];

var data1;
var data2;

var playcount1;
var playcount2;

$(function () {
    // user 1
    $("#getuser1").click(procurauser1info);
    $("#getuser2").click(procurauser2info);
    $("#generate").click(generatePage);

    //outras
    $(".user2").hide();
    $(".page-load").hide();
    $(".page-content").hide();
    $("#generate").hide();
});


// ---------------------------------------------------------------------------------------------------------
// Info USERs
// ---------------------------------------------------------------------------------------------------------

function procurauser1info() {
    username1 = $("#name1").val();
    getUser1Info();
}


function getUser1Info() {
    var data = {
        api_key: apikey,
        method: "user.getInfo",
        user: username1,
        format: "json"
    };

    $.get(base_url, data)
        .done(processUser1Info)
        .fail(log("A obter informação do utilizador " + username1));
}

function processUser1Info(info) {

    if (info.error) {
        log("Erro: " + info.error.message);
        //searchAgain();
    } else {
        $(".user2").show();
        var name1 = info.user.name;
        var realname1 = info.user.realname;
        var url1 = info.user.url;
        var img1 = info.user.image[3]["#text"];
        playcount1 = info.user.playcount;
    }

}



function procurauser2info() {
    username2 = $("#name2").val();
    getUser2Info(username2);
}

function getUser2Info() {
    var data = {
        api_key: apikey,
        method: "user.getInfo",
        user: username2,
        format: "json"
    };
    $.get(base_url, data)
        .done(processUser2Info)
        .fail(logError("A obter informação do utilizador " + username2));
}

function processUser2Info(info) {

    if (info.error) {
        log("Erro: " + info.error.message);
        searchAgain();
    } else {
        $("#generate").show();
        var name1 = info.user.name;
        var realname1 = info.user.realname;
        var url1 = info.user.url;
        var img1 = info.user.image[3]["#text"];
        playcount2 = info.user.playcount;

    }

}

function generatePage() {
    $(".page-load").show();
    $(".login").hide();
    $(".page-content").hide();

    procurauser1artistas();
}


//  ---------------------------------------------------------------------------------------------------------
// USER top artists
// ---------------------------------------------------------------------------------------------------------

function procurauser1artistas() {
    username1 = $("#name1").val();
    getUser1TopArtists();
}



function getUser1TopArtists() {

    data1 = {
        api_key: apikey,
        method: "user.getTopArtists",
        user: username1,
        period: "overall",
        limit: 100,
        format: "json"
    };

    $.get(base_url, data1)
        .done(processUser1TopArtists)
        .fail(logError("obter artistas do utilizador " + username1));

}



function processUser1TopArtists(data) {

    if ($.isArray(data.topartists.artist)) {
        for (var i = 0; i < data.topartists.artist.length; i++) {
            topartists1[i] = {
                artist: data.topartists.artist[i].name,
                plays: data.topartists.artist[i].playcount
            }
        }
    }

    /*var jsonuserartistas = "[{ \"data\":  ["+userartist+"]}];";*/

    for (var i = 0; i < topartists1.length; i++) {
        var htmlString = "<div class=\"row\"><div class=\"col-md-3 order\">" + i + "</div> <div class=\"col-md-7 artist-name\">" + topartists1[i].artist + "</div> <div class=\"col-md-2 artist-plays\">" + topartists1[i].plays + "</div></div>";
        $('.artists-1').append(htmlString);
    }

    procurauser2artistas();

}


function procurauser2artistas() {
    username2 = $("#name2").val();
    getUser2TopArtists();

}



function getUser2TopArtists() {
    data2 = {
        api_key: apikey,
        method: "user.getTopArtists",
        user: username2,
        period: "overall",
        limit: 100,
        format: "json"
    };

    $.get(base_url, data2)
        .done(processUser2TopArtists)
        .fail(logError("obter artistas do utilizador " + username2));
}




function processUser2TopArtists(data) {

    if ($.isArray(data.topartists.artist)) {
        for (var i = 0; i < data.topartists.artist.length; i++) {
            topartists2[i] = {
                artist: data.topartists.artist[i].name,
                plays: data.topartists.artist[i].playcount
            }
        }
    }

    /*var jsonuserartistas = "[{ \"data\":  ["+userartist+"]}];";*/

    for (var i = 0; i < topartists2.length; i++) {
        var htmlString = "<div class=\"row\"><div class=\"col-md-3 order\">" + i + "</div> <div class=\"col-md-7 artist-name\">" + topartists2[i].artist + "</div> <div class=\"col-md-2 artist-plays\">" + topartists2[i].plays + "</div></div>";
        $('.artists-2').append(htmlString);
    }


    generateTop10();
}



function generateTop10() {

    var add = 0;
    for (var i = 0; i < topartists1.length; i++) {
        for (var i2 = 0; i2 < topartists2.length; i2++) {
            if (topartists1[i].artist == topartists2[i2].artist) {
                topartistsboth[add] = {
                    artist: topartists1[i].artist,
                    plays: parseFloat(topartists1[i].plays / playcount1) + parseFloat(topartists2[i2].plays / playcount2)
                }
                add++;
            }
        }
    }

    console.log(topartistsboth);
    topartistsboth.sort(function (a, b) {

        // convert to integers from strings
        a = parseFloat(a.plays / );
        b = parseFloat(b.plays);
        // compare
        if (a > b) {
            return -1;
        } else if (a < b) {
            return 1;
        } else {
            return 0;
        }
    });


    for (var i = 0; i < topartistsboth.length; i++) {
        var htmlString = "<div class=\"row\"><div class=\"col-md-3 order\">" + i + "</div> <div class=\"col-md-7 artist-name\">" + topartistsboth[i].artist + "</div> <div class=\"col-md-2 artist-plays\">" + topartistsboth[i].plays + "</div></div>";
        console.log(htmlString);
        $('.artists-both').append(htmlString);
    }

    $(".page-load").hide();
    $(".login").hide();
    $(".page-content").show();
}

/*
// ---------------------------------------------------------------------------------------------------------
// USER top tracks
// ---------------------------------------------------------------------------------------------------------


function procurausermusicas() {
    username1 = $("#name").val();
    searching();
    getUserTopTracks();
    $(".bubble").show();
    $("#image").hide();
    $("#info").show();   
}

function getUserTopTracks()
{
    var data = {
        api_key: apikey,
        method: "user.getTopTracks",
        user: username1,
        limit: 25,
        period: "overall",
        format: "json"
    };
    
    $.get(base_url, data).done(processUserTopTracks).fail(logError("obter musicas favoritas do utilizador "+ username1));
}

function processUserTopTracks(data)
{
    if($.isArray(data.toptracks.track)){ 
        for(var i=0; i < data.toptracks.track.length; i++){
            toptracks[data.toptracks.track[i].name] = data.toptracks.track[i].playcount;
        }
    }
    else{
        toptracks[data.toptracks.track[i].name] = data.toptracks.track[i].playcount;
    }
    
   
    
    var topt = new Array();
    for(var i=0; i < data.toptracks.track.length; i++){
        topt[i] = "{\"label\" : \""+data.toptracks.track[i].name+" - "+data.toptracks.track[i].playcount+"\", \"value\": \""+data.toptracks.track[i].playcount+"\"}";
    }

    var jsontoptracks = "[{ \"data\":  ["+topt+"]}];";  
    
    console.log(jsontoptracks);
}

// ---------------------------------------------------------------------------------------------------------
// OUTRAS FUNÇÕES
// ---------------------------------------------------------------------------------------------------------


function log(message) {
    $("#status").append(message + "<br/>");
}

function logError(actividade) {
    return function(data) {
        $("#status").append("Erro ao " + actividade + ": " + data.statusText + "<br/>");
    }
}

function searching() {
    $("#procura1").hide();
    $("#searchuserinfo").hide();
    $("#titulo").hide();
    $(".nome").show();
    $("#menu1").show();
    $("#load").show();
    $("#status").empty();
    //log("Procurando informação sobre " + username1 + "..."); 
    $("#tit").show();
    $(".bubble").html("");
    $("#info").show();
    $("#perf").show();
    $("#options").hide();
    $("#crit").show();
}

function searching1() {
    $("#procura1").hide();
    $("#searchuserinfo").hide();
    $("#titulo").hide();
    $("#image").show();
    $("#info").show();
    $("#load").show();   
    $("#status").empty();
    $(".nome").show();
    $(".bubble").html("");
    $("#tit").show();
    $("#perf").show();
    $("#options").hide();
    $("#crit").show();
}

function searchAgain() {
    $("#procura1").show();
    $("#load").hide();
    $("#searchuserinfo").show();
    $("#titulo").show();
    $("#menu1").hide();
    $("#perf").hide();    
}
*/
