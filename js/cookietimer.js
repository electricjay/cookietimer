"use strict";
// Copyright 2014 James Cox (j@rastered.com)

function CookieTimer(id, name, duration, startTime)
{
    if (id == '')
        id = new Date().getTime().toString();
    if (document.getElementById(id)) // Do not create duplicate timers.
    {
        return null;
    }
    this.id = id.replace(/,/g, "_");
    this.name = name;
    this.duration = duration;
    this.date = new Date();
    this.cancled = false;
    this.finished = false;
    if (arguments.length <  4)
        this.startTime = new Date();
    else
    {
        this.startTime = startTime;
        if ((new Date()) > startTime + duration*1000)
            return null;
    }
    this.addToDocument();
    this.saveCookie();
    this.tick();
    return this;
}

CookieTimer.padNumber = function(num, size){
    var s = String(num);
    while (s.length < size) s = "0" + s;
    return s;
};

CookieTimer.milliseconds_to_time = function(ms)
{
    return CookieTimer.padNumber(Math.floor(ms/60000), 2) + ":" + CookieTimer.padNumber(Math.floor((ms % 60000)/1000), 2);
}

CookieTimer.deleteCookie = function(name)
{
    document.cookie = name + '=;domain=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

CookieTimer.prototype.reset = function()
{
    this.startTime = new Date();
    this.duration = 0;
    $("#" + this.id).removeClass("timerFlash");
    $("#" + this.id + " .cancel").html("cancel");
    this.finished = false;
}

CookieTimer.prototype.changeDuration = function(newDuration)
{
    if ((new Date()) - this.startTime > newDuration * 1000)
        return;
    this.duration = newDuration;
    this.draw();
    this.saveCookie();
}


CookieTimer.prototype.incrementDuration = function(event)
{
    if (this.finished)
        this.reset();
    if (this.timeLeft() < 60000) // Add only 30 seconds if there is less than 1 minute left
        this.changeDuration(this.duration + 30);
    else
        this.changeDuration(this.duration + 60);
    event.stopPropagation();
    event.preventDefault();
    return false;
}

CookieTimer.prototype.decrementDuration = function(event)
{
    if (this.timeLeft() < 60000) // Subtract only 30 seconds if there is less than 1 minute left
        this.changeDuration(this.duration - 30);
    else
        this.changeDuration(this.duration - 60);
    event.stopPropagation();
    event.preventDefault();
    return false;
}

CookieTimer.prototype.cancel = function(event)
{
    this.cancled = true;
    CookieTimer.deleteCookie('cookieTimer.' + this.id);
    $("#" + this.id).remove();
    if (event)
    {
        event.stopPropagation();
        event.preventDefault();
    }
    return false;
}

CookieTimer.prototype.saveCookie = function()
{
    var cookiename = 'cookieTimer.' + this.id;
    var cookiedate = 
        $.cookies.set(cookiename, [this.name, this.duration, this.startTime].join(','),
                      { expiresAt: new Date(this.startTime.getTime() + (this.duration+30)*1000) });
}

CookieTimer.prototype.addToDocument = function()
{
    $("#timerContainer").append("<div id='" + this.id + "' class='cookieTimer'>" + 
                                "<span class='name'>" + this.name + "</span><br />" + 
                                "<div class='display-group'>" + 
                                "<a href='#' class='plus'>+</a>" + 
                                "<span class='time'>00:00</span>" +
                                "<a href='#' class='minus'>-</a>" +
                                "</div><br>" + 
                                "<button type='button' class='cancel'>cancel</button></div>");
    var obj = this;
    $("#" + this.id + " .cancel").click(function (e){obj.cancel(e);});
    $("#" + this.id + " .plus").click(function (e){obj.incrementDuration(e);});
    $("#" + this.id + " .minus").click(function (e){obj.decrementDuration(e);});
}

CookieTimer.prototype.timeLeft = function()
{
    return(this.duration*1000 - ((new Date()) - this.startTime));
}

CookieTimer.prototype.draw = function()
{
    var millisecondsLeft = this.timeLeft();
    if (millisecondsLeft > 0)
    {
        $("#" + this.id + " .time").html(CookieTimer.milliseconds_to_time(millisecondsLeft));
    }
    else
    {
        $("#" + this.id + " .time").html("Done!");
        $("#" + this.id).toggleClass("timerFlash");
    }
}

CookieTimer.prototype.tick = function()
{
    if (this.cancled)
        return;
    if (!jaaulde.utils.cookies.get('cookieTimer.' + this.id))
    { // timer has been canceled from another tab
        this.cancel();
        return;
    }
    var millisecondsLeft = this.timeLeft();
    var o = this;
    this.draw(millisecondsLeft);
    if (millisecondsLeft > 0)
    {
        setTimeout(function(){o.tick()}, 5 + ((millisecondsLeft % 1000) || 1000));
    }
    else
    {
        if (!this.finished)
        {
            $("#" + this.id + " .cancel").html("Ok");
            this.finished = true;
        }
        if ($("#cookieTimerAudio")[0])
            $("#cookieTimerAudio")[0].play();
        setTimeout(function() { o.tick() }, 500);
    }
}

CookieTimer.start = function (id, name, duration)
{
    new CookieTimer(id, name, duration);
    return false;
}

$(function (){
    var cookie;
    var timerCookies = {};
    timerCookies = jaaulde.utils.cookies.filter( /^cookieTimer/ );
    var timerOpts = {};
    for (var timer in timerCookies)
    {
        var id = timer.substr(12);
        var opts = timerCookies[timer].split(",");
        new CookieTimer(id, opts[0], parseInt(opts[1]), new Date(opts[2]));
    }

    $("body").append('<audio id="cookieTimerAudio" preload="auto">' +
                     '  <source src="/sounds/alert.mp3" type="audio/mpeg">' +
                     '</audio>');
    // This forces the onload function to be called again if we get back to this page via the back button.
    $(window).unload(function(){});
});
