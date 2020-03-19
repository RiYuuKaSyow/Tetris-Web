/** author : Syow */

/**  Var */
/** ViewBoard */
let board = document.getElementById('tetris') ;
let boardcontext = board.getContext('2d');
let saveboard = document.getElementById('saveMatrix') ;
let savecontext = saveboard.getContext('2d') ;
let nextsboard = document.getElementById('nexts') ;
let nextscontext = nextsboard.getContext('2d') ;
let scale = board.height / 22 ;
let ScoreObj = document.getElementById('Score');
let End = document.getElementById('End');
let property = 'inline' ;
let Block = [] ;
/** Matrix */
const matrixTypes   = [  0   ,'T'    ,'O'    ,  'I'   , 'J'     ,'L'    ,'Z'    ,'S'    ] ;
let matrixcolors    = ['#000','#a0a' ,'#ec0' ,'#0ee'  ,'#00f'  ,'#f50'  ,'#d13'  ,'#0c0'  ] ;
let shadowcolors    = ['#333','#c6c' ,'#ca0' ,'#0cc'  ,'#00c'  ,'#c20'  ,'#c02'  ,'#0a0'  ] ;
let repeat = [0,3,3,3,3,3,3,3] ;
let nextMatrixs = [] ;
/** Playstate*/
const playing = 1 ;
const pause = 2 ;
const end = 0 ;
let droptime = 1000 ;
let lasttime = 0 ;
let playstate = end ;
let save = null ;
let saved = false ;
let cutdown = false ;
let touched = false ;
let lines = 0 ;
let player = {pos:{x:0,y:0},matrix:[[]]} ;


/** main */
main();


/** Functions */

/** main() */
function main(){
    for(let i = 0 ; i < 22; i++){
        Block.push([]) ;
        for(let j = 0 ; j < 10 ; j++){
            Block[i].push(0);
        }
    }

    initMatrixs();

    DrawSaveBackGroud();
    DrawBackground(Block);
    DrawHiddenBar();
    DrawNextBackground();
}

/** Set */
function setScore(id){
    ScoreObj =  document.getElementById(id); ;
}
function setBoard(id){
    board = document.getElementById(id) ;
    boardcontext = board.getContext('2d');
    scale = board.height / 24 ;
}
function setSaveBoard(id){
    saveboard = document.getElementById(id) ;
    savecontext = saveboard.getContext('2d') ;
}
function setNextboard(id){
    nextsboard = document.getElementById(id) ;
    nextscontext = nextsboard.getContext('2d') ;
}
function setEnd(id,prop){
    End = document.getElementById(id);
    property = prop ;
}

/** GameState */
function TetrisStart(){
    if( End !== null ){
        End.style.display = 'none' ;
    }
    document.addEventListener('keydown',KeyboardMethod);
    playstate = playing ;
    lines = 0 ;
    newPlayer(player) ;
    update();
}
function TetrisEnd(){
    playstate = end ;
    window.cancelAnimationFrame(update);
    document.removeEventListener('keydown',KeyboardMethod);
    if( End !== null ){
        End.style.display = property ;
    }
}

/** GameUpdate */
function update(time = 0){
    if( playstate === playing ){
        while( time - lasttime >= droptime ){
            Drop() ;
            lasttime = time ;
        }
        if( lines % 30 === 0 && lines !== 0 && !cutdown ){
            UpSpeed();
            cutdown = true ;
        }
        DrawBackground(Block);
        DrawMatrix(Block,{x:0,y:0}) ;
        DrawMatrix(player.matrix,player.pos) ;
        DrawShadow(player.matrix,player.pos) ;
        DrawHiddenBar();
    
        requestAnimationFrame(update);
    }
}
function Drop(){
    player.pos.y++;
    if( checkCross(Block,player) && !touched ){
        player.pos.y--;
        setTimeout(merge(Block,player) ,droptime*4) ;
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
function initMatrixs(){
    for(let i = 0 ; i < 6; i++){
        nextMatrixs.push( createMatrix( matrixTypes[Math.floor(Math.random()*7) + 1 ] ) );
    }
}
function getMatrix(){
    let matrix = nextMatrixs.shift() ;
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
    }catch{
        TetrisEnd();
    }
    Clear(Block) ;
    for(let x = 0 ; x < 10; x++){
        if( Block[1][x] !==0 || Block[0][x] !== 0 ){
            TetrisEnd();
            return ;
        }   
    }
    newPlayer(player) ;
    saved = false ;
}
function Clear(Block){
    loop :for(let y = Block.length-1; y >= 0 ; y--){
        for(let x = 0 ; x < Block[0].length; x++){
            if(Block[y][x] === 0)
                continue loop ;
        }
        for(let x = y ; x > 0 ; x--){
            Block[x] = Block[x-1] ;
        }
        Block[0] = [0,0,0,0,0,0,0,0,0,0] ;
        y++ ;
        lines++;
    }
    ShowScore(lines);
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
    if(droptime < 100){
        return ;
    }else{
        droptime -= 100 ;
    }
}
function repeatinNull(){
    for(let i = 0 ; i < repeat.length ; i++){
        if(repeat[i] !== 0){
            return false ;
        }
    }
    return true ;
}
function initrepeat(){
    repeat = [0,3,3,3,3,3,3,3] ;
}

/** MatrixControl */
function KeyboardMethod(){
    switch(event.code){
        case 'ArrowLeft'    : ChangeX( -1 ) ;break;
        case 'ArrowRight'   : ChangeX( 1 )  ;break;
        case 'ArrowDown'    : ChangeY( 1 )  ;break;
        case 'Space'        : GoBottom()    ;break;
        case 'ArrowUp'      : Spin(false)   ;break;
        case 'KeyZ'         : Spin(false)   ;break;
        case 'KeyX'         : Spin()        ;break;
        case 'KeyC'         : Save()        ;break;
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
    let offset = 1 ;
    //player.matrix = 
    getSpin(player.matrix,clockwise) ;
    while(checkCross(Block,player)){
        player.pos.x += offset ;
        offset = -( offset + ( offset > 0 ? 1 : -1  ) ) ;
        if(offset > Block[0].length){
            player.pos.x = xpos ;
            //player.matrix = 
            getSpin(player.matrix,!clockwise) ;
            return ;
        }
    }
}
function Save(){
    if( saved === false ){
        if( save === null ){
            save = player.matrix ;
            newPlayer(player) ;
        }else{
            [save , player.matrix] = [player.matrix , save] ;
            player.pos = { x : (board.width/scale)/2-1 , y : 0} ;
        }
    }
    saved = true ;
    DrawSave(save);
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
    DrawSaveMatrix(matrix);
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
function DrawNext(nextMatrixs){
    DrawNextBackground();
    DrawNextMatrixs(nextMatrixs);
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

/** Score */
function ShowScore(lines){
    if( ScoreObj !== undefined ){
        ScoreObj.innerText = '行數:' + lines ;
    }
}

/** Others */
function BottomPos(){
    let bottomy = player.pos.y ;
    while( !checkCross(Block,{pos:{x:player.pos.x,y:bottomy},matrix:player.matrix}) ){
        bottomy++ ;
    }
    return bottomy-1 ;
}