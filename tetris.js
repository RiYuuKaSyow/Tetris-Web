const board = document.getElementById('tetris') ;
const boardcontext = board.getContext('2d');
const saveboard = document.getElementById('saveMatrix') ;
const savecontext = saveboard.getContext('2d') ;
const nextsboard = document.getElementById('nexts') ;
const nextscontext = nextsboard.getContext('2d') ;
const scale = 33 ;
const playing = 1 ;
const pause = 2 ;
const end = 0 ;
const matrixcolors = ['#ccc','#a0a' ,'#ec0' ,'#0ee'  ,'#00f'  ,'#f50'  ,'#d13'  ,'#080'  ] ;
const shadowcolors = ['#ccc','#c6c' ,'#ca0' ,'#0cc'  ,'#00c'  ,'#c20'  ,'#c02'  ,'#040'  ] ;
const matrixTypes  = [  0   ,'T'    ,'O'    ,'I'    ,'J'    ,'L'    ,'Z'    ,'S'    ] ;
let droptime = 1000 ;
let lasttime = 0 ;
let playstate = end ;
let save = null ;
let saved = false ;
let nextMatrixs = [] ;
let player = {pos:{x:0,y:0},matrix:[[]]} ;
let lines = 0 ;
let ScoreObj = 'Score'

let Block = [] ;
for(let i = 0 ; i < 20; i++){
    Block.push([]) ;
    for(let j = 0 ; j < 10 ; j++){
        Block[i].push(0);
    }
}
initMatrixs();
/*
let player = {
    pos : { x : (board.width/scale)/2-1 , y : 0} ,
    matrix : getMatrix()
};
*/

DrawSaveBackGroud();
DrawBackground();
DrawNextBackground();

/*
function initBlock(){
    for(let i = 0 ; i < 20; i++){
        for(let j = 0 ; j < 10 ; j++){
            Block[i][j] = 0 ;
        }
    }
}*/
//TetrisStart();

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
    nextMatrixs.push( createMatrix( matrixTypes[Math.floor(Math.random()*7) + 1 ] ) ) ;
    DrawNext(nextMatrixs) ;
    return matrix ;
}
function newPlayer(player){
    player.pos = { x : (board.width/scale)/2-1 , y : 0},
    player.matrix = getMatrix() ;
}

function DrawBackground(){

    boardcontext.fillStyle = "#ccc" ;
    boardcontext.fillRect(0,0,board.width ,board.height) ;
    boardcontext.lineWidth = "2" ;
    boardcontext.strokeStyle = "#000" ;
    boardcontext.strokeRect(0,0,board.width ,board.height) ; 
    //boardcontext.scale(30,30);
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
function BottomPos(){
    let bottomy = player.pos.y ;
    while( !checkCross(Block,{pos:{x:player.pos.x,y:bottomy},matrix:player.matrix}) ){
        bottomy++ ;
    }
    return bottomy-1 ;
}

function Drop(){
    player.pos.y++;
    if( checkCross(Block,player) ){
        player.pos.y--;
        setTimeout(merge(Block,player) ,droptime) ;
    }
    //setTimeout(Drop,droptime);
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
function ShowScore(lines){
    let s = document.getElementById(ScoreObj);
    if( s !== undefined ){
        s.innerText = '行數:' + lines ;
    }
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

function update(time = 0){
    if( playstate === playing ){
        while( time - lasttime >= droptime ){
            Drop() ;
            lasttime = time ;
        }
    
        DrawBackground();
        DrawMatrix(Block,{x:0,y:0}) ;
        DrawMatrix(player.matrix,player.pos) ;
        DrawShadow(player.matrix,player.pos) ;
    
        requestAnimationFrame(update);
    }
}

function KeyboardMethod(){
    switch(event.code){
        case 'ArrowLeft'    : ChangeX( -1 ) ;  break;
        case 'ArrowRight'   : ChangeX( 1 ) ; break;
        case 'ArrowDown'    : ChangeY( 1 );  break;
        case 'Space'        : GoBottom() ; break;
        case 'KeyZ'         : Spin();     break;
        case 'KeyX'         : Spin(false);     break;
        case 'KeyC'         : Save();     break;
    }
}

function TetrisStart(){

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
    alert('END');
}

function setScore(id){
    ScoreObj =  id ;
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
    let len = matrix.length ;
    let temp = [] ;
    for(let y = len -1 ; y >= 0; y--){
        temp.push([]) ;
        for(let x = 0 ; x < len ; x++){
            if(clockwise){  
                temp[len-1-y].push(matrix[x][y]);
            }else{
                temp[len-1-y].push(matrix[len-1-x][len-1-y]);
            }   
        }
    }
    return temp ;
}
function Spin(clockwise = true){
    const pos = player.pos.x ;
    let offset = 1 ;
    player.matrix = getSpin(player.matrix,clockwise) ;
    while(checkCross(Block,player)){
        player.pos.x += offset ;
        offset = -( offset + ( offset > 0 ? 1 : -1  ) ) ;
        if(offset > Block[0].length){
            player.matrix = getSpin(player.matrix,!clockwise) ;
            player.pos.x = pos ;
            return ;
        }
    }
}
function DrawSave(matrix){
    DrawSaveBackGroud();
    DrawSaveMatrix(matrix);
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
function DrawSaveBackGroud(){
    savecontext.fillStyle = '#ccc' ;
    savecontext.fillRect(0,0,saveboard.width,saveboard.height);
    savecontext.strokeStyle = "#000" ;
    savecontext.strokeRect(0,0,saveboard.width,saveboard.height);
}
function DrawSaveMatrix(matrix){
    matrix.forEach((row,y)=>{
        row.forEach((col,x)=>{
            if( matrix[y][x] !== 0 ){
                savecontext.fillStyle = matrixcolors[matrix[y][x]] ;
                savecontext.fillRect(x*scale,y*scale,1*scale,1*scale);
                savecontext.strokeStyle = "#fff" ;
                savecontext.strokeRect(x*scale,y*scale,1*scale,1*scale);
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
        nextscontext.fillStyle = '#ccc' ;
        nextscontext.fillRect(0,nextsboard.height/6*i,nextsboard.width,nextsboard.height/6);
        nextscontext.strokeStyle = "#000" ;
        nextscontext.strokeRect(0,nextsboard.height/6*i,nextsboard.width,nextsboard.height/6);
    }
}
function DrawNextMatrixs(nextMatrixs){
    nextMatrixs.forEach((matrix,i) =>{
        matrix.forEach((row,y) =>{
            row.forEach((col,x)=>{
                if( matrix[y][x] !== 0 ){
                    nextscontext.fillStyle = matrixcolors[matrix[y][x]] ;
                    nextscontext.fillRect(x*scale,y*scale+nextsboard.height/6*i,1*scale,1*scale);
                    nextscontext.strokeStyle = "#fff" ;
                    nextscontext.strokeRect(x*scale,y*scale+nextsboard.height/6*i,1*scale,1*scale);
                }
            })
        })
    })
}