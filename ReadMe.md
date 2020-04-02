 ## <script src="https://syow.000webhostapp.com/Tetris/tetris.js"></script> ##
---------------------------------------------------------------------------

## you can see index.html to learn how to use this js create a tetris game ##
--------------------------------------------------------------------------
# you need 3 canvas than use #
-----------------------------
setBoard( your_tetris_canvas_id );
setSaveBoard( your_save_canvas_id );
setNextBoard( your_next_canvas_id );

# start game #
----------------
Start( mode )

mode -
'basic'     -   the basic tetris <br>
'clean40'   -   challenge to quickly eliminate 40 lines<br>
'cleanTrash'-   this will create line with one space<br>

# set end view use #
---------------------------------------------------------------
setEnd( your_endview_id , your_endview_css_display_property );


# if you need score #
--------------------
setScore( your_score_id );

# if you need time #
-----------------
setTime( your_time_id );

# if you want to change key #
----------------------------
setSaveKey( keycode )   //original KeyC

setDropKey( keycode )   // original Space

setKeyZ( keycode )     // original KeyZ

setKeyX( keycode )     // original KeyX

setArrowUp( keycode )  // original ArrowUp

have no idea how to get keycode? try this
<a>https://syowweblog.webnode.tw/l/%e5%81%b5%e6%b8%ac%e9%8d%b5%e7%9b%a4/<a>