// chaves
var base_url = "http://ws.audioscrobbler.com/2.0/"
var apikey = "87422e7f74c0fd168849b27c3baab250";
var base_request = "http://ws.audioscrobbler.com/2.0/?api_key=87422e7f74c0fd168849b27c3baab250&format=json&method=";

var username1;
var username2;

var topartists = {};
var toptracks = {};

$(function(){
    // user
    $("#searchuserinfo").click(procurauserinfo);
    $("#searchusermusicas").click(procurausermusicas);
    $("#searchuserartists").click(procurauserartistas);
    
    //outras
    $("#menu1").hide();
    $("#info").hide();
    $(".bubble").hide();
    $(".nome").hide();
    $("#tit").hide();
    $("#perf").hide();   
});


// ---------------------------------------------------------------------------------------------------------
// Info USER 1
// ---------------------------------------------------------------------------------------------------------

function procurauserinfo() {
    username1 = $("#name").val();
    searching();
    getUserInfo();  
    $("#image").hide();     
    $("#info").show();
    $(".bubble").show();
}


function getUserInfo() {
    var data = {
        api_key: apikey,
        method: "user.getInfo",
        user: username1,
        format: "json"
    };
    $.get(base_url, data).done(processUserInfo).fail(logError("obter info do utilizador "+username1));
}

function processUserInfo(info) {
    if(info.error){
        log("Erro: "+info.error.message);
        searchAgain();
    }
    else {
        var name = info.user.name;
        var realname = info.user.realname;
        var age = info.user.age;
        var url = info.user.url;
        var img = info.user.image[3]["#text"];
        var country = info.user.country; 
        /*$("#tabela").html("Encontrado o utilizador <a href='"+url+"'>"+name+" </a> com "+age+" anos, o nome verdadeiro de "+realname+" e de "+country+". <br> <br> <img src='"+img+"'> <br/> <br/> <table></table>");*/
        $(".nome").html("<a style='color:rgb(184,184,184)' href='"+url+"'>"+realname+" </a>");
        $("#img").html("<img width:'70px'height:'70px' src='"+img+"' >");
       
        //$("#image").html("<img width='250px' height='300px' src='"+img+"' >");
        $("#info").html("Username: "+name+" <br> Idade: "+age+" <br> Nome: "+realname+" <br> País: "+country+". ");
    }

}




// ---------------------------------------------------------------------------------------------------------
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
    
    $.get(base_url, data).done(processUserTopArtists).fail(logError("obter artistas do utilizador "+username1));
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
    
    $(document).ready(function() {

    (function( $ ){
        var methods = {
        el: "",
        init: function(options){            
        var clone = options["data"].slice(0);
        var that = this;    
        w = options["width"];
        h = options["height"];
        methods.el = this;
        methods.setup(clone, w, h);
    },

    resizeChart: function(){
        var svg = $('.bubblechart');
        var aspect = svg.width() / svg.height();
        var targetWidth = svg.parent().parent().width();
        if(targetWidth!=null){
            svg.attr("width", targetWidth);
            svg.attr("height", Math.round(targetWidth / aspect));
        }
    },

    funnelData: function(data, width, height){
            function getRandom(min, max){
                return Math.floor(Math.random() * (max - min + 1)) + min;                   
            }
            var max_amount = d3.max(data, function (d) { return parseInt(d.value)})
            var radius_scale = d3.scale.pow().exponent(0.5).domain([0, max_amount]).range([2, 85])
            $.each(data, function(index, elem) {
                elem.radius = radius_scale(elem.value)*.8;
                elem.all = 'all';
                elem.x = getRandom(0, width); 
                elem.y = getRandom(0, height);
            });     
            return data;
    },  

    getMargin: function(){
        var margin = {top: 30, right: 55, bottom: 50, left: 95};
        return margin;
    },

    setup: function(data, w, h){
        methods.width = w;
        methods.height = h;
        methods.fill = d3.scale.ordinal()
        .range(["rgba(216, 75, 42, 0.94)", "rgba(177, 77, 54, 0.88)", "rgba(209, 126, 106, 0.9)", "rgba(152, 48, 24, 0.94)"])      
        var margin = methods.getMargin();   
        var selector = methods.el["selector"];  
        var svg = d3.select(selector)
            .append("svg")
                .attr("class", "bubblechart")
                .attr("width", parseInt(methods.width + margin.left + margin.right,10))
                .attr("height", parseInt(methods.height + margin.top + margin.bottom,10))
                .attr('viewBox', "0 0 "+parseInt(methods.width + margin.left + margin.right,10)+" "+parseInt(methods.height + margin.top + margin.bottom,10))
                .attr('perserveAspectRatio', "xMinYMid")
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            methods.force = d3.layout.force()
              .charge(1000)
              .gravity(100)
              .size([methods.width, methods.height])
            var bubbleholder = svg.append("g")
                    .attr("class", "bubbleholder")
            var bubbles = bubbleholder.append("g")
                    .attr("class", "bubbles")
            var labelbubble = bubbleholder.append("g")
                    .attr("class", "labelbubble")
            methods.animateBubbles(selector, data); 
    },

    update: function(data){
        var selector = methods.el["selector"];
        //console.log("new data", data);
        methods.animateBubbles(selector, data);                      
    },

    animateBubbles: function(selector, data){
        data = this.funnelData(data, methods.width, methods.height);
            var padding = 4;
            var maxRadius = d3.max(data, function (d) { return parseInt(d.radius)});
            var year_centers = {
              "2008": {name:"2008", x: 150, y: 300},
              "2009": {name:"2009", x: 550, y: 300},
              "2010": {name:"2010", x: 900, y: 300}
            }
        var all_center = { "all": {name:"All Grants", x: methods.width/2, y: methods.height/2}};
        var bubbleholder = d3.select(selector + " .bubbleholder");
        var bubbles = d3.select(selector + " .bubbles");
        var labelbubble = d3.select(selector + " .labelbubble");
        var nodes = bubbles.selectAll("circle")
        .data(data);
        // Enter
        nodes.enter()
            .append("circle")
             .attr("class", "node")
              .attr("cx", function (d) { return d.x; })
              .attr("cy", function (d) { return d.y; })
              .attr("r", 1)
              .style("fill", function (d) { return methods.fill(d.label); })
              .call(methods.force.drag);
        // Update
        nodes
            .transition()
            .delay(300)
            .duration(1000)
              .attr("r", function (d) { return d.radius; })
        // Exit
        nodes.exit()
            .transition()
            .duration(250)
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; })
            .attr("r", 1)
            .remove();
        var labels = labelbubble.selectAll("text")
          .data(data);                      
        // Enter
        labels.enter()
            .append("text")
             .attr("class", "title")
            .style("fill","white")
                .text(function(d) { return d.label; })                               
                .attr("x", function (d) { return d.x; })
                .attr("y", function (d) { return d.y; })
                .attr("text-anchor", "middle")   
        // Update
        labels
            .transition()
            .delay(600)
            .duration(1000)
        //  .attr("x", function (d) { return d.x; })
        //  .attr("y", function (d) { return d.y; })  
        // Exit
        labels.exit()
            .transition()
            .duration(250)
            .remove();    
        draw('all');
        
    function draw (varname) {
        var foci = varname === "all" ? all_center: year_centers;
      methods.force.on("tick", tick(foci, varname, .55));
      methods.force.start();
    }
    function tick (foci, varname, k) {
      return function (e) {
        data.forEach(function(o, i) {
          var f = foci[o[varname]];
          o.y += (f.y - o.y) * k * e.alpha;
          o.x += (f.x - o.x) * k * e.alpha;
        });
        nodes
          .each(collide(.1))
          .attr("cx", function (d) { return d.x; })
          .attr("cy", function (d) { return d.y; });
        labels
          .each(collide(.1))
          .attr("x", function (d) { return d.x; })
          .attr("y", function (d) { return d.y; });
      }
    }
    function collide(alpha) {
      var quadtree = d3.geom.quadtree(data);
      return function(d) {
        var r = d.radius + maxRadius + padding,
            nx1 = d.x - r,
            nx2 = d.x + r,
            ny1 = d.y - r,
            ny2 = d.y + r;
        quadtree.visit(function(quad, x1, y1, x2, y2) {
          if (quad.point && (quad.point !== d)) {
            var x = d.x - quad.point.x,
                y = d.y - quad.point.y,
                l = Math.sqrt(x * x + y * y),
                r = d.radius + quad.point.radius + padding;
            if (l < r) {
              l = (l - r) / l * alpha;
              d.x -= x *= l;
              d.y -= y *= l;
              quad.point.x += x;
              quad.point.y += y;
            }
          }
          return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        });
      };
    }                           
},
oldData: ""
};

$.fn.bubble = function(methodOrOptions) {
    if ( methods[methodOrOptions] ) {
        return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
        // Default to "init"
        return methods.init.apply( this, arguments );
    } else {
        $.error( 'Method ' +  methodOrOptions + ' does not exist' );
    }    
};
})(jQuery);

var dataChartuserartistas = eval(jsonuserartistas);
//alert(dataChartuserartistas);
//console.log(dataChartuserartistas);

var clone = jQuery.extend(true, {}, dataChartuserartistas);
//__invoke bubble
$('[data-role="bubble"]').each(function(index) {
    var selector = "bubble"+index;
    $(this).attr("id", selector);
    var options = {
        data: clone[0].data,
        width: $(this).data("width"),
        height: $(this).data("height")
    }
    $("#"+selector).bubble(options);
});
$(".testers a").on( "click", function(e) {
e.preventDefault();
var clone = jQuery.extend(true, {}, dataChartuserartistas);
var min = 0;
var max = 3;
//__invoke bubble
$('[data-role="bubble"]').each(function(index) {
    pos = Math.floor(Math.random() * (max - min + 1)) + min;
    $("#"+$(this).attr("id")).bubble('update', clone[pos].data);
});
}); 
});
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
