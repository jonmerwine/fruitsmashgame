/*Declare canvas and context variables as well as game and image array*/
var c, ctx, board, images, match, index1, index2, t, loop;

/*Check for multiple matches*/
var multipleMatch = 0;

/*Time to play*/
var count = 0;

/*Animate explosion*/
var on = 0;

/*Player Score*/
var playerScore = 0;

/*Keep track of clicks*/
var clicks = 0;

/*grab both objects*/
var tile1 = new Object();
var tile2 = new Object();

$(document).ready(function()
{
    (function(global) {
        var name = global.localStorage.getItem("username");
        $("#userName").html("Welcome " + name + "!");
    }(window));

    //hide images
    $("#preload").hide();

    //Grab the canvas and the context
    c = document.getElementById("myCanvas");
    ctx = c.getContext("2d");

    loadImages();

    count = 60; //seconds
    t = setInterval(timer, 1000);

    /*Backgroung Effects*/

    $("#halfOrange").hover(function()
    {
        $(this).css({opacity: 1});
    },
            function() {
                $(this).css({opacity: 0.7});
            }
    );

});

function timer()
{

    var mm = Math.floor(count / 60);
    var ss = count - (mm * 60);

    if (ss - 10 < 0)
    {
        ss = "0" + ss;
    }

    $("#time").html("Time: " + mm + ":" + ss);
    if (count === 0)
    {
        clearTimeout(t);
        (function(global) {
            global.localStorage.setItem("playerScore", $("#score").text());
        }(window));
        window.location.href = "finish.html";
    }
    count--;
}


function setup()
{
    /*Initialize board and images*/
    initialize();

    makeBoard();

    //Display the page of images
    displayGridInitial();

    //Add click listener to canvas
    c.addEventListener("click", clicked, false);
}

function clicked(ev)
{
    //increment click
    clicks += 1;

    /* Play click sound when tile is selected*/
    var snd = new Audio("audio/click.wav");
    snd.play();

    /* Get the x,y of the position clicked and convert it to the
     * array position*/
    var x = ev.clientX - c.offsetLeft;
    var y = ev.clientY - c.offsetTop;

    /* Floor gives us the index by rounding down*/
    var indexX = Math.floor(x / 50);
    var indexY = Math.floor(y / 50);

    if (clicks === 1)
    {

        if (board[indexX][indexY] <= 7)
        {
            board[indexX][indexY] += 7;
            tile1.x = indexX;
            tile1.y = indexY;
        }
        else
        {
            clicks = 0;
            board[indexX][indexY] -= 7;
        }
    }

    else if (clicks === 2)
    {

        var bool = checkAdj(indexX, indexY);

        if (bool === 1)
        {
            if (board[indexX][indexY] <= 7)
            {
                board[indexX][indexY] += 7;
                tile2.x = indexX;
                tile2.y = indexY;
                var orient = "";
                var pos;
                if (tile1.x - tile2.x === 0)
                {
                    orient = "vert";
                    if (tile1.y > tile2.y)
                    {
                        pos = 1;
                    }
                    else
                    {
                        pos = 2;
                    }
                }
                else
                {
                    orient = "hori";
                    if (tile1.x > tile2.x)
                    {
                        pos = 1;
                    }
                    else
                    {
                        pos = 2;
                    }
                }
                animate(orient, pos);
            }
            else
            {
                reset();
                board[indexX][indexY] -= 7;
            }
        }
        else
        {
            reset();
        }
    }

    else
    {
        reset();
    }

    var temp = new Image();
    temp.onload = function()
    {
        ctx.clearRect(indexX * 50, indexY * 50, 50, 50);
        ctx.drawImage(temp, indexX * 50, indexY * 50);
    };
    temp.src = images[board[indexX][indexY]];
}

function checkAdj(indexX, indexY)
{
    if (indexX === tile1.x - 1 || indexX === tile1.x + 1)
    {
        if (indexY !== tile1.y)
        {
            return 0;
        }
        else
        {
            return 1;
        }

    }
    else if (indexY === tile1.y - 1 || indexY === tile1.y + 1)
    {
        if (indexX !== tile1.x)
        {
            return 0;
        }
        else
        {
            return 1;
        }
    }
    else
    {
        return 0;
    }
}

function makeBoard()
{
    for (var i = 0; i < 16; i++)
    {
        for (var k = 0; k < 12; k++)
        {
            var rand = Math.floor((Math.random() * 7) + 1);
            board[i][k] = rand;
        }
    }

    for (var i = 0; i < 16; i++)
    {
        for (var k = 0; k < 12; k++)
        {
            checkMultiple(i, k);
        }
    }

}

function displayGridInitial()
{
    for (var i = 0; i < 16; i++)
    {
        for (var k = 0; k < 12; k++)
        {
            var temp = new Image();
            temp.src = images[board[i][k]];
            ctx.drawImage(temp, 50 * i, 50 * k);
        }
    }
}

function animate(orient, pos)
{
    var x1, x2, y1, y2;

    x1 = tile1.x * 50;
    y1 = tile1.y * 50;

    x2 = tile2.x * 50;
    y2 = tile2.y * 50;

    var image1Place = board[tile1.x][tile1.y];
    var image2Place = board[tile2.x][tile2.y];

    var img2;
    var img1 = new Image();
    img1.onload = function()
    {

        img2 = new Image();
        img2.onload = function()
        {
            var interval = setInterval(function() {

                return function() {
                    ctx.clearRect(tile1.x * 50, tile1.y * 50, 50, 50);
                    ctx.clearRect(tile2.x * 50, tile2.y * 50, 50, 50);

                    ctx.drawImage(img1, x1, y1);
                    ctx.drawImage(img2, x2, y2);

                    if (orient === "hori")
                    {
                        if (pos === 2)
                        {
                            x1 += 1;
                            x2 -= 1;
                            if (x1 > tile2.x * 50) {
                                clearInterval(interval);
                                callback(orient, pos);
                            }
                        }
                        else
                        {
                            x1 -= 1;
                            x2 += 1;
                            if (x2 > tile1.x * 50) {
                                clearInterval(interval);
                                callback(orient, pos);
                            }
                        }
                    }
                    else
                    {
                        if (pos === 2)
                        {
                            y1 += 1;
                            y2 -= 1;
                            if (y1 > tile2.y * 50) {
                                clearInterval(interval);
                                callback(orient, pos);
                            }
                        }
                        else
                        {
                            y1 -= 1;
                            y2 += 1;
                            if (y2 > tile1.y * 50) {
                                clearInterval(interval);
                                callback(orient, pos);

                            }
                        }
                    }
                };
            }(), 10);
        };
        img2.src = images[image2Place];
    };
    img1.src = images[image1Place];

    var hold = board[tile1.x][tile1.y] - 7;
    board[tile1.x][tile1.y] = board[tile2.x][tile2.y] - 7;
    board[tile2.x][tile2.y] = hold;
}

function callback(orient, pos)
{
    var res = checkMatch();
    if (res === 1) {
        while (res === 1)
        {
            multipleMatch = 0;
            playerScore += 30;
            $("#score").html(playerScore);
            board[tile1.x][tile1.y] += 7;
            board[tile2.x][tile2.y] += 7;
            reset(1);
            swapNewTiles();//swapNewTiles();
            res = multipleMatch;
            setTimeout(function() {
                res = multipleMatch;
                if (res === 1)
                {
                    callback(orient, pos);
                }
                reDrawSelection();
            }, 500);
        }
    }
    else
    {
        var x1, x2, y1, y2;

        x1 = tile1.x * 50;
        y1 = tile1.y * 50;

        x2 = tile2.x * 50;
        y2 = tile2.y * 50;

        var image1Place = board[tile1.x][tile1.y];
        var image2Place = board[tile2.x][tile2.y];

        var img2;
        var img1 = new Image();
        img1.onload = function()
        {

            img2 = new Image();
            img2.onload = function()
            {
                var interval = setInterval(function() {

                    return function() {
                        ctx.clearRect(tile1.x * 50, tile1.y * 50, 50, 50);
                        ctx.clearRect(tile2.x * 50, tile2.y * 50, 50, 50);

                        ctx.drawImage(img1, x1, y1);
                        ctx.drawImage(img2, x2, y2);

                        if (orient === "hori")
                        {
                            if (pos === 2)
                            {
                                x1 += 1;
                                x2 -= 1;
                                if (x1 > tile2.x * 50) {
                                    clearInterval(interval);
                                    reset();
                                }
                            }
                            else
                            {
                                x1 -= 1;
                                x2 += 1;
                                if (x2 > tile1.x * 50) {
                                    clearInterval(interval);
                                    reset();
                                }
                            }
                        }
                        else
                        {
                            if (pos === 2)
                            {
                                y1 += 1;
                                y2 -= 1;
                                if (y1 > tile2.y * 50) {
                                    clearInterval(interval);
                                    reset();
                                }
                            }
                            else
                            {
                                y1 -= 1;
                                y2 += 1;
                                if (y2 > tile1.y * 50) {
                                    clearInterval(interval);
                                    reset();
                                }
                            }
                        }
                    };
                }(), 10);
            };
            img2.src = images[image2Place];
        };
        img1.src = images[image1Place];

        var hold = board[tile1.x][tile1.y];
        board[tile1.x][tile1.y] = board[tile2.x][tile2.y];
        board[tile2.x][tile2.y] = hold;
    }
}

function swapNewTiles()
{
    var source = getSmashGif(images[board[index1][index2]]);
    var anm1 = $('<img id="img1" style="position:absolute;">');
    anm1.attr('src', source);
    anm1.appendTo('html');

    var anm2 = $('<img id="img2" style="position:absolute;">');
    anm2.attr('src', source);
    anm2.appendTo('html');

    var anm3 = $('<img id="img3" style="position:absolute;">');
    anm3.attr('src', source);
    anm3.appendTo('html');

    if (match === "above")
    {
        ctx.clearRect(index1 * 50, (index2 - 2) * 50, 50, 150);
        $("#img1").css({"top": index2 * 50 + c.offsetTop + "px", "left": index1 * 50 + c.offsetLeft + "px"});
        $("#img2").css({"top": (index2 - 1) * 50 + c.offsetTop + "px", "left": index1 * 50 + c.offsetLeft + "px"});
        $("#img3").css({"top": (index2 - 2) * 50 + c.offsetTop + "px", "left": index1 * 50 + c.offsetLeft + "px"});

        board[index1][index2] = Math.floor((Math.random() * 7) + 1);
        board[index1][index2 - 1] = Math.floor((Math.random() * 7) + 1);
        board[index1][index2 - 2] = Math.floor((Math.random() * 7) + 1);

        checkMultiple(index1, index2);
        checkMultiple(index1, index2 - 1);
        checkMultiple(index1, index2 - 2);

        loop = setTimeout(function() {
            addNewTiles(0, 0, -1, -2);
            return multipleMatch;
        }, 400);
    }
    else if (match === "below")
    {
        ctx.clearRect(index1 * 50, index2 * 50, 50, 150);
        $("#img1").css({"top": index2 * 50 + c.offsetTop + "px", "left": index1 * 50 + c.offsetLeft + "px"});
        $("#img2").css({"top": (index2 + 1) * 50 + c.offsetTop + "px", "left": index1 * 50 + c.offsetLeft + "px"});
        $("#img3").css({"top": (index2 + 2) * 50 + c.offsetTop + "px", "left": index1 * 50 + c.offsetLeft + "px"});

        board[index1][index2] = Math.floor((Math.random() * 7) + 1);
        board[index1][index2 + 1] = Math.floor((Math.random() * 7) + 1);
        board[index1][index2 + 2] = Math.floor((Math.random() * 7) + 1);

        checkMultiple(index1, index2);
        checkMultiple(index1, index2 + 1);
        checkMultiple(index1, index2 + 2);

        loop = setTimeout(function() {
            addNewTiles(0, 0, 1, 2);
            return multipleMatch;
        }, 400);

    }
    else if (match === "right")
    {
        ctx.clearRect(index1 * 50, index2 * 50, 150, 50);

        $("#img1").css({"top": index2 * 50 + c.offsetTop + "px", "left": index1 * 50 + c.offsetLeft + "px"});
        $("#img2").css({"top": (index2) * 50 + c.offsetTop + "px", "left": (index1 + 1) * 50 + c.offsetLeft + "px"});
        $("#img3").css({"top": (index2) * 50 + c.offsetTop + "px", "left": (index1 + 2) * 50 + c.offsetLeft + "px"});

        board[index1][index2] = Math.floor((Math.random() * 7) + 1);
        board[index1 + 1][index2] = Math.floor((Math.random() * 7) + 1);
        board[index1 + 2][index2] = Math.floor((Math.random() * 7) + 1);

        checkMultiple(index1, index2);
        checkMultiple(index1 + 1, index2);
        checkMultiple(index1 + 2, index2);
        loop = setTimeout(function() {
            addNewTiles(1, 2, 0, 0);
            return multipleMatch;
        }, 400);
    }
    else if (match === "left")
    {
        ctx.clearRect(index1 * 50, (index2 - 2) * 50, 50, 150);
        $("#img1").css({"top": index2 * 50 + c.offsetTop + "px", "left": index1 * 50 + c.offsetLeft + "px"});
        $("#img2").css({"top": (index2) * 50 + c.offsetTop + "px", "left": (index1 - 1) * 50 + c.offsetLeft + "px"});
        $("#img3").css({"top": (index2) * 50 + c.offsetTop + "px", "left": (index1 - 2) * 50 + c.offsetLeft + "px"});

        board[index1][index2] = Math.floor((Math.random() * 7) + 1);
        board[index1 - 1][index2] = Math.floor((Math.random() * 7) + 1);
        board[index1 - 2][index2] = Math.floor((Math.random() * 7) + 1);

        checkMultiple(index1, index2);
        checkMultiple(index1 - 1, index2);
        checkMultiple(index1 - 2, index2);

        loop = setTimeout(function() {
            addNewTiles(-1, -2, 0, 0);
            return multipleMatch;
        }, 400);
    }
    else if (match === "hmid")
    {
        ctx.clearRect((index1 - 1) * 50, index2 * 50, 150, 50);
        $("#img1").css({"top": index2 * 50 + c.offsetTop + "px", "left": index1 * 50 + c.offsetLeft + "px"});
        $("#img2").css({"top": (index2) * 50 + c.offsetTop + "px", "left": (index1 - 1) * 50 + c.offsetLeft + "px"});
        $("#img3").css({"top": (index2) * 50 + c.offsetTop + "px", "left": (index1 + 1) * 50 + c.offsetLeft + "px"});

        board[index1][index2] = Math.floor((Math.random() * 7) + 1);
        board[index1 - 1][index2] = Math.floor((Math.random() * 7) + 1);
        board[index1 + 1][index2] = Math.floor((Math.random() * 7) + 1);

        checkMultiple(index1, index2);
        checkMultiple(index1 - 1, index2);
        checkMultiple(index1 + 1, index2);

        loop = setTimeout(function() {
            addNewTiles(-1, 1, 0, 0);
            return multipleMatch;
        }, 400);
    }
    else if (match === "vmid")
    {
        ctx.clearRect(index1 * 50, (index2 - 1) * 50, 50, 150);
        $("#img1").css({"top": index2 * 50 + c.offsetTop + "px", "left": index1 * 50 + c.offsetLeft + "px"});
        $("#img2").css({"top": (index2 + 1) * 50 + c.offsetTop + "px", "left": index1 * 50 + c.offsetLeft + "px"});
        $("#img3").css({"top": (index2 - 1) * 50 + c.offsetTop + "px", "left": index1 * 50 + c.offsetLeft + "px"});

        board[index1][index2] = Math.floor((Math.random() * 7) + 1);
        board[index1][index2 + 1] = Math.floor((Math.random() * 7) + 1);
        board[index1][index2 - 1] = Math.floor((Math.random() * 7) + 1);

        checkMultiple(index1, index2);
        checkMultiple(index1, index2 + 1);
        checkMultiple(index1, index2 - 1);

        loop = setTimeout(function() {
            addNewTiles(0, 0, 1, -1);
            return multipleMatch;
        }, 400);
    }
}

function getSmashGif(str)
{
    var ret = "";
    if (str.toLowerCase().indexOf("green") >= 0)
    {
        /* Play smash sound for Green Apple*/
        var snd = new Audio("audio/appleGreenSmash.mp3");
        snd.play();
        ret = "images/appleExplode.gif";
    }
    else if (str.toLowerCase().indexOf("watermelon") >= 0)
    {
        /* Play smash sound for Watermelon*/
        var snd = new Audio("audio/wmSmash.wav");
        snd.play();
        ret = "images/wmExplode.gif";
    }
    else if (str.toLowerCase().indexOf("strawberry") >= 0)
    {
        /* Play smash sound for Strawberry*/
        var snd = new Audio("audio/stSmash.mp3");
        snd.play();
        ret = "images/stExplode.gif";
    }
    else if (str.toLowerCase().indexOf("cherry") >= 0)
    {
        /* Play smash sound for Cherry*/
        var snd = new Audio("audio/chSmash.wav");
        snd.play();
        ret = "images/chExplode.gif";
    }
    else if (str.toLowerCase().indexOf("orange") >= 0)
    {
        /* Play smash sound for Orange*/
        var snd = new Audio("audio/orSmash.wav");
        snd.play();
        ret = "images/orExplode.gif";
    }
    else if (str.toLowerCase().indexOf("grape") >= 0)
    {
        /* Play smash sound for Grape*/
        var snd = new Audio("audio/grSmash.wav");
        snd.play();
        ret = "images/grExplode.gif";
    }
    else if (str.toLowerCase().indexOf("applered") >= 0)
    {
        /* Play smash sound for Apple Red*/
        var snd = new Audio("audio/arSmash.wav");
        snd.play();
        ret = "images/arExplode.gif";
    }
    return ret;
}

function addNewTiles(x1, x2, y1, y2)
{
    var ret;
    var img1 = new Image();
    var img2 = new Image();
    var img3 = new Image();
    img1.onload = function()
    {
        img2.onload = function()
        {
            img3.onload = function()
            {

                $("#img1").remove();
                $("#img2").remove();
                $("#img3").remove();
                ctx.clearRect(index1 * 50, index2 * 50, 50, 50);
                ctx.clearRect((index1 + x1) * 50, (index2 + y1) * 50, 50, 50);
                ctx.clearRect((index1 + x2) * 50, (index2 + y2) * 50, 50, 50);
                ctx.drawImage(img1, (index1) * 50, (index2) * 50);
                ctx.drawImage(img2, (index1 + x1) * 50, (index2 + y1) * 50);
                ctx.drawImage(img3, (index1 + x2) * 50, (index2 + y2) * 50);
                ret = checkMatch();
                multipleMatch = ret;
            };
            img3.src = images[board[index1 + x2][index2 + y2]];
        };
        img2.src = images[board[index1 + x1][index2 + y1]];
    };
    img1.src = images[board[index1][index2]];

}

function reDrawSelection()
{
    if (board[tile1.x][tile1.y] <= 7)
    {
        var temp3 = new Image();
        temp3.onload = function()
        {
            ctx.clearRect(tile1.x * 50, tile1.y * 50, 50, 50);
            ctx.drawImage(temp3, tile1.x * 50, tile1.y * 50);
        };
        temp3.src = images[board[tile1.x][tile1.y]];
    }

    if (board[tile2.x][tile2.y] <= 7)
    {
        var temp4 = new Image();
        temp4.onload = function()
        {
            ctx.clearRect(tile2.x * 50, tile2.y * 50, 50, 50);
            ctx.drawImage(temp4, tile2.x * 50, tile2.y * 50);
        };
        temp4.src = images[board[tile2.x][tile2.y]];
    }
}

function reset(valid)
{
    clicks = 0;
    if (board[tile1.x][tile1.y] > 7)
    {
        board[tile1.x][tile1.y] -= 7;
        var temp1 = new Image();
        temp1.onload = function()
        {
            if (valid !== 1) {
                ctx.clearRect(tile1.x * 50, tile1.y * 50, 50, 50);
                ctx.drawImage(temp1, tile1.x * 50, tile1.y * 50);
            }
        };
        temp1.src = images[board[tile1.x][tile1.y]];
    }
    if (board[tile2.x][tile2.y] > 7)
    {
        board[tile2.x][tile2.y] -= 7;
        var temp2 = new Image();
        temp2.onload = function()
        {
            if (valid !== 1) {
                ctx.clearRect(tile2.x * 50, tile2.y * 50, 50, 50);
                ctx.drawImage(temp2, tile2.x * 50, tile2.y * 50);
            }
        };
        temp2.src = images[board[tile2.x][tile2.y]];
    }

}


function initialize()
{
    board = new Array(16);
    for (var i = 0; i < board.length; i++)
    {
        board[i] = new Array(12);
    }

    images = new Array(15);
    images[0] = "";
    images[1] = "images/appleGreen.png";
    images[2] = "images/appleRed.png";
    images[3] = "images/cherry.png";
    images[4] = "images/grape.png";
    images[5] = "images/orange.png";
    images[6] = "images/strawberry.png";
    images[7] = "images/watermelon.png";
    images[8] = "images/agSelect.png";
    images[9] = "images/arSelect.png";
    images[10] = "images/chSelect.png";
    images[11] = "images/grSelect.png";
    images[12] = "images/orSelect.png";
    images[13] = "images/stSelect.png";
    images[14] = "images/wmSelect.png";

}

function print()
{
    var b = "";
    for (var i = 0; i < 16; i++)
    {
        for (var k = 0; k < 12; k++)
        {
            b += board[i][k] + " ";
        }
        b += "\n";
    }
    alert(b);
}

function checkMultiple(i, k)
{
    var t1 = 0;
    var t2 = 0;
    var t3 = 0;
    var t4 = 0;
    var t5 = 0;
    var t6 = 0;

    if (i - 2 >= 0 && i + 2 <= 15)
    {
        if (board[i - 2][k] == board[i][k])
        {
            t1++;
        }
        if (board[i - 1][k] == board[i][k])
        {
            t1++;
        }

        if (board[i + 2][k] == board[i][k])
        {
            t2++;
        }
        if (board[i + 1][k] == board[i][k])
        {
            t2++;
        }

    }

    if (k - 2 >= 0 && k + 2 <= 11)
    {
        if (board[i][k - 2] == board[i][k])
        {
            t3++;
        }
        if (board[i][k - 1] == board[i][k])
        {
            t3++;
        }

        if (board[i][k + 2] == board[i][k])
        {
            t4++;
        }
        if (board[i][k + 1] == board[i][k])
        {
            t4++;
        }

    }

    if (k - 1 >= 0 && k + 1 <= 11 && i - 1 >= 0 && i + 1 <= 15)
    {
        if (board[i][k - 1] == board[i][k])
        {
            t5++;
        }
        if (board[i][k + 1] == board[i][k])
        {
            t5++;
        }

        if (board[i + 1][k] == board[i][k])
        {
            t6++;
        }
        if (board[i - 1][k] == board[i][k])
        {
            t6++;
        }
    }

    if (t1 == 2 || t2 == 2 || t3 == 2 || t4 == 2 || t5 == 2 || t6 == 2)
    {
        var rand = Math.floor((Math.random() * 7) + 1);
        while (board[i][k] === rand)
        {
            rand = Math.floor((Math.random() * 7) + 1);
        }
        board[i][k] = rand;
        checkMultiple(i, k);
    }
}


function checkMatch()
{
    for (var i = 0; i < 16; i++)
    {
        for (var k = 0; k < 12; k++)
        {
            var res = checkMatchHelper(i, k);
            if (res === 1)
            {
                return 1;
            }
        }
    }
    return 0;
}

function checkMatchHelper(i, k)
{
    var t1 = 0;
    var t2 = 0;
    var t3 = 0;
    var t4 = 0;
    var t5 = 0;
    var t6 = 0;

    if (i - 2 >= 0 && i + 2 <= 15)
    {
        if (board[i - 2][k] == board[i][k])
        {
            t1++;
        }
        if (board[i - 1][k] == board[i][k])
        {
            t1++;
        }

        if (board[i + 2][k] == board[i][k])
        {
            t2++;
        }
        if (board[i + 1][k] == board[i][k])
        {
            t2++;
        }

    }

    if (k - 2 >= 0 && k + 2 <= 11)
    {
        if (board[i][k - 2] == board[i][k])
        {
            t3++;
        }
        if (board[i][k - 1] == board[i][k])
        {
            t3++;
        }

        if (board[i][k + 2] == board[i][k])
        {
            t4++;
        }
        if (board[i][k + 1] == board[i][k])
        {
            t4++;
        }

    }

    if (k - 1 >= 0 && k + 1 <= 11 && i - 1 >= 0 && i + 1 <= 15)
    {
        if (board[i][k - 1] == board[i][k])
        {
            t5++;
        }
        if (board[i][k + 1] == board[i][k])
        {
            t5++;
        }

        if (board[i + 1][k] == board[i][k])
        {
            t6++;
        }
        if (board[i - 1][k] == board[i][k])
        {
            t6++;
        }
    }

    if (t1 === 2 || t2 === 2 || t3 === 2 || t4 === 2 || t5 === 2 || t6 === 2)
    {
        match = "";

        if (t1 === 2)
        {
            match = "left";
        }
        else if (t2 === 2)
        {
            match = "right";
        }
        else if (t3 === 2)
        {
            match = "above";
        }
        else if (t4 === 2)
        {
            match = "below";
        }
        else if (t5 === 2)
        {
            match = "vmid";
        }
        else
        {
            match = "hmid";
        }

        index1 = i;
        index2 = k;

        return 1;
    }
}

function loadImages()
{
    var image0 = new Image();
    image0.src = "images/appleGreen.png";
    var image1 = new Image();
    image1.src = "images/appleRed.png";
    var image2 = new Image();
    image2.src = "images/cherry.png";
    var image3 = new Image();
    image3.src = "images/grape.png";
    var image4 = new Image();
    image4.src = "images/orange.png";
    var image5 = new Image();
    image5.src = "images/strawberry.png";
    var image6 = new Image();
    image6.src = "images/watermelon.png";
    image6.addEventListener('load', setup, false);
}