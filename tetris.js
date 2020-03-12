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

let Block = []
for(let i = 0 ; i < 20; i++){
    Block.push([]) ;
    for(let j = 0 ; j < 10 ; j++){
        Block[i].push(0);
    }
}

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
                context.strokeStyle = "#fff" ;
                context.strokeRect((pos.x+x)*scale,(pos.y+y)*scale,1*scale,1*scale);
                context.strokeStyle = "#c6c" ;
                context.strokeRect((pos.x+x)*scale,board.height-(matrix.length-1-y)*scale,1*scale,1*scale);
            }
        });
    });
}

function Drop(){
    player.pos.y++;
    if( checkCross(player.matrix,player.pos) ){
        player.pos.y--;
        merge(player.matrix,player.pos) ;
    }
    setTimeout(Drop,droptime);
}

function merge(matrix,pos){
    matrix.forEach((row,x)=>{
        row.forEach((col,y)=>{
            if( matrix[y][x] !== 0 ){
                Block[y+pos.y][x+pos.x] = matrix[y][x] ;
            }
        })
    })
}

function checkCross(matrix,pos){
    for(let y = 0 ; y < matrix.length ; y++){
        for(let x = 0 ; x < matrix[y].length ; x++){
            if( matrix[y][x] !== 0 &&
                (Block[ y+pos.y ] &&
                 Block[ y+pos.y][ x+pos.x]) !==0 )
                return true ;
        }
    }
    
    return false ;
}

function update(time = 0){
    
    context.fillStyle = "#fff" ;
    context.fillRect(0,0,board.width ,board.height) ;
    context.lineWidth = "2" ;
    context.strokeStyle = "#000" ;
    context.strokeRect(0,0,board.width ,board.height) ;  

    DrawMatrix(player.matrix,{x :player.pos.x ,y: player.pos.y} ) ;

    //requestAnimationFrame(update());
}

function TetrisStart(){
    const startTime = Date.now() ;
    update();
    
}

document.addEventListener('keydown',function(){
    switch(event.code){
        case 'ArrowLeft'    : ChangeX( -1 ) ;  break;
        case 'ArrowRight'   : ChangeX( 1 ) ; break;
        case 'ArrowDown'    : ChangeY( 1 );  break;
        case 'Space'        : GoBottom() ; break;
        case 'KeyZ'         : console.log('z');     break;
        case 'KeyX'         : console.log('x');     break;
        case 'KeyC'         : console.log('c');     break;
    }
});

function ChangeX(x){
    player.pos.x += x ;
    if(checkCross(player.matrix,player.pos)){
        player.pos.x -= x ;
    }
}
function ChangeY(y){
    player.pos.y += y ;
    if(checkCross(player.matrix,player.pos)){
        player.pos.y -= y ;
    }
}
function GoBottom(){
    player.pos.y = board.height / scale + 1 - player.matrix.length ;
}


setInterval(update,10);
setTimeout(Drop,droptime);
