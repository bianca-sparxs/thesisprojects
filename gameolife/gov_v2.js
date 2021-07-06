/* Conway's Game of Life as Model for Vice aka Game of Vice
Can remove vices that have 0 neighboring vice
Can remove a vice provided it has at least one neighbor of grace

Saint Algorithm: get rid of vices quickly as possible

/* V2.0 grace builds up  */

const ROW = 13
const COL = 5
const CELL_HEIGHT = 17
const CELL_WIDTH = 17
const SPEED = 1000
const RAND_CHANCE = 0.3
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
        thisGen[i] = {
            type: 0,
            color: ""
        };
        nextGen[i] = {
            type: 0,
            color: ""
        };
    }
}

function createNextGen() {//ART: chnage this up
    for (let i = 0; i < ROW * COL; i++){
        let neighbors = countNeighbors(i)
        console.log("cell " + i + " has " + neighbors + " neighbors")
        if (thisGen[i].type == 1) {
            if (neighbors == 0) {
                nextGen[i].type = 0
            } else if (neighbors >= 10) {
                nextGen[i].type = 0
            } else if (neighbors >= 3 && neighbors <= 8) {
                nextGen[i].type = 3
            } else {
                nextGen[i].type = 1
            }
        } else if (thisGen[i].type == 3){
            if (neighbors >= 30) {
                nextGen[i].type = 1;
            } else {
                nextGen[i].type =3; }
            // else if (neighbors >= 2 && neighbors < 30) {
            //     nextGen[i].type = 3
            // } 

        } else if (thisGen[i].type == 2){
            if (neighbors >= 4 && neighbors <= 8) {
                nextGen[i].type = 1;
            } else if (neighbors >= 30) {
                nextGen[i].type = 2
            } 

        } else if (thisGen[i].type == 0){ 
            continue
        }
    }
}

function updateGen() {
    for (let i = 0; i < ROW * COL; i++){        
        if (nextGen[i].type == 0) {
            Math.random() < 0.15 ? thisGen[i].type = 2 : thisGen[i].type = 0;
            continue;
        }
        thisGen[i].type = nextGen[i].type;
        nextGen[i].type = 0; //ART: what if not...?
    }
}

function updateWorld() {
    let cell = '';
    for (let i = 0; i < ROW * COL; i++){
        cell = document.getElementById(i);
        switch (thisGen[i].type){
            case 0:
                cell.setAttribute('class', 'dead cell')
                break
            case 1:
                cell.setAttribute('class', 'alive cell')

                break
            case 2: 
                cell.setAttribute('class', 'grace cell')
                break
            case 3: 
                cell.setAttribute('class', 'hard')
                break
        }
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

//countNeighbors: to check bounds we'll rely on these maths: (this is starting from 1 :<)
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
        if (thisGen[x - COL].type == 1 || thisGen[x - COL] == 3) { //count the top neighbor
            count++;
            // console.log("top!")
        } else if (thisGen[x - COL].type == 2) {
            count+=10;
        }

        if ((((x - COL)-1) % COL) != (COL - 1)) { //diagonal left check
            if (thisGen[((x - COL) -1)].type == 1 || thisGen[((x - COL) -1)].type == 3 ) {
                count++; 
                // console.log("diag top left!")
            } else if (thisGen[((x - COL) -1)].type == 2) {
                count+=10;
            }
        } 

        if (((x - COL)+1) % COL != 0) { //diagonal right check
            if (thisGen[(x - COL) + 1].type == 1 || thisGen[(x - COL) + 1].type == 1) { //if vice or hard vice count go up
                count++; 
                // console.log("diag top right!")
            } else if (thisGen[(x - COL) + 1].type == 2) {
                count+=10;
            }
        }
    }

    //neighbor got: top , top right, top left
    //if you're not bottom edge:
    if ((x + COL) < ROW * COL) { 
        if (thisGen[x + COL].type == 1 || thisGen[x + COL].type == 3) { //count bottom neighbor
            count++; 
            console.log("bottom!")
        } else if (thisGen[x + COL].type == 2) {
            count+=10;
        }

        if ((((x + COL)-1) % COL) != (COL - 1)) { //bottom diagonal left check
            if (thisGen[(x + COL) -1].type == 1 || thisGen[(x + COL) -1].type == 3) { //if vice or hard vice count go up
                count++; 
                console.log("diag bottom left!")
            } else if (thisGen[(x + COL) -1].type == 2) {
                count+=10; //grace are multiples of 10
            }
        } 

        // console.log("rite check: " + ((((x + ROW)+1) % COL) == 1))

        if ((((x + COL)+1) % COL) != 0) { //bottom diagonal right check
            if (thisGen[(x + COL) +1].type == 1 || thisGen[(x + COL) +1].type == 3) {
                count++; 
                console.log("diag bottom right!")
            } else if (thisGen[(x + COL) +1].type == 2) {
                count+=10;
            } 
        }

    }

    //if you're not left edge...
    if (((x - 1) % COL) != (COL - 1) && x != 0) {
        if (thisGen[x-1].type == 1 || thisGen[x-1].type == 3) {
            count++;
            console.log("left!")
        } else if (thisGen[x-1].type == 2) {
            count+=10;
        }
    }

    //if you're not right edge...
    if (((x + 1) % COL) != 0) {
        if (thisGen[x+1].type == 1 || thisGen[x+1].type == 3) {
            count++
            console.log("right!")
        } if (thisGen[x+1].type == 2) {
            count+=10
        }
    }
    return count;
}

function cellClick() {
    let id = this.id
    let color = this.style.borderColor
    if (this.className === "alive cell"){
        this.setAttribute('class', 'dead cell')
        thisGen[id].type = 0;
    } else {
        this.setAttribute('class', 'alive cell')
        this.style.backgroundColor = color
        // this.setAttribute('style', 'background-color: ' + color + ";")
        thisGen[id].type = 1;
    }
}

function createWorld() {
    world.style.gridTemplateRows = 'repeat(' + ROW + ', ' + CELL_HEIGHT + 'px'
    world.style.gridTemplateColumns = 'repeat(' + COL + ', ' + CELL_WIDTH  + 'px'
    
    for (let i = 0; i < ROW * COL; i++) {
        let cell = document.createElement('div');
        let color = "hsl(" + i + ", 40%, 60%);";
        cell.setAttribute('id', i);
        cell.setAttribute('class', 'dead cell');
        cell.setAttribute('style', "height: " + 
            CELL_HEIGHT + "px; width: " + 
            CELL_WIDTH + "px;" + 
            "border-color: " + color + "")
        cell.addEventListener('click', cellClick)

        world.appendChild(cell)

    }   
}

window.onload = () => {
    createWorld();
    initGens();
}
