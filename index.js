function hide(id){
    document.getElementById(id).style.display = 'none' ;
}
setBoard('Tetris');
setSaveBoard('saveMatrix');
setNextBoard('nexts');
setScore('Score');
setTime('Time')
setEnd('GameMenu','flex');
setPause('PauseMenu');

let url = new URLSearchParams(window.location.search);
if( url.has('suisei') === true ){
    setSuiSei();
}

document.getElementById('Basic').addEventListener('click',function(){
    Start('basic');hide('GameMenu');
})
document.getElementById('Forty').addEventListener('click',function(){
    Start('clean40');hide('GameMenu');
})
document.getElementById('Trash').addEventListener('click',function(){
    Start('cleanTrash');hide('GameMenu');
})
document.getElementById('Continue').addEventListener('click',function(){
    TetrisReStart();hide('PauseMenu');
})
document.getElementById('Endbtn').addEventListener('click',function(){
    TetrisEnd();hide('PauseMenu');
})