'use strict'
const MINE = `💥`
var gBoard = []
const gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

const gCell = {
    minesAroundCount: 4,
    isShown: false,
    isMine: false,
    isMarked: true
}

var gLevel = [{ SIZE: 4, MINES: 2 }, { SIZE: 5, MINES: 6 }, { SIZE: 6, MINES: 9 }]

function Init() {
    console.log('Hi')
    console.log('MINE: ', MINE)
    var mineBoard = buildBoard(gLevel[0].SIZE)

    console.log(mineBoard)
    renderBoard(mineBoard)




}

function buildBoard(size) {

    const board = []
    var idx = getRandomInt(0, size)
    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            board[i][j] = { gCell }
            if ((i === 0 && j === 2) || (i === 2 && j === 3)) {
                board[i][j].isMine = true


            }

        }
    }
    if (size === 5) {


        board[4][4].isMine = true

        board[3][4].isMine = true

        board[4][0].isMine = true

    }

    return board

}


function setMinesNegsCount(rowIdx, colIdx, board) {
    //console.log('Hi')
    var neighborsCount = 0

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[i].length) continue
            if (board[i][j] === MINE) neighborsCount++
        }
    }
    return neighborsCount
}

function renderBoard(board) {

    var strHtml = '<table class="mineBoard"><tbody class="">'
    for (var i = 0; i < board.length; i++) {
        //var row = board[i]
        strHtml += '<tr>\n'
        for (var j = 0; j < board[i].length; j++) {

            if (!board[i][j].isMine) {
                var value = setMinesNegsCount(i, j, board)
                console.log('value: ', value)
                board[i][j] = value

            }
            else {
                board[i][j] = MINE

            }
            // if((i===0 && j===2) || (i===2 &&j===3)){
            //     board[i][j]=MINE
            // }
            // else{
            //     board[i][j]=setMinesNegsCount(i,j,board)
            // }
            //var className = (i + j) % 2 ? 'black' : 'white'

            strHtml += `\t<td id="${i}-${j}- class="hide" onclick="onCellClicked(this)"><span>${board[i][j]}</span></td>\n`
        }
        strHtml += '</tr>\n'
    }
    strHtml += '</tbody></table>'
    // console.log(strHtml);
    var elMat = document.querySelector('.game-board')
    elMat.innerHTML = strHtml
}

function onCellClicked(elCell) {
    var elGameOv = document.querySelector('gameOver')
    var elSpan = elCell.querySelector('span')
    if (elCell.isMine)
        elGameOv.style.display = 'block'

    elSpan.style.display = 'block'





}

function getCellCoord(strCellId) {
    var coord = {}
    var parts = strCellId.split('-')

    coord.i = +parts[1]
    coord.j = +parts[2]
    return coord;


}
// function onCellMarked(elCell) {

// }

// function checkGameOver() {

// }

function expandShown(board, elCell, i, j) {
    var x = setMinesNegsCount(i, j, board)
    for (var i = i; i < x; i++) {
        var elSpan = elCell.querySelector('span')
        elSpan.style.display = 'block'

    }

    // setMinesNegsCount(i,j,board)


}
function createBoardRandomWay(size) {
    const board = []

    var idxI = getRandomInt(0, size)
    var idxJ = getRandomInt(0, size)
    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            board[i][j] = { gCell }
            if ((i === 0 && j === 2) || (i === 2 && j === 3)) {
                board[idxI][idxJ].isMine = true

            }

        }
    }
}


//const board = document.getElementById("board");

// Create the board


// Add mines to random squares
// const mines = [];
// for (let i = 0; i < 10; i++) {
//   let row, col;
//   do {
//     row = Math.floor(Math.random() * 8);
//     col = Math.floor(Math.random() * 8);
//   } while (mines.some(mine => mine[0] === row && mine[1] === col));
//   mines.push([row, col]);
// }
