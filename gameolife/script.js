const ROW = 22
const COL = 21
const CELL_HEIGHT = 20
const CELL_WIDTH = 20
const SPEED = 1000
const world = document.getElementById("world");
var timer;
let start = false;


//generation arrays is a list of ROW * COL where each element represents a cell on the grid
let thisGen = [ROW * COL] //keep the alive cells of current generation
let nextGen = [ROW * COL] //to calculate next generation

function startStop() {
    let btn = document.getElementById('startstop')
    if (start) {
        start = false;
        btn.value = 'start'
        clearTimeout(timer)
    } else {
        start = true;
        btn.value = 'stop'
        change();
    }

}

function reset() {
    location.reload();
}

function initGens() {  //initialize both generation array to 0
    for (let i = 0; i < ROW * COL; i++) {
        thisGen[i] = 0;
        nextGen[i] = 0;
    }
}

function createNextGen() {//ART: chnage this up
    for (let i = 0; i < ROW * COL; i++){
        let neighbors = countNeighbors(i) 
        if (thisGen[i] == 1) {
            if (neighbors < 2) {
                nextGen[i] = 0
            } else if (neighbors == 2 || neighbors == 3) {
                nextGen[i] = 1
            } else if (neighbors > 3) {
                nextGen[i] = 0
            }
        } else if (thisGen[i] == 0){
            if (neighbors == 3) { 
                nextGen[i] = 1
            }
        }
    }
}

function updateGen() {
    for (let i = 0; i < ROW * COL; i++){
        thisGen[i] = nextGen[i];
        nextGen[i] = 0; //ART: what if not...?
    }
}

function updateWorld() {
    let cell = '';
    for (let i = 0; i < ROW * COL; i++){
        cell = document.getElementById(i);
        thisGen[i] == 0 ? cell.setAttribute('class', 'dead cell') : cell.setAttribute('class', 'alive cell')
    }

}

function change() {
    createNextGen();
    updateGen();
    updateWorld();
    if (start) {
        timer = setTimeout(change, SPEED)
    }
}

//countNeighbors: to check bounds we'll rely on these maths:
//x + 1  % COL == 1 -> right edge
//x - 1 % COL == 0 -> left edge  
//x - COL <= 0 -> top edge
//x + COL > ROW * COL -> bottom edge
//(x - COL) - 1 and (x - ROW) + 1 are the top left and right diagonals
//(x + COL) - 1 and (x + ROW) + 1 are the bottom left and right diagonals
function countNeighbors(i) {
    let count = 0;
    let x = Number(i);

    if (x - COL > 0) { //if you're not top edge:
        //count the top neighbor
        
        if (thisGen[x - COL] == 1) {
            count++;
        }

        if ((((x - COL)-1) % COL) != (COL - 1)) { //diagonal left check
            if (thisGen[((x - COL) -1)] == 1) {
                count++;
            }
        } 

        if (((x - COL)+1) % COL != 0) { //diagonal right check
            if (thisGen[(x - COL) + 1] == 1) {
                count++;
            }
        }
    }

    //neighbor got: top , top right, top left
    //if you're not bottom edge:
    if ((x + COL) <= ROW * COL) {        
        if (thisGen[x + COL] == 1) {
            count++;
        }

        if ((((x + COL)-1) % COL) != (COL - 1)) { //bottom diagonal left check
            if (thisGen[(x + COL) -1] == 1) {
                count++;
            }
        } 

        // console.log("rite check: " + ((((x + ROW)+1) % COL) == 1))

        if ((((x + COL)+1) % COL) != 0) { //bottom diagonal right check
            if (thisGen[(x + COL) +1] == 1) {
                count++;
            }
        }

    }

    //if you're not left edge...
    if (((x - 1) % COL) != (COL - 1)) {
        if (thisGen[x-1] == 1) {
            count++;
        }
    }

    //if you're not right edge...
    if (((x + 1) % COL) != 0) {
        if (thisGen[x+1] == 1) {
            count++
        }
    }
    return count;
}

function cellClick() {
    let id = this.id
    if (this.className === "alive cell"){
        this.setAttribute('class', 'dead cell')
        thisGen[id] = 0;
    } else {
        this.setAttribute('class', 'alive cell')
        thisGen[id] = 1;
    }
}

function createWorld() {
    world.style.gridTemplateRows = 'repeat(' + ROW + ', ' + CELL_WIDTH + 'px'
    world.style.gridTemplateColumns = 'repeat(' + COL + ', ' + CELL_HEIGHT  + 'px'

    for (let i = 0; i < ROW * COL; i++) {
        let cell = document.createElement('div');
        cell.setAttribute('id', i);
        cell.setAttribute('class', 'dead cell');
        cell.setAttribute('style', "height: " + CELL_HEIGHT + "px; width: " + CELL_WIDTH + "px;")
        cell.addEventListener('click', cellClick)

        world.appendChild(cell)

    }   
}

window.onload = () => {
    createWorld();
    initGens();
}
