/* Conway's Game of Life as Model for Vice aka Game of Vice
Can remove vices that have 0 neighboring vice
Can remove a vice provided it has at least one neighbor of grace

Saint Algorithm: get rid of vices quickly as possible

*/
const world = document.getElementById("world");
const ROW = 15
const COL = 26
const CELL_HEIGHT = 30
const CELL_WIDTH = 30
const SPEED = 1000
const RAND_CHANCE = 0.3
const COLOR_STEP = 357 / (ROW*COL) //number of hsl hues / numOfElements
const VICE_HUE = 50;

var pressed;
var timer;
var grace = false;
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
    //TYPES:
    //0: empty cell, free to be influenced
    //1: vice cell
    //2: grace cell
    //3: hard vice
    for (let i = 0; i < ROW * COL; i++) {
        thisGen[i] = {
            type: 0,
            color: "hsl(" + i + ", 9%, 50%);"
            // color: "navy"
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
                nextGen[i].color = ""
                console.log("vice cell to empty")
            } else if (neighbors >= 20) {
                nextGen[i].type = 0
                nextGen[i].color = ""
                console.log("vice cell to empty b/c grace")
            } else if (neighbors >= 6 && neighbors <= 8) {
                nextGen[i].type = 3
                nextGen[i].color = "hsl(" + i + ", " + "20%, " + "17%)"
                // console.log(nextGen[i].color)
                console.log("vice cell to hard")
            } else {
                nextGen[i].type = 1
                nextGen[i].color = thisGen[i].color;
                console.log("vice cell stay")
            }
        } else if (thisGen[i].type == 3) {
            if (neighbors >= 30) {
                nextGen[i].type = 1;
                let color = thisGen[i].color
                let vals = color.split(" ");
                console.log(vals)
                nextGen[i].color = "hsl(" + i + ", " + "20%, " + "17%)"
                console.log("hard cell to vice")
            } else {
                nextGen[i].type = 3;
                nextGen[i].color = "hsl(" + i + ", " + "20%, " + "17%)"
                console.log("hard cell stay")
             }

        } else if (thisGen[i].type == 2){
            if (neighbors > 3 && neighbors <= 8) {
                nextGen[i].type = 1;
                //TODO: make 60 and 40 into functions for dynamism
                nextGen[i].color = "hsl(" + i + ", " + ((40 + 100) / 2) + "%, " + (60/2) + "%)"
                console.log("grace cell to vice")
                // console.log(nextGen[i].color);
            } else if (neighbors >= 20) {
                nextGen[i].type = 2
                // nextGen[i].color = "hsl(" + i + ", " + ((40 + 100) / 2) + "%, " + (60/2) + "%)"
                nextGen[i].color = thisGen[i].color
                console.log("grace cell stay")
            } else {
                nextGen[i].type = 0
                nextGen[i].color = ""
                console.log("grace cell to leave")
            }

        } else if (thisGen[i].type == 0){ 
            if (neighbors >= 40) {
                nextGen[i].type = 2
                // nextGen[i].color = "hsl(" + i + ", 9%, 50%);"
                nextGen[i].color = "yellow"
                console.log("empty cell to grace")

            }
            else if (neighbors > 3 && neighbors <= 8){
                nextGen[i].type = 1
                nextGen[i].color = "hsl(" + i + ", " + "9%, " + "50%)"
                console.log("empty cell to vice")
                // console.log(nextGen[i].color)
            }
            else {
                // console.log(thisGen[i].type)
                nextGen[i].type = 0
                nextGen[i].color = ""
                console.log("empty cell stay")
            }
        }
    }
}

function updateGen() {
    Math.random() < 0.3 ? grace = true : grace = false;

    if (grace) {
        for (let i = 0; i < ROW * COL; i++) {        
            if (nextGen[i].type == 0) {
                Math.random() < 0.1 ? (
                    thisGen[i].type = 2,
                    thisGen[i].color = "yellow"
                    // thisGen[i].color = "white"
                ) : 
                (
                    thisGen[i].type = 0,
                    thisGen[i].color = ""
                )
                continue;
            } else {
                thisGen[i].type = nextGen[i].type; 
                thisGen[i].color = nextGen[i].color;
            }
           
            // nextGen[i].type = 0; nextGen[i].color=""
        }
    } else {
        for (let i = 0; i < ROW * COL; i++){
            thisGen[i].type = nextGen[i].type; 
            thisGen[i].color = nextGen[i].color;
            // nextGen[i].type = 0; nextGen[i].color=""
        }
    } 
}

function updateWorld() {
    let cell = '';
    for (let i = 0; i < ROW * COL; i++){
        cell = document.getElementById(i);
        // console.log("id is + " + cell.id + " type is " + thisGen[i].type)

        switch (thisGen[i].type){
            case 0:
                cell.setAttribute('class', 'dead cell')
                cell.style.backgroundColor = "transparent"
                break
            case 1:
                cell.setAttribute('class', 'alive cell')
                // console.log(thisGen[i].color)
                cell.style.backgroundColor = thisGen[i].color;
                break
            case 2: 
                cell.setAttribute('class', 'grace cell')
                // console.log(thisGen[i].color)
                cell.style.backgroundColor = thisGen[i].color;
                break
            case 3: 
                cell.setAttribute('class', 'hard')
                cell.style.backgroundColor = thisGen[i].color;
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
            // console.log("bottom!")
        } else if (thisGen[x + COL].type == 2) {
            count+=10;
        }

        if ((((x + COL)-1) % COL) != (COL - 1)) { //bottom diagonal left check
            if (thisGen[(x + COL) -1].type == 1 || thisGen[(x + COL) -1].type == 3) { //if vice or hard vice count go up
                count++; 
                // console.log("diag bottom left!")
            } else if (thisGen[(x + COL) -1].type == 2) {
                count+=10; //grace are multiples of 10
            }
        } 

        // console.log("rite check: " + ((((x + ROW)+1) % COL) == 1))

        if ((((x + COL)+1) % COL) != 0) { //bottom diagonal right check
            if (thisGen[(x + COL) +1].type == 1 || thisGen[(x + COL) +1].type == 3) {
                count++; 
                // console.log("diag bottom right!")
            } else if (thisGen[(x + COL) +1].type == 2) {
                count+=10;
            } 
        }

    }

    //if you're not left edge...
    if (((x - 1) % COL) != (COL - 1) && x != 0) {
        if (thisGen[x-1].type == 1 || thisGen[x-1].type == 3) {
            count++;
            // console.log("left!")
        } else if (thisGen[x-1].type == 2) {
            count+=10;
        }
    }

    //if you're not right edge...
    if (((x + 1) % COL) != 0) {
        if (thisGen[x+1].type == 1 || thisGen[x+1].type == 3) {
            count++
            // console.log("right!")
        } if (thisGen[x+1].type == 2) {
            count+=10
        }
    }
    return count;
}

function cellClick(e) {
    let id = e.target.id
    let color = e.target.style.borderColor
    if (e.target.className === "alive cell"){
        e.target.setAttribute('class', 'dead cell')
        thisGen[id].type = 0;
        e.target.style.backgroundColor = "transparent";
    } else {
        e.target.setAttribute('class', 'alive cell')
        e.target.style.backgroundColor = color
        // this.setAttribute('style', 'background-color: ' + color + ";")
        thisGen[id].type = 1;
        // console.log("cell " + id + " is alive and type is " + thisGen[id].type)
    }
}

function createWorld() {
    world.style.gridTemplateRows = 'repeat(' + ROW + ', ' + CELL_HEIGHT + 'px'
    world.style.gridTemplateColumns = 'repeat(' + COL + ', ' + CELL_WIDTH  + 'px'
    
    for (let i = 0; i < ROW * COL; i++) {
        let cell = document.createElement('div');
        let color = "hsl(" + Math.floor(i * COLOR_STEP) + ", 4%, 50%);";
        cell.setAttribute('id', i);
        cell.setAttribute('class', 'dead cell');
        cell.setAttribute('style', "height: " + 
            CELL_HEIGHT + "px; width: " + 
            CELL_WIDTH + "px;" + 
            "border-color: " + color + ""
        )
        // cell.addEventListener('click', cellClick)

        world.appendChild(cell)

    }   
}

//click and drag code
//learning targets, e is a an object that has the target prop,
//target has all the info (div class id styling of what the mouse clicked)
world.addEventListener("mousedown", e => {
    cellClick(e)
    pressed = true;

    world.onmouseover = (e) => {
        if (pressed) {    
            cellClick(e) 
        }
    }  
})

world.addEventListener("mouseup", (e) => {
    pressed = false
    console.log(pressed)

})

//onload creates two empty arrays, and labels all the cells dead
window.onload = () => {
    createWorld();
    initGens();
}
