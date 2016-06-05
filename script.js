// chaves
var base_url = "https://ws.audioscrobbler.com/2.0/";
var apikey = "87422e7f74c0fd168849b27c3baab250";
var base_request = "https://ws.audioscrobbler.com/2.0/?api_key=87422e7f74c0fd168849b27c3baab250&format=json&method=";

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
var spotifyApi = new SpotifyWebApi();

var playlistSize = 9;


$(function () {



    $("#login-spotify").click(loginSpotify);

    $("#getuser1").click(procurauser1info);
    $("#name1").keypress(function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            $("#getuser1").click();
        }
    });
    $("#getuser2").click(procurauser2info);
    $("#name2").keypress(function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            $("#getuser2").click();
        }
    });
    $("#generate").click(generatePage);
    $("#regenerate").click(regeneratePage);
    $("#generate-album").click(generateAlbum);
    $("#regenerate-album").click(regenerateAlbum);
    $("#generate-playlist").click(generatePlaylist);
    $("#generate-track").click(hideshowplaylist);
    $("#time-selector").on('change', timeSelector);
    $("#save-button").click(function () {
        $(".save-playlist").hide();
        createplaylist();
    });
    $("#error").click(function () {
        location.reload();
    });
    $("#reload").click(function () {
        location.reload();
    });

    //outras
    $(".user1").hide();
    $(".user2").hide();
    $(".page-load").hide();
    $(".mix-load").hide();
    $(".page-content").hide();
    $("#time-selector").hide();
    $("#generate").hide();
    $(".save-playlist").hide();
    $(".album-page").hide();
    $(".playlist-page").hide();
    $(".error").hide();
    $(".saved").hide();


});


// ---------------------------------------------------------------------------------------------------------
// Info USERs
// ---------------------------------------------------------------------------------------------------------

function loginSpotify() {

    OAuth.initialize('0Gjewxq-h6uVsRzTzVdxpDLAEuw');


    OAuth.popup('spotify', {
        cache: true
    }).done(function (network) {
        minhaRede = network;
        $('#access-token').text(network.access_token);

        network.me().done(function (me) {


            $('#spotifyname').text(me.name);
            $('.profilepic').attr("src", me.avatar.url);
            $('#userid').text(me.id);

            var provider = 'spotify';

            OAuth.popup(provider).then(function (oauthResult) {
                return oauthResult.get('/me');
            }).then(function (data) {
                // data is the result of the request to /me
                $('#access-token').text(me.access_token);
            }).fail(function (err) {
                // handle an error
            });

        }).fail();
    }).fail();





    $('#title').css('text-align', 'left');
    $('#title').css('display', 'inline');

    $(".login").animate({
        height: 5
    }, 500);

    $(".title").animate({
        marginTop: 50
    }, 500);

    $(".users").animate({
        marginTop: 150
    }, 500);

    $("#title").animate({
        fontSize: 20,
        left: 0
    }, 500);


    $("#login-spotify").hide();
    $("#slogan").hide();
    $(".user1").show();
}


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
        //.fail(log("A obter informação do utilizador " + username1));
}

function processUser1Info(info) {

    if (info.error) {
        //log("Erro: " + info.error.message); 
    } else {
        $(".user1").removeClass("col-md-offset-3");
        $(".user2").show();
        var name1 = info.user.name;
        var realname1 = info.user.realname;
        var url1 = info.user.url;
        var img1 = info.user.image[3]["#text"];
        playcount1 = info.user.playcount;

        $("#img1").html("<img id='profileImage' class='center-block' src='" + img1 + "' >");

        $("#name1").prop('disabled', true);
        $("#name1").css('border-bottom', 'none');
        $("#getuser1").hide();
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
        //.fail(logError("A obter informação do utilizador " + username2));
}

function processUser2Info(info) {

    if (info.error) {
        //log("Erro: " + info.error.message);
    } else {
        $("#time-selector").show();
        var name2 = info.user.name;
        var realname2 = info.user.realname;
        var url2 = info.user.url;
        var img2 = info.user.image[3]["#text"];
        playcount2 = info.user.playcount;
        $("#img2").html("<img class='center-block' src='" + img2 + "' >");

        $("#name2").prop('disabled', true);
        $("#name2").css('border-bottom', 'none');
        $("#getuser2").hide();
    }
}

function timeSelector() {
    period = $("#time-selector option:selected").val();
    $("#generate").show();
}




function generatePage() {
    $(".page-load").show();
    $(".users").hide();
    $("#status").hide();
    $(".page-content").hide();
    procurauser1artistas();
}

function regeneratePage() {
    $(".page-load").hide();
    $(".users").hide();
    $("#status").hide();
    $(".page-content").show();
    $(".album-page").hide();
    $(".playlist-page").hide();
    $(".artists-page").show();
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
        period: period,
        limit: 100,
        format: "json"
    };

    $.get(base_url, data1)
        .done(processUser1TopArtists)
        //.fail(logError("obter artistas do utilizador " + username1));
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
        period: period,
        limit: 100,
        format: "json"
    };

    $.get(base_url, data2)
        .done(processUser2TopArtists)
        //.fail(logError("obter artistas do utilizador " + username2));
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



    if (topartistsboth.length > 0) {
        for (var i = 0; i < 10; i++) {
            if (topartistsboth[i] != undefined) {
                var htmlString = "<div class=\"row\"><div class=\"col-md-3 order\">" + i + "</div> <div class=\"col-md-7 artist-name\">" + topartistsboth[i].artist + "</div> <div class=\"col-md-2 artist-plays\">" + topartistsboth[i].plays + "</div></div>";
                $('.artists-both').append(htmlString);
            }
        }
        processBothUsersTopArtists();
    } else {
        $(".error").show();
        $(".page-load").hide();
    }


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

    $(".page-load").hide();
    $(".users").hide();
    $("#status").hide();
    $(".page-content").show();
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

function regenerateAlbum() {
    $(".page-load").hide();
    $(".playlist-page").hide();
    $(".album-page").show();
    buttonIncrease = 0;
    $("#playlist-results").empty();
    playlist = new Array();
    ite = 0;
    temp = new Array();
    ending = false;
    actualTrack = 0;
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
        //.fail(logError("obter album do utilizador " + username1));
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
        //.fail(logError("obter album do utilizador " + username1));
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
    if (topalbumsboth.length > 0) {
        var query = topalbumsboth[0].artist + " " + topalbumsboth[0].album;
        searchAlbums(query);

        function searchAlbums(query) {
            $.ajax({
                url: 'https://api.spotify.com/v1/search',
                data: {
                    q: query,
                    type: 'album'
                },
                success: function (response) {
                    resultsPlaceholder.innerHTML = template(response);
                    $('.album-info').html(topalbumsboth[0].artist + " — " + topalbumsboth[0].album);

                    $(".page-load").hide();
                    $(".album-page").show();
                }
            });
        };

        var fetchTracks = function (albumId, callback) {
            $.ajax({
                url: 'https://api.spotify.com/v1/albums/' + albumId,
                success: function (response) {
                    callback(response);
                }
            });
        };

        var templateSource = document.getElementById('results-template').innerHTML,
            template = Handlebars.compile(templateSource),
            resultsPlaceholder = document.getElementById('results'),
            playingCssClass = 'playing',
            audioObject = null;


        results.addEventListener('click', function (e) {
            var target = e.target;
            if (target !== null && target.classList.contains('cover')) {
                if (target.classList.contains(playingCssClass)) {
                    audioObject.pause();
                } else {
                    if (audioObject) {
                        audioObject.pause();
                    }
                    fetchTracks(target.getAttribute('data-album-id'), function (data) {
                        audioObject = new Audio(data.tracks.items[0].preview_url);
                        audioObject.play();
                        target.classList.add(playingCssClass);
                        audioObject.addEventListener('ended', function () {
                            target.classList.remove(playingCssClass);
                        });
                        audioObject.addEventListener('pause', function () {
                            target.classList.remove(playingCssClass);
                        });
                    });
                }
            }
        });
    } else {
        $(".error").show();
        $(".page-load").hide();
    }
}


// ---------------------------------------------------------------------------------------------------------
// USER top tracks
// ---------------------------------------------------------------------------------------------------------

function generatePlaylist() {
    $(".artists-page").hide();
    $(".album-page").hide();
    $(".mix-load").show();
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
        //.fail(logError("obter faixas favoritas do utilizador " + username1));
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
        //.fail(logError("obter faixas favoritas do utilizador " + username1));
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
                var check = false;
                //check if artist is on playlist
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
    //console.log(playlistArray);
    getresults();
}

var playlist = new Array();
var ite = 0;
var temp = new Array();
var ending = false;
var actualTrack = 0;

function getresults() {
    if (playlistArray[actualTrack] != undefined) {
        var prev = null;
        queryTerm = playlistArray[actualTrack].artist + " " + playlistArray[actualTrack].track;

        // abort previous request, if any
        if (prev !== null) {
            prev.abort();
        }

        // store the current promise in case we need to abort it
        prev = spotifyApi.searchTracks(queryTerm, {
                limit: 1
            })
            .then(function (data) {
                    // clean the promise so it doesn't call abort
                    prev = null;

                    // ...render list of search results...
                    //console.log(data);
                    if (data.tracks.total > 0) {
                        temp[ite] = data;
                        renderResults();
                        ite++;
                    } else {
                        //console.log("I skipped one");
                        getresults();
                    }
                },
                function (err) {
                    console.error(err);
                });
    } else if ((temp.length == 0 && playlistArray[actualTrack + 1] == undefined) || playlistArray.length == 0) {
        $(".error").show();
        $(".mix-load").hide();
    } else if (playlistArray[actualTrack + 1] == undefined) {
        playlistSize = temp.length - 1;
    }

    actualTrack++;
    //console.log(actualTrack);
}

function renderResults() {
    //console.log(temp[i]);
    //var artist = temp[ite].tracks.items[0].artists[0].name;

    //if (artist == playlistArray[actualTrack].artist) {
    playlist[ite] = {
        backgroundimg: temp[ite].tracks.items[0].album.images[0].url,
        previewid: temp[ite].tracks.items[0].album.id,
        previewurl: temp[ite].tracks.items[0].preview_url,
        name: temp[ite].tracks.items[0].name,
        artist: temp[ite].tracks.items[0].artists[0].name,
        uri: temp[ite].tracks.items[0].uri
    };
    //} 


    /*
        if (ite < 5 && i == temp.length - 1) {
            //ERROR PAGE:::::
        } else if (ite >= 5 && i == temp.length - 1) {
            flag = true;
            break;
        } else if (ite == 10) {
            flag = true;
            break;
        }


        if (flag) {
            renderPreview();
        }
        $(".mix-load").hide();
        $(".playlist-page").show();
        $(".wrapper-song").hide();
        hideshowplaylist();
    }*/

    stringHTML = "<div id=\"wrapper" + ite + "\" class=\"wrapper-song\"><h1>" + (ite + 1) + ".</h1><h2 class=\"track-info\">" + playlist[ite].artist + " — " + playlist[ite].name + "</h2><div class=\"col-md-6 col-md-offset-3 img\"><div style=\"background-image:url(" + playlist[ite].backgroundimg + ")\" name=\"" + ite + "\" data-album-id=\"" + playlist[ite].previewid + "\" id=\"wetried" + ite + "\" class=\"cover\"></div></div>";

    $("#playlist-results").append(stringHTML);

    var playingCssClass = 'playing',
        audioObject = null;

    var target = document.getElementById('wetried' + ite);

    var fetchTracks = function (albumId, callback) {
        $.ajax({
            url: 'https://api.spotify.com/v1/albums/' + albumId,
            success: function (response) {
                callback(response);
            }
        });
    };


    target.addEventListener('click', function () {
        target = this;
        var string = this.getAttribute('name');
        var i2 = parseInt(string);
        if (target !== null && target.classList.contains('cover')) {
            if (target.classList.contains(playingCssClass)) {
                audioObject.pause();
            } else {
                if (audioObject) {
                    audioObject.pause();
                }
                fetchTracks(target.getAttribute('data-album-id'), function (data) {
                    //console.log(target.getAttribute('name'));
                    audioObject = new Audio(playlist[i2].previewurl);
                    audioObject.play();
                    target.classList.add(playingCssClass);
                    audioObject.addEventListener('ended', function () {
                        target.classList.remove(playingCssClass);
                    });
                    audioObject.addEventListener('pause', function () {
                        target.classList.remove(playingCssClass);
                    });
                });
            }
        }
    });

    $(".mix-load").hide();
    $(".playlist-page").show();
    $("#wrapper" + buttonIncrease).show(400);

}




var buttonIncrease = 0;

function hideshowplaylist() {
    if (buttonIncrease == playlistSize || (buttonIncrease == playlist.length - 1 && ending)) {
        $(".playlist-page").hide();
        $(".save-playlist").show();
    } else {
        $("#wrapper" + buttonIncrease).hide(400);
        getresults();
        buttonIncrease++;

    }
};

var playlistid;

function createplaylist() {
    var userid = $("#userid").text();
    var accessToken = $("#access-token").text();

    //console.log(accessToken);
    //console.log(userid);

    spotifyApi.setAccessToken(accessToken);
    var myPlaylist = spotifyApi.createPlaylist(userid, {
        "name": username1 + " & " + username2,
        "public": false
    }, function (error, data) {
        playlistid = data.id;
        addTracksToPlaylist();
        //console.log(error);
        //console.log(data);
    });
}


function addTracksToPlaylist() {

    var userid = $("#userid").html();

    function toArray(arr) {
        var rv = [];
        for (var i = 0; i < arr.length; ++i)
            if (arr[i] !== undefined) rv[i] = arr[i].uri;
        return rv;
    }
    var objPlaylist = toArray(playlist);

    var finalAdd = spotifyApi.addTracksToPlaylist(userid, playlistid, objPlaylist, function (error, data) {

        $(".saved").show();
    });
}



/*
//GRADIENT

var colors = new Array(
  [62, 35, 255], [60, 255, 60], [255, 35, 98], [45, 175, 230], [255, 0, 255], [255, 128, 0]);

var step = 0;
//color table indices for: 
// current color left
// next color left
// current color right
// next color right
var colorIndices = [0, 1, 2, 3];

//transition speed
var gradientSpeed = 0.002;

function updateGradient() {

    if ($ === undefined) return;

    var c0_0 = colors[colorIndices[0]];
    var c0_1 = colors[colorIndices[1]];
    var c1_0 = colors[colorIndices[2]];
    var c1_1 = colors[colorIndices[3]];

    var istep = 1 - step;
    var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
    var g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
    var b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
    var color1 = "rgb(" + r1 + "," + g1 + "," + b1 + ")";

    var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
    var g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
    var b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
    var color2 = "rgb(" + r2 + "," + g2 + "," + b2 + ")";


    $('body').css({
        background: "-webkit-gradient(linear, left top, right top, from(" + color1 + "), to(" + color2 + "))"
    }).css({
        background: "-moz-linear-gradient(left, " + color1 + " 0%, " + color2 + " 100%)"
    });

    step += gradientSpeed;
    if (step >= 1) {
        step %= 1;
        colorIndices[0] = colorIndices[1];
        colorIndices[2] = colorIndices[3];

        //pick two new target color indices
        //do not pick the same as the current one
        colorIndices[1] = (colorIndices[1] + Math.floor(1 + Math.random() * (colors.length - 1))) % colors.length;
        colorIndices[3] = (colorIndices[3] + Math.floor(1 + Math.random() * (colors.length - 1))) % colors.length;

    }
}

setInterval(updateGradient, 15);
*/
