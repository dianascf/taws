// chaves
var base_url = "http://ws.audioscrobbler.com/2.0/"
var apikey = "87422e7f74c0fd168849b27c3baab250";
var base_request = "http://ws.audioscrobbler.com/2.0/?api_key=87422e7f74c0fd168849b27c3baab250&format=json&method=";

var username1;
var username2;

var topartists1 = new Array();
var toptracks1 = new Array();
var topalbums1 = new Array();

var topartists2 = new Array();
var toptracks2 = new Array();
var topalbums2 = new Array();

var topartistsboth = [];
var topalbumsboth = [];
var playlistArray = [];

var data1;
var data2;

var playcount1;
var playcount2;

var period;

$(function () {
    // user 1
    $("#getuser1").click(procurauser1info);
    $("#getuser2").click(procurauser2info);
    $("#generate").click(generatePage);
    $("#generate-album").click(generateAlbum);
    $("#generate-playlist").click(generatePlaylist);
    $("#time-selector").on('change', timeSelector);


    //outras
    $(".user2").hide();
    $(".page-load").hide();
    $(".page-content").hide();
    $("#time-selector").hide();
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
        $("#time-selector").show();
        var name1 = info.user.name;
        var realname1 = info.user.realname;
        var url1 = info.user.url;
        var img1 = info.user.image[3]["#text"];
        playcount2 = info.user.playcount;

    }
}

function timeSelector() {
    period = $("#time-selector option:selected").val();
    $("#generate").show();
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

    console.log(period);
    data1 = {
        api_key: apikey,
        method: "user.getTopArtists",
        user: username1,
        period: period,
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



    /* CHECK DE ARTISTAS DO USER 1
        for (var i = 0; i < topartists1.length; i++) {
            var htmlString = "<div class=\"row\"><div class=\"col-md-3 order\">" + i + "</div> <div class=\"col-md-7 artist-name\">" + topartists1[i].artist + "</div> <div class=\"col-md-2 artist-plays\">" + topartists1[i].plays + "</div></div>";
            $('.artists-1').append(htmlString);
        }
    */
    procurauser2artistas();

}


function procurauser2artistas() {
    username2 = $("#name2").val();
    getUser2TopArtists();

}



function getUser2TopArtists() {

    console.log(period);
    data2 = {
        api_key: apikey,
        method: "user.getTopArtists",
        user: username2,
        period: period,
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

    /* CHECK ARTISTAS USER 2

        for (var i = 0; i < topartists2.length; i++) {
            var htmlString = "<div class=\"row\"><div class=\"col-md-3 order\">" + i + "</div> <div class=\"col-md-7 artist-name\">" + topartists2[i].artist + "</div> <div class=\"col-md-2 artist-plays\">" + topartists2[i].plays + "</div></div>";
            $('.artists-2').append(htmlString);
        }
    */

    generateTop10Artists();
}



function generateTop10Artists() {

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

    topartistsboth.sort(function (a, b) {
        // convert to integers from strings
        a = parseFloat(a.plays);
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



    for (var i = 0; i < 10; i++) {
        if (topartistsboth[i] != undefined) {
            var htmlString = "<div class=\"row\"><div class=\"col-md-3 order\">" + i + "</div> <div class=\"col-md-7 artist-name\">" + topartistsboth[i].artist + "</div> <div class=\"col-md-2 artist-plays\">" + topartistsboth[i].plays + "</div></div>";
            $('.artists-both').append(htmlString);
        }
    }

    $(".page-load").hide();
    $(".login").hide();
    $(".page-content").show();
    $(".album-page").hide();
    $(".playlist-page").hide();


    processBothUsersTopArtists();
}




function processBothUsersTopArtists() {

    var bothusersartist = new Array();
    for (var i = 0; i < 10; i++) {
        if (topartistsboth[i] != undefined) {
            bothusersartist[i] = "{\"label\" : \"" + topartistsboth[i].artist + "\", \"value\": \"" + topartistsboth[i].plays * (playcount1 + playcount2) + "\"}";
        }
    }

    var jsonbothusersartist = "[{ \"data\":  [" + bothusersartist + "]}];";

    $(document).ready(function () {

        (function ($) {
            var methods = {
                el: "",
                init: function (options) {
                    var clone = options["data"].slice(0);
                    var that = this;
                    w = options["width"];
                    h = options["height"];
                    methods.el = this;
                    methods.setup(clone, w, h);
                },

                resizeChart: function () {
                    var svg = $('.bubblechart');
                    var aspect = svg.width() / svg.height();
                    var targetWidth = svg.parent().parent().width();
                    if (targetWidth != null) {
                        svg.attr("width", targetWidth);
                        svg.attr("height", Math.round(targetWidth / aspect));
                    }
                },

                funnelData: function (data, width, height) {
                    function getRandom(min, max) {
                        return Math.floor(Math.random() * (max - min + 1)) + min;
                    }
                    var max_amount = d3.max(data, function (d) {
                        return parseInt(d.value)
                    })
                    var radius_scale = d3.scale.pow().exponent(0.5).domain([0, max_amount]).range([2, 85])
                    $.each(data, function (index, elem) {
                        elem.radius = radius_scale(elem.value) * 1.5;
                        elem.all = 'all';
                        elem.x = getRandom(0, width);
                        elem.y = getRandom(0, height);
                    });
                    return data;
                },

                getMargin: function () {
                    var margin = {
                        top: 30,
                        right: 55,
                        bottom: 50,
                        left: 95
                    };
                    return margin;
                },

                setup: function (data, w, h) {
                    methods.width = w;
                    methods.height = h;
                    methods.fill = d3.scale.ordinal()

                    var margin = methods.getMargin();
                    var selector = methods.el["selector"];
                    var svg = d3.select(selector)
                        .append("svg")
                        .attr("class", "bubblechart")
                        .attr("width", parseInt(methods.width + margin.left + margin.right, 10))
                        .attr("height", parseInt(methods.height + margin.top + margin.bottom, 10))
                        .attr('viewBox', "0 0 " + parseInt(methods.width + margin.left + margin.right, 10) + " " + parseInt(methods.height + margin.top + margin.bottom, 10))
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

                update: function (data) {
                    var selector = methods.el["selector"];
                    //console.log("new data", data);
                    methods.animateBubbles(selector, data);
                },

                animateBubbles: function (selector, data) {
                    data = this.funnelData(data, methods.width, methods.height);
                    var padding = 4;
                    var maxRadius = d3.max(data, function (d) {
                        return parseInt(d.radius)
                    });
                    var year_centers = {
                        "2008": {
                            name: "2008",
                            x: 150,
                            y: 300
                        },
                        "2009": {
                            name: "2009",
                            x: 550,
                            y: 300
                        },
                        "2010": {
                            name: "2010",
                            x: 900,
                            y: 300
                        }
                    }
                    var all_center = {
                        "all": {
                            name: "All Grants",
                            x: methods.width / 2,
                            y: methods.height / 2
                        }
                    };
                    var bubbleholder = d3.select(selector + " .bubbleholder");
                    var bubbles = d3.select(selector + " .bubbles");
                    var labelbubble = d3.select(selector + " .labelbubble");
                    var nodes = bubbles.selectAll("circle")
                        .data(data);
                    // Enter
                    nodes.enter()
                        .append("circle")
                        .attr("class", "node")
                        .attr("cx", function (d) {
                            return d.x;
                        })
                        .attr("cy", function (d) {
                            return d.y;
                        })
                        .attr("r", 1)
                        .style("fill", function (d) {
                            return methods.fill(d.label);
                        })
                        .call(methods.force.drag);
                    // Update
                    nodes
                        .transition()
                        .delay(300)
                        .duration(1000)
                        .attr("r", function (d) {
                            return d.radius;
                        })
                        // Exit
                    nodes.exit()
                        .transition()
                        .duration(250)
                        .attr("cx", function (d) {
                            return d.x;
                        })
                        .attr("cy", function (d) {
                            return d.y;
                        })
                        .attr("r", 1)
                        .remove();
                    var labels = labelbubble.selectAll("text")
                        .data(data);
                    // Enter
                    labels.enter()
                        .append("text")
                        .attr("class", "title")
                        .style("fill", "white")
                        .text(function (d) {
                            return d.label;
                        })
                        .attr("x", function (d) {
                            return d.x;
                        })
                        .attr("y", function (d) {
                            return d.y;
                        })
                        .attr("text-anchor", "middle")
                        .attr("alignment-baseline", "middle")
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

                    function draw(varname) {
                        var foci = varname === "all" ? all_center : year_centers;
                        methods.force.on("tick", tick(foci, varname, .55));
                        methods.force.start();
                    }

                    function tick(foci, varname, k) {
                        return function (e) {
                            data.forEach(function (o, i) {
                                var f = foci[o[varname]];
                                o.y += (f.y - o.y) * k * e.alpha;
                                o.x += (f.x - o.x) * k * e.alpha;
                            });
                            nodes
                                .each(collide(.1))
                                .attr("cx", function (d) {
                                    return d.x;
                                })
                                .attr("cy", function (d) {
                                    return d.y;
                                });
                            labels
                                .each(collide(.1))
                                .attr("x", function (d) {
                                    return d.x;
                                })
                                .attr("y", function (d) {
                                    return d.y;
                                });
                        }
                    }

                    function collide(alpha) {
                        var quadtree = d3.geom.quadtree(data);
                        return function (d) {
                            var r = d.radius + maxRadius + padding,
                                nx1 = d.x - r,
                                nx2 = d.x + r,
                                ny1 = d.y - r,
                                ny2 = d.y + r;
                            quadtree.visit(function (quad, x1, y1, x2, y2) {
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

            $.fn.bubble = function (methodOrOptions) {
                if (methods[methodOrOptions]) {
                    return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
                } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
                    // Default to "init"
                    return methods.init.apply(this, arguments);
                } else {
                    $.error('Method ' + methodOrOptions + ' does not exist');
                }
            };
        })(jQuery);

        var dataChartuserartistas = eval(jsonbothusersartist);
        //alert(dataChartuserartistas);
        //console.log(dataChartuserartistas);

        var clone = jQuery.extend(true, {}, dataChartuserartistas);
        //__invoke bubble
        $('[data-role="bubble"]').each(function (index) {
            var selector = "bubble" + index;
            $(this).attr("id", selector);
            var options = {
                data: clone[0].data,
                width: $(this).data("width"),
                height: $(this).data("height")
            }
            $("#" + selector).bubble(options);
        });
        $(".testers a").on("click", function (e) {
            e.preventDefault();
            var clone = jQuery.extend(true, {}, dataChartuserartistas);
            var min = 0;
            var max = 3;
            //__invoke bubble
            $('[data-role="bubble"]').each(function (index) {
                pos = Math.floor(Math.random() * (max - min + 1)) + min;
                $("#" + $(this).attr("id")).bubble('update', clone[pos].data);
            });
        });
    });

    for (var i = 0; i < $('.bubbles').children().length; i++) {
        $('.node').css('background-image', 'url(' + topartistsboth[i].image + ')');
    }


}







// ---------------------------------------------------------------------------------------------------------
// USER top album
// ---------------------------------------------------------------------------------------------------------

function generateAlbum() {

    $(".artists-page").hide();
    $(".generate-playlist").hide();
    $(".page-load").show();
    getUser1TopAlbum();

}


function getUser1TopAlbum() {

    data1 = {
        api_key: apikey,
        method: "user.getTopAlbums",
        user: username1,
        period: period,
        limit: 100,
        format: "json"
    };

    $.get(base_url, data1)
        .done(processUser1TopAlbums)
        .fail(logError("obter album do utilizador " + username1));

}



function processUser1TopAlbums(data) {

    if ($.isArray(data.topalbums.album)) {
        for (var i = 0; i < data.topalbums.album.length; i++) {
            topalbums1[i] = {
                album: data.topalbums.album[i].name,
                artist: data.topalbums.album[i].artist.name,
                artistid: data.topalbums.album[i].artist.mbid,
                plays: data.topalbums.album[i].playcount,
                image: data.topalbums.album[i].image[3]["#text"]
            }
        }
    }

    getUser2TopAlbum();
}



function getUser2TopAlbum() {

    data2 = {
        api_key: apikey,
        method: "user.getTopAlbums",
        user: username2,
        period: period,
        limit: 100,
        format: "json"
    };

    $.get(base_url, data2)
        .done(processUser2TopAlbums)
        .fail(logError("obter album do utilizador " + username1));

}



function processUser2TopAlbums(data) {

    if ($.isArray(data.topalbums.album)) {
        for (var i = 0; i < data.topalbums.album.length; i++) {
            topalbums2[i] = {
                album: data.topalbums.album[i].name,
                artist: data.topalbums.album[i].artist.name,
                artistid: data.topalbums.album[i].artist.mbid,
                plays: data.topalbums.album[i].playcount,
                image: data.topalbums.album[i].image[3]["#text"]
            }
        }
    }

    generateTopAlbum();
}


function generateTopAlbum() {


    var add = 0;
    for (var i = 0; i < topalbums1.length; i++) {
        for (var i2 = 0; i2 < topalbums2.length; i2++) {
            if (topalbums1[i].album == topalbums2[i2].album && topalbums1[i].artistid == topalbums2[i2].artistid) {
                topalbumsboth[add] = {
                    album: topalbums1[i].album,
                    artist: topalbums1[i].artist,
                    artistid: topalbums1[i].artistid,
                    plays: parseFloat(topalbums1[i].plays / playcount1) + parseFloat(topalbums2[i2].plays / playcount2),
                    image: topalbums1[i].image
                }
            }
        }
    }

    topalbumsboth.sort(function (a, b) {
        // convert to integers from strings
        a = parseFloat(a.plays);
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

    if (topalbumsboth[0] != undefined) {
        var htmlString = "<div class=\"row\"><div class=\"col-md-3 img\"> <img class=\"img-album\" src=" + topalbumsboth[0].image + "/></div> <div class=\"row album-info\">" + topalbumsboth[0].artist + " — " + topalbumsboth[0].album + "</div>";
        $('.album-page').append(htmlString);
    }
    $(".page-load").hide();
    $(".album-page").show();
}

// ---------------------------------------------------------------------------------------------------------
// USER top tracks
// ---------------------------------------------------------------------------------------------------------


function generatePlaylist() {

    $(".artists-page").hide();
    $(".album-page").hide();
    $(".page-load").show();
    getUser1TopTracks();

}


function getUser1TopTracks() {

    data1 = {
        api_key: apikey,
        method: "user.getTopTracks",
        user: username1,
        period: period,
        limit: 400,
        format: "json"
    };

    $.get(base_url, data1)
        .done(processUser1TopTracks)
        .fail(logError("obter faixas favoritas do utilizador " + username1));

}



function processUser1TopTracks(data) {

    if ($.isArray(data.toptracks.track)) {
        for (var i = 0; i < data.toptracks.track.length; i++) {
            toptracks1[i] = {
                track: data.toptracks.track[i].name,
                artist: data.toptracks.track[i].artist.name,
                artistid: data.toptracks.track[i].artist.mbid,
                plays: data.toptracks.track[i].playcount,
                image: data.toptracks.track[i].image[3]["#text"]
            }
        }
    }

    getUser2TopTracks();
}



function getUser2TopTracks() {

    data2 = {
        api_key: apikey,
        method: "user.getTopTracks",
        user: username2,
        period: period,
        limit: 400,
        format: "json"
    };

    $.get(base_url, data2)
        .done(processUser2TopTracks)
        .fail(logError("obter faixas favoritas do utilizador " + username1));

}



function processUser2TopTracks(data) {

    if ($.isArray(data.toptracks.track)) {
        for (var i = 0; i < data.toptracks.track.length; i++) {
            toptracks2[i] = {
                track: data.toptracks.track[i].name,
                artist: data.toptracks.track[i].artist.name,
                artistid: data.toptracks.track[i].artist.mbid,
                plays: data.toptracks.track[i].playcount,
                image: data.toptracks.track[i].image[3]["#text"]
            }
        }
    }

    generateTopPlaylist();
}


function generateTopPlaylist() {

    var add = 0;
    
    for (var i = 0; i < toptracks1.length; i++) {
        for (var i2 = 0; i2 < toptracks2.length; i2++) {
            if (toptracks1[i].track == toptracks2[i2].track && toptracks1[i].artistid == toptracks2[i2].artistid) {
                console.log("YASS");
                console.log(toptracks1[i].track + "  — " + toptracks1[i].artist);
                var check = false;
                for (var i3 = 0; i3 < add; i3++) {
                    if (toptracks1[i].artistid == playlistArray[i3].artistid) {
                        check = true;
                        break;
                    }
                }

                if (!check) {
                    playlistArray[add] = {
                        track: toptracks1[i].track,
                        artist: toptracks1[i].artist,
                        artistid: toptracks1[i].artistid,
                        plays: parseFloat(toptracks1[i].plays / playcount1) + parseFloat(toptracks2[i2].plays / playcount2),
                        image: toptracks1[i].image
                    }

                    add++;
                }
            }
        }
    }
    
/*
    var i = 0;
    while (playlistArray.length < 10) {
        var check = false;
        for (var i2 = 0; i2 < playlistArray.length; i3++) {
            if (topartistsboth[i].artistid == playlistArray[i2].artistid) {
                check = true;
                break;
            }
        }

        if (!check) {

            for (var i3 = 0; i3 < toptracks1.length; i3++) {
                for (var i4 = 0; i4 < toptracks2.length; i4++) {
                    if (toptracks1[i3].track == toptracks2[i4].track && toptracks1[i3].artistid == toptracks2[i4].artistid && topartistsboth[i].artist == toptracks1[i3].artist) {
                        playlistArray[add] = {
                            track: toptracks1[i].track,
                            artist: toptracks1[i].artist,
                            artistid: toptracks1[i].artistid,
                            plays: parseFloat(toptracks1[i].plays / playcount1) + parseFloat(toptracks2[i2].plays / playcount2),
                            image: toptracks1[i].image
                        }
                        add++;

                        console.log("YASS");
                        console.log(toptracks1[i].track + "  — " + toptracks1[i].artist);
                    }
                }

            }
        }
    i++;
    }
    
*/



    console.log(playlistArray);

    playlistArray.sort(function (a, b) {
        // convert to integers from strings
        a = parseFloat(a.plays);
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

    for (var i = 0; i < 10; i++) {
        if (playlistArray[i] != undefined) {
            var htmlString = "<div class=\"row\"><div class=\"col-md-3 img-track\"> <img class=\"img-album\" src=\"" + playlistArray[i].image + "\"/></div> <div class=\"row track-info\">" + playlistArray[i].artist + " — " + playlistArray[i].track + "</div>";
            console.log(htmlString);
            $('.playlist-page').append(htmlString);
        }
    }

    $(".page-load").hide();
    $(".playlist-page").show();
}