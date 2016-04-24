// chaves
var base_url = "http://ws.audioscrobbler.com/2.0/"
var apikey = "87422e7f74c0fd168849b27c3baab250";
var base_request = "http://ws.audioscrobbler.com/2.0/?api_key=87422e7f74c0fd168849b27c3baab250&format=json&method=";

var username1;
var username2;

var topartists1 = {};
var toptracks1 = {};
var topalbums1 = {};

var topartists2 = {};
var toptracks2 = {};
var topalbums2 = {};

$(function(){
    // user 1
    $("#getuser1").click(procurauser1info);
    $("#getuser2").click(procurauser2info);
    
    $("#generate").click(generatePage);
    
    //outras
    $("#page").hide();
});


// ---------------------------------------------------------------------------------------------------------
// Info USER 1
// ---------------------------------------------------------------------------------------------------------

function procurauser1info() {
    username1 = $("#name").val();
    getUser1Info(username);  
    shrinkMyUsername();
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
        .fail(logError("A obter informação do utilizador "+username));
}

function processUser1Info(info) {
    
    if(info.error){
        log("Erro: "+info.error.message);
        searchAgain();
    }
    else {
        var name1 = info.user.name;
        var realname1 = info.user.realname;
        var url1 = info.user.url;
        var img1 = info.user.image[3]["#text"];
    }

}



function procurauser2info() {
    username2 = $("#name").val();
    getUserInfo(username2);
    loadPage();
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
        .fail(logError("A obter informação do utilizador "+username));
}

function processUser2Info(info) {
    
    if(info.error){
        log("Erro: "+info.error.message);
        searchAgain();
    }
    else {
        var name1 = info.user.name;
        var realname1 = info.user.realname;
        var url1 = info.user.url;
        var img1 = info.user.image[3]["#text"];
        
        generatePage();
    }

}

function generatePage() {
    
    
    
}


//  ---------------------------------------------------------------------------------------------------------
// USER top artists
// ---------------------------------------------------------------------------------------------------------

function procurauserartistas() {
    username1 = $("#name").val();
    searching();
    getUserTopArtists();
    $(".bubble").show();
    $("#image").hide();
    $("#info").show();
     
}

function getUserTopArtists() {
  
    var data = {
        api_key: apikey,
        method: "user.getTopArtists",
        user: username1,
        period: "overall",
        limit: 25,
        format: "json"
    };
    
    $.get(base_url, data)
        .done(processUserTopArtists)
        .fail(logError("obter artistas do utilizador "+username1));
}

function processUserTopArtists(data) {
    if($.isArray(data.topartists.artist)){ 
        for(var i=0; i < data.topartists.artist.length; i++){
            topartists[data.topartists.artist[i].name] = data.topartists.artist[i].playcount;
        }
    }
    else{
        topartists[data.topartists.artist.name] = data.topartists.artist.playcount;
    }

    var userartist = new Array();
    for(var i=0; i < data.topartists.artist.length; i++){
        userartist[i] = "{\"label\" : \""+data.topartists.artist[i].name+" - "+data.topartists.artist[i].playcount+"\", \"value\": \""+data.topartists.artist[i].playcount+"\"}";
    }

    var jsonuserartistas = "[{ \"data\":  ["+userartist+"]}];";  
}


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
