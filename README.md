# CookieTimer.js
Time cookies in your browser with cookies

## About
CookieTimer.js adds resilient timers across your whole website. It stores all of it's data in browser cookies so there is no need for a server component. CookieTimers are persistent across page reloads, arbitrary navigation, and even browser restarts.

CookieTimer.js was designed to be added to recipe websites to aid users in timing their baking. 

## Usage
Link the javascript and css resources into your web pages

    <link href="css/cookietimer.css" rel="stylesheet">
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
    <script src="js/jquery.cookies.2.2.0.js"></script>
    <script src="js/cookietimer.js"></script>
Add a container element to your web pages with `id='timerContainer'` to hold the timers. For best results the timer container should be sturdy looking and give a visual hint that timers are persistent and available across all pages of your website.

Add buttons or links to your website that call the CookieTimer start function.

    CookieTimer.start('uniqueID', 'Label String', number_of_seconds);
Pass in an empty string for the unique ID parameter and your link will create a new timer every time it is clicked.

Copyright 2014 James Cox
