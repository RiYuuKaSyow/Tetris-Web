/** author : Syow */

/**  Var */
/** ViewBoard */
let board ;
let boardcontext ;
let scale ;
let saveboard  ;
let savecontext ;
let nextsboard  ;
let nextscontext ;
let End ;
let Pause ;
let property ;
let Block = [] ;
let player = {pos:{x:0,y:0},matrix:[[]]} ;
/** Matrix */
const matrixTypes   = [  0   ,'T'    ,'O'    ,  'I'   , 'J'     ,'L'    ,'Z'    ,'S',   'Trash'] ;
let matrixcolors    = ['#000','#a0a' ,'#ec0' ,'#0ee'  ,'#00f'  ,'#f50'  ,'#d13'  ,'#0c0','#aaa'  ] ;
let shadowcolors    = ['#333','#c6c' ,'#ca0' ,'#0cc'  ,'#00d'  ,'#c20'  ,'#c02'  ,'#0a0','#fff'  ] ;
var imgs = [] ;
let repeat = [0,1,1,1,1,1,1,1] ;
let basictrash = [8,8,8,8,8,8,8,8,8,8] ;
let nextMatrixs = [] ;
/** Gamestate*/
const playing = 1 ;
const pause = 2 ;
const end = 0 ;
let droptime = 1000 ;
let lastupdatetime = 0 ;
let playstate = end ;
let cutdown = false ;
let forty = false ;
let cleanTrash = false ;
let createtrash ;
let suisei = false ;
/** Key */
let ArrowLeft = 'ArrowLeft' ;
let ArrowRight = 'ArrowRight' ;
let ArrowDown = 'ArrowDown' ;
let Space = 'Space' ;
let ArrowUp = 'ArrowUp' ;
let KeyZ = 'KeyZ' ;
let KeyX = 'KeyX' ;
let KeyC = 'KeyC' ;
let KeyP = 'KeyP' ;
let Escape = 'Escape' ;
/** PlayerState */
let save = null ;
let saved = false ;
let touched = 0 ;
let lines = 0 ;
let Time = 0 ;
let T = false ;
let spin = false ;
/** Score */
let ScoreObj = [];
let TimeObj = [] ;
let timeID ;
let lastTime ;


/** Functions */

/** Set */
function setScore(id){
    ScoreObj.push(document.getElementById(id) ) ;
}
function setScores(idList){
    for(let i = 0 ; i < idList.length ; i++){
        ScoreObj.push( document.getElementById( idList[i] ) ) ;
    }
}
function setBoard(id){
    board = document.getElementById(id) ;
    boardcontext = board.getContext('2d');
    scale = board.height / 22 ;
}
function setSaveBoard(id){
    saveboard = document.getElementById(id) ;
    savecontext = saveboard.getContext('2d') ;
}
function setNextBoard(id){
    nextsboard = document.getElementById(id) ;
    nextscontext = nextsboard.getContext('2d') ;
}
function setEnd(id,prop){
    End = document.getElementById(id);
    property = prop ;
}
function setTime(id){
    TimeObj.push( document.getElementById(id) ) ;
}
function setSaveKey(keycode){
    keyC = keycode ;
}
function setDropKey(keycode){
    Space = keycode ;
}
function setKeyZ(keycode){
    KeyZ = keycode ;
}
function setKeyX(keycode){
    KeyX = keycode ;
}
function setArrowUp(keycode){
    ArrowUp = keycode ;
}
function setSuiSei(){
    img1 = new Image(); img2 = new Image(); img3 = new Image(); img4 = new Image();
    img1.src = './suisei/IMG_20200510_153757.jpg' ;
    img2.src = './suisei/IMG_20200510_153800.jpg' ;
    img3.src = './suisei/IMG_20200510_153805.jpg' ;
    img4.src = './suisei/IMG_20200510_153802.jpg' ;
    imgs    = ['#000', img1 ,img2 ,img3  ,img4  ,img1 ,img2 ,img3  ,img4  ] ;
    suisei = true ;
}
function setPause(id){
    Pause = document.getElementById(id) ;
}

/** GameState */
function Start(type){
    switch(type){
        case 'clean40' : forty = true ; break;
        case 'cleanTrash' : cleanTrash = true ;  break;
        default : break ;
    }
    TetrisStart();
}
function TetrisStart(){
    if( End !== null ){
        End.style.display = 'none' ;
    }
    document.addEventListener('keydown',KeyboardMethod);
    playstate = playing ;
    
    initBlock();
    initrepeat();
    initMatrixs();
    initSave();
    initPlayState()

    if(cleanTrash !== false){
        initTrash();
        createtrash = setTimeout(createTrash,droptime*15) ;
    }

    newPlayer(player) ;

    DrawSaveBackGroud();
    DrawBackground();
    DrawHiddenBar();
    DrawNextBackground();
    DrawNext(nextMatrixs) ;
    lastTime = Date.now() ;
    timeID = setTimeout(ShowTime,1) ;
    update(0);
}
function TetrisEnd(){
    playstate = end ;
    window.cancelAnimationFrame(update);
    window.clearTimeout(timeID) ;
    document.removeEventListener('keydown',KeyboardMethod);
    forty = false ;
    if( cleanTrash === true ){
        clearTimeout(createtrash) ;
    }
    cleanTrash = false ;
    if( End !== null ){
        End.style.display = property ;
    }
}
function TetrisPause(){

    if( playstate === playing ){
        playstate = pause ;
        
        window.cancelAnimationFrame(update);
        window.clearTimeout(timeID) ;
        document.removeEventListener('keydown',KeyboardMethod);
        document.addEventListener('keydown',KeyboardPauseSet);
        if( cleanTrash === true ){
            clearTimeout(createtrash) ;
        }

        showPause();

    }else if(playstate === pause){
        TetrisReStart() ;
    }
    
}
function TetrisReStart(){
    
    if( playstate === pause ){
        playstate = playing ;
        hidePause();

        document.removeEventListener('keydown',KeyboardPauseSet);
        document.addEventListener('keydown',KeyboardMethod);
        lastTime = Date.now();
        timeID = setTimeout(ShowTime,1) ;
        update(0);
        if(cleanTrash !== false){
            createtrash = setTimeout(createTrash,droptime*15) ;
        }
    }
}

function showPause(){
    if( Pause !== undefined ){
        Pause.style.display = 'flex' ;
    }
}
function hidePause(){
    if( Pause !== undefined ){
        Pause.style.display = 'none' ;
    }
}

/** Init */
function initMatrixs(){
    nextMatrixs = [];
    for(let i = 0 ; i < 6; i++){
        let type = 0 ;
        do{
            type = Math.floor(Math.random()*7) + 1 ;
        }while( !( repeat[type] > 0 ) ) ;
        repeat[type]--;
        nextMatrixs.push( createMatrix( matrixTypes[ type ] ) ) ;
    }
}
function initrepeat(){
    repeat = [0,1,1,1,1,1,1,1] ;
}
function initBlock(){
    Block = [] ;
    for(let i = 0 ; i < 22; i++){
        Block.push([]) ;
        for(let j = 0 ; j < 10 ; j++){
            Block[i].push(0);
        }
    }
}
function initSave(){
    saved = false ;
    save = null;
}
function initTrash(){
    basictrash = [8,8,8,8,8,8,8,8,8,8] ;
    for( let y = 21 ; y > 21-8 ; y-- ){
        basictrash[ Math.floor( Math.random()*10 ) ] = 0 ;
        Block[y] = basictrash ;
        basictrash = [8,8,8,8,8,8,8,8,8,8] ;
    }
}
function initPlayState(){
    droptime = 1000 ;
    droplasttime = 0 ;
    lastupdatetime = 0 ;
    save = null ;
    saved = false ;
    touched = 0 ;
    lines = 0 ;
    Time = 0 ;
    T = false ;
}

/** GameUpdate */
function update(time = 0){

    if( playstate === playing ){
        if( time - droplasttime >= droptime ){
            Drop() ;
            droplasttime = time ;
        }
        if( lines % 30 === 0 && lines !== 0 && !cutdown ){
            UpSpeed();
            cutdown = true ;
        }

        ShowScore(lines);
        DrawBackground(Block); 
        
        if( suisei !== true ){
            DrawMatrix(Block,{x:0,y:0}) ;
            DrawMatrix(player.matrix,player.pos) ;
        }else{
            DrawSuiseiMatrix(Block,{x:0,y:0}) ;
            DrawSuiseiMatrix(player.matrix,player.pos) ; 
        }
        
        DrawShadow(player.matrix,player.pos) ;
        DrawHiddenBar();


        if( forty === true && lines >= 40 ){
            TetrisEnd();
        }

        requestAnimationFrame(update);
    }
}
function Drop(){
    player.pos.y++;
    if( checkCross(Block,player) && touched > 1 ){
        player.pos.y--;
        //setTimeout(merge(Block,player) ,droptime) ;
        merge(Block,player)
    }else if(checkCross(Block,player)){
        spin = false ;
        touched++;
        player.pos.y--;
    }else{
        spin = false ;
    }
}
function createMatrix(type){
    let matrix ;
    switch(type){
        case 'T' : matrix = [   [0, 1, 0],
                                [1, 1, 1],
                                [0, 0, 0]   ] ; break;
        case 'O' : matrix = [   [2, 2],
                                [2, 2]  ] ; break ;
        case 'I' : matrix = [   [0, 0, 0, 0],
                                [3, 3, 3, 3],
                                [0, 0, 0, 0],
                                [0, 0, 0, 0]    ] ; break ;
        case 'J' : matrix = [   [0, 0, 0],
                                [4, 0, 0],
                                [4, 4, 4]   ] ; break ;
        case 'L' : matrix = [   [0, 0, 0],
                                [0, 0, 5],
                                [5, 5, 5]   ] ; break ;
        case 'Z' : matrix = [   [0, 0, 0],
                                [6, 6, 0],
                                [0, 6, 6]   ] ; break ;
        case 'S' : matrix = [   [0, 0, 0],
                                [0, 7, 7],
                                [7, 7, 0]   ] ; break ;
    }
    return matrix ;
}
function getMatrix(){
    let matrix = nextMatrixs.shift() ;
    T = isT(matrix) ;
    if(repeatinNull()){
        initrepeat();
    }
    let type = 0 ;
    do{
        type = Math.floor(Math.random()*7) + 1 ;
    }while( !( repeat[type] > 0 ) ) ;
    repeat[type]--;
    nextMatrixs.push( createMatrix( matrixTypes[ type ] ) ) ;
    DrawNext(nextMatrixs) ;
    return matrix ;
}
function newPlayer(player){
    player.pos = { x : (board.width/scale)/2-1 , y : 0},
    player.matrix = getMatrix() ;
}
function merge(Block,player){
    try{
        player.matrix.forEach((row,y)=>{
            row.forEach((col,x)=>{
                if( player.matrix[y][x] !== 0 ){
                    Block[y+player.pos.y][x+player.pos.x] = player.matrix[y][x] ;
                }
            })
        })
    }catch(e){
        TetrisEnd();
    }
    Clear(Block) ;
    for(let x = 0 ; x < 10; x++){
        if( Block[1][x] !==0 || Block[0][x] !== 0 ){
            TetrisEnd();
            return ;
        }   
    }
    if( T === true && spin === true ){
        console.log("T-spin");
    }
    newPlayer(player) ;
    saved = false ;
    touched = 0 ;
}
function Clear(Block){
    for(let y = Block.length-1; y >= 0 ; y--){
        if( checkClear(Block[y]) === false ){
            continue ;
        }
        for(let x = y ; x > 0 ; x--){
            Block[x] = Block[x-1] ;
        }
        Block[0] = [0,0,0,0,0,0,0,0,0,0] ;
        y++ ;
        lines++;
        cutdown = false ;
    }
}
function checkClear(Line){
    for(let x = 0 ; x < Line.length; x++){
        if(Line[x] === 0)
            return false ;
    }
    return true ;
}
function checkCross(Block,player){
    for(let y = 0 ; y < player.matrix.length ; y++){
        for(let x = 0 ; x < player.matrix[y].length ; x++){
            if( player.matrix[y][x] !== 0 &&
                (Block[ y+player.pos.y ] &&
                 Block[ y+player.pos.y][ x+player.pos.x]) !==0 ){
                    return true ;
                 }
        }
    }
    return false ;
}
function UpSpeed(){
    if(droptime <= 100){
        return ;
    }else{
        droptime -= 100 ;
    }
}
function repeatinNull(){
    for(let i = 1 ; i < repeat.length ; i++){
        if(repeat[i] !== 0){
            return false ;
        }
    }
    return true ;
}
function createTrash(){
    basictrash = [8,8,8,8,8,8,8,8,8,8] ;
    basictrash[ Math.floor( Math.random()*10 ) ] = 0 ;
    Block.shift();
    Block.push( basictrash ) ;
    createtrash = setTimeout(createTrash,droptime*15);
}

/** MatrixControl */
function KeyboardMethod(){
    //console.log(event.code) ;
    switch(event.code){
        case  ArrowLeft    : ChangeX( -1 ) ;break;
        case  ArrowRight   : ChangeX( 1 )  ;break;
        case  ArrowDown    : ChangeY( 1 )  ;break;
        case  Space        : GoBottom()    ;break;
        case  ArrowUp      : Spin()        ;break;
        case  KeyZ         : Spin(false)   ;break;
        case  KeyX         : Spin()        ;break;
        case  KeyC         : Save()        ;break;
        case  KeyP         : TetrisPause() ;break;
        case  Escape       : TetrisPause() ;break;
    }
}
function ChangeX(x){
    player.pos.x += x ;
    if(checkCross(Block,player)){
        player.pos.x -= x ;
    }
}
function ChangeY(y){
    player.pos.y += y ;
    if(checkCross(Block,player)){
        player.pos.y -= y ;
    }
}
function GoBottom(){
    player.pos.y = BottomPos() ;
    merge(Block,player);
}
function getSpin(matrix,clockwise = true){
   for(let y = 0 ; y < matrix.length; y++){
       for(let x = 0 ; x < y; x++){
          [ matrix[y][x] , matrix[x][y] ] = [ matrix[x][y]  , matrix[y][x] ] 
       }
   }
    if(clockwise){
        matrix.forEach((row,y)=>{
            matrix[y].reverse();
        })
    }else{
        matrix.reverse();
    }
}
function Spin(clockwise = true){
    const xpos = player.pos.x ;
    const ypos = player.pos.y ;
    let offset = 1 , ychange = false ;
    getSpin(player.matrix,clockwise) ;
    while(checkCross(Block,player)){
        player.pos.x += offset ;
        offset = -( offset + ( offset > 0 ? 1 : -1  ) ) ;
        if(offset > Block[0].length){
            if( player.pos.y < 22 ){
                player.pos.x = xpos ;
                offset = 1;
                player.pos.y++ ;
                ychange = true ;
            }else{
                player.pos.x = xpos ;
                player.pos.y = ypos ;
                getSpin(player.matrix,!clockwise) ;
                return ;
            }  
        }
    }
    if(ychange === true){
        spin = true ;
    }
}
function Save(){
    let matrix = createMatrix( getPlayerMatrixType() ) ;
    if( saved === false ){
        if( save === null ){
            save = matrix ;
            newPlayer(player) ;
        }else{
            player.matrix = save ;
            save = matrix ;
            player.pos = { x : (board.width/scale)/2-1 , y : 0} ;
            T = isT(player.matrix) ;
        }
    }
    saved = true ;
    DrawSave(save);
}
function KeyboardPauseSet(){
    switch(event.code){
        case  KeyP         : TetrisReStart() ;break;
        case  Escape       : TetrisReStart() ;break;
    }
}

/** DrawView */
function DrawBackground(){
    for(let y = 0 ; y < 22 ; y++ ){
        for(let x = 0 ; x < 10 ; x++){
            boardcontext.fillStyle = matrixcolors[0] ;
            boardcontext.fillRect(x*scale,y*scale,1*scale,1*scale);
            boardcontext.strokeStyle = shadowcolors[0] ;
            boardcontext.strokeRect(x*scale,y*scale,1*scale,1*scale);
        }
    }
    boardcontext.strokeStyle = "#eee" ;
    boardcontext.strokeRect(0,0,board.width,board.height);
}
function DrawHiddenBar(){
    boardcontext.fillStyle = '#fff' ;
    boardcontext.fillRect(0,0,10*scale,2*scale);
}
function DrawMatrix(matrix,pos){
    matrix.forEach((row,y) => {
        row.forEach((col,x) => {
            if(matrix[y][x] !== 0){
                boardcontext.fillStyle = matrixcolors[matrix[y][x]] ;
                boardcontext.fillRect((pos.x+x)*scale,(pos.y+y)*scale,1*scale,1*scale);
                boardcontext.strokeStyle = "#fff" ;
                boardcontext.strokeRect((pos.x+x)*scale,(pos.y+y)*scale,1*scale,1*scale);
            }
        });
    });
}
function DrawSuiseiMatrix(matrix,pos){

    matrix.forEach((row,y) => {
        row.forEach((col,x) => {
            if(matrix[y][x] !== 0){
                boardcontext.drawImage(imgs[matrix[y][x]],(pos.x+x)*scale,(pos.y+y)*scale,scale,scale) ;        
                boardcontext.strokeStyle = matrixcolors[matrix[y][x]] ;
                boardcontext.strokeRect((pos.x+x)*scale,(pos.y+y)*scale,1*scale,1*scale);
            }
        });
    });

}
function DrawShadow(matrix,pos){
    let bottomy = BottomPos() ;
    matrix.forEach((row,y) => {
        row.forEach((col,x) => {
            if(matrix[y][x] !== 0){
                boardcontext.strokeStyle = shadowcolors[matrix[y][x]] ;
                boardcontext.strokeRect((pos.x+x)*scale,(bottomy+y)*scale,1*scale,1*scale);
            }
        });
    });
}
function DrawSave(matrix){
    DrawSaveBackGroud();
    if(suisei !== true){
        DrawSaveMatrix(matrix);
    }else{
        DrawSaveSuiseiMatrix(matrix);
    }
    
}
function DrawSaveBackGroud(){
    for(let y = 0 ; y < 4 ; y++){
        for(let x = 0 ; x < 4 ; x++){
            savecontext.fillStyle = matrixcolors[0] ;
            savecontext.fillRect(x*scale,y*scale,1*scale,1*scale);
            savecontext.strokeStyle = shadowcolors[0] ;
            savecontext.strokeRect(x*scale,y*scale,1*scale,1*scale);
        }
    }
    savecontext.strokeStyle = "#eee" ;
    savecontext.strokeRect(0,0,saveboard.width,saveboard.height); 
}
function DrawSaveMatrix(matrix){
    let startpos = 2 - Math.floor(matrix.length/2) ;
    matrix.forEach((row,y)=>{
        row.forEach((col,x)=>{
            if( matrix[y][x] !== 0 ){
                savecontext.fillStyle = matrixcolors[matrix[y][x]] ;
                savecontext.fillRect((x+startpos)*scale,(y+startpos)*scale,1*scale,1*scale);
                savecontext.strokeStyle = "#fff" ;
                savecontext.strokeRect((x+startpos)*scale,(y+startpos)*scale,1*scale,1*scale);
            }
        })
    });
}
function DrawSaveSuiseiMatrix(matrix){
    let startpos = 2 - Math.floor(matrix.length/2) ;
    matrix.forEach((row,y)=>{
        row.forEach((col,x)=>{
            if( matrix[y][x] !== 0 ){
                savecontext.drawImage(imgs[matrix[y][x]],(x+startpos)*scale,(y+startpos)*scale,1*scale,1*scale) ; 
                savecontext.strokeStyle = matrixcolors[matrix[y][x]] ; ;
                savecontext.strokeRect((x+startpos)*scale,(y+startpos)*scale,1*scale,1*scale);
            }
        })
    });
}
function DrawNext(nextMatrixs){
    DrawNextBackground();
    if( suisei !== true ){
        DrawNextMatrixs(nextMatrixs);
    }else{
        DrawNextSuiseiMatrixs(nextMatrixs);
    }
    
}
function DrawNextBackground(){
    for(let i = 0 ; i < 6 ; i++){
        for(let y = 0 ; y < 4 ; y++){
            for(let x = 0 ; x < 4 ; x++){
                nextscontext.fillStyle = matrixcolors[0] ;
                nextscontext.fillRect(x*2*scale/3,nextsboard.height/6*i+y*2*scale/3,2*scale/3,2*scale/3);
                nextscontext.strokeStyle = shadowcolors[0] ;
                nextscontext.strokeRect(x*2*scale/3,nextsboard.height/6*i+y*2*scale/3,2*scale/3,2*scale/3);
            }
        }
        nextscontext.strokeStyle = "#fff" ;
        nextscontext.strokeRect(0,nextsboard.height/6*i,nextsboard.width,nextsboard.height/6);
    }
}
function DrawNextMatrixs(nextMatrixs){
    nextMatrixs.forEach((matrix,i) =>{
        let startpos = 2 - Math.floor(matrix.length/2) ;
        matrix.forEach((row,y) =>{
            row.forEach((col,x)=>{
                if( matrix[y][x] !== 0 ){
                    nextscontext.fillStyle = matrixcolors[matrix[y][x]] ;
                    nextscontext.fillRect((x+startpos)*2*scale/3,(y+startpos)*2*scale/3+nextsboard.height/6*i,2*scale/3,2*scale/3);
                    nextscontext.strokeStyle = "#fff" ;
                    nextscontext.strokeRect((x+startpos)*2*scale/3,(y+startpos)*2*scale/3+nextsboard.height/6*i,2*scale/3,2*scale/3);
                }
            })
        })
    })
}
function DrawNextSuiseiMatrixs(nextMatrixs){
    nextMatrixs.forEach((matrix,i) =>{
        let startpos = 2 - Math.floor(matrix.length/2) ;
        matrix.forEach((row,y) =>{
            row.forEach((col,x)=>{
                if( matrix[y][x] !== 0 ){
                    nextscontext.drawImage(imgs[matrix[y][x]],(x+startpos)*2*scale/3,(y+startpos)*2*scale/3+nextsboard.height/6*i,2*scale/3,2*scale/3) ; 
                    nextscontext.strokeStyle = matrixcolors[matrix[y][x]] ; ;
                    nextscontext.strokeRect((x+startpos)*2*scale/3,(y+startpos)*2*scale/3+nextsboard.height/6*i,2*scale/3,2*scale/3);
                }
            })
        })
    })
}

/** Score */
function ShowScore(lines){
    if( ScoreObj !== [] ){
        for(let i = 0 ; i < ScoreObj.length ; i++ ){
            ScoreObj[i].innerText =  lines  ;
        }
    }
}
function ShowTime(){
    let nowtime = Date.now();
    Time += nowtime - lastTime ;
    lastTime = Date.now();
    if( TimeObj !== [] ){
        for(let i = 0 ; i < TimeObj.length ; i++ ){
            TimeObj[i].innerText = Math.floor( (Time/1000)/60 ) + '分' + Math.floor( (Time/1000)%60 ) +'秒' + (Array(3).join('0')+Time%1000).slice(-3) ;
        }
    }
    timeID = setTimeout(ShowTime,1) ;
}

/** Others */
function BottomPos(){
    let bottomy = player.pos.y ;
    while( !checkCross(Block,{pos:{x:player.pos.x,y:bottomy},matrix:player.matrix}) ){
        bottomy++ ;
    }
    return bottomy-1 ;
}
function isT(matrix){
    for(let y = 0 ; y < 3 ; y++){
        for(let x = 0 ; x < 3 ; x++){
            if(matrix[y][x] === 1) return true;
            else if(matrix[y][x] !== 0) return false ;
        }
    }
}
function getPlayerMatrixType(){
    for(let i = 0 ; i < player.matrix.length ; i++){
        for(let j = 0 ; j < player.matrix[0].length ; j++){
            if( player.matrix[i][j] !== 0 )
                return matrixTypes[ player.matrix[i][j] ] ;
        }
    }
}