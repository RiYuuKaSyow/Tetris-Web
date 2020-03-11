const board = document.getElementById('tetris') ;
const context = board.getContext('2d');
const scale = 30 ;
const playing = 1 ;
const pause = 2 ;
const end = 0 ;
let playstate = end ;
let droptime = 1000 ;

context.lineWidth = "2" ;
context.strokeStyle = "#000" ;
context.strokeRect(0,0,board.width ,board.height) ; 
//context.scale(30,30);


function createMatrix(){
    return [
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0]
    ] ;
}

let player = {
    pos : { x : 0 , y : 0} ,
    matrix : createMatrix() 
};

function DrawMatrix(matrix,pos){
    matrix.forEach((row,y) => {
        row.forEach((col,x) => {
            if(matrix[y][x] !== 0){
                context.fillStyle = "#a0a" ;
                context.fillRect((pos.x+x)*scale,(pos.y+y)*scale,1*scale,1*scale);
                context.strokeStyle = "#c6c" ;
                context.strokeRect((pos.x+x)*scale,board.height-(matrix.length-1-y)*scale,1*scale,1*scale);
            }
        });
    });
}
function ClearMatrix(matrix,pos){
    matrix.forEach((row,y) => {
        row.forEach((col,x) => {
            if(matrix[y][x] !== 0){
                context.fillStyle = "#fff" ;
                context.fillRect((pos.x+x)*scale,(pos.y+y)*scale,1*scale,1*scale);
                context.strokeStyle = "#000" ;
                context.strokeRect((pos.x+x)*scale,board.height-(matrix.length-1-y)*scale,1*scale,1*scale);
            }
        });
    });
}

function Drop(){
    player.pos.y++;
    setTimeout(Drop,droptime);
}

function update(time = 0){
    
    //console.log(time);
    /*let lastTime = time ;
    if( time - lastTime> droptime ){
        player.pos.y++ ;
        lastTime = time ;
    }*/
    
    DrawMatrix(player.matrix,{x :player.pos.x ,y: player.pos.y} ) ;
    //requestAnimationFrame(update());
}

function TetrisStart(){
    const startTime = Date.now() ;
    update();
    
}
//DrawMatrix(player.matrix,player.pos) ;

setInterval(update,10);
setTimeout(Drop,droptime);