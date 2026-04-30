'use strict'
const MINE = `💥`
const FLAG = '🚩'
var gBoard = []
var timerInterval
var gCountCellClicked = 0
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
var gLevel = [{ SIZE: 4, MINES: 2 }, { SIZE: 8, MINES: 14 }, { SIZE: 12, MINES: 32 }]
var gLives = 2
var gHoveredCell = null
function Init() {
    console.log('Hi')
    console.log('MINE: ', MINE)
    gBoard = buildBoard(gLevel[0].SIZE)
    console.log('mineBoard: ', gBoard)
    renderBoard(gBoard)

}
function buildBoard(size) {
    var minesCount = 0
    for (var x = 0; x < gLevel.length; x++) {
        if (gLevel[x].SIZE === size) minesCount = gLevel[x].MINES
    }

    var board = []
    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            board[i][j] = { minesAroundCount: 0, isShown: false, isMine: false, isMarked: false }
        }
    }

    var placed = 0
    while (placed < minesCount) {
        var row = getRandomInt(0, size)
        var col = getRandomInt(0, size)
        if (!board[row][col].isMine) {
            board[row][col].isMine = true
            placed++
        }
    }

    gGame.isOn = true
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
            if (board[i][j].isMine) neighborsCount++
        }
    }
    board[rowIdx][colIdx].minesAroundCount = neighborsCount
    return neighborsCount
}

function renderBoard(board) {
    var idx = 0
    for (var x = 0; x < gLevel.length; x++) {
        if (board.length === gLevel[x].SIZE)
            idx = gLevel[x].MINES

    }
    var value = null
    var strHtml = '<table class="mineBoard"><tbody class="">'
    for (var i = 0; i < board.length; i++) {
        //var row = board[i]
        strHtml += '<tr>\n'
        for (var j = 0; j < board[i].length; j++) {

            if (!board[i][j].isMine) {
                value = setMinesNegsCount(i, j, board)
                console.log('value: ', value)
                //board[i][j] = value

            }
            else {
                value = MINE

            }

            strHtml += `\t<td id="${i}-${j}" data-size="${board.length ** 2}" data-level="${idx}" class="cell" onmouseover="onCellHover(this)" onclick="onCellClicked(this)" oncontextmenu="onCellMarked(this); return false"><span>${value}</span></td>\n`
        }
        strHtml += '</tr>\n'
    }
    strHtml += '</tbody></table>'
    // console.log(strHtml);
    var elMat = document.querySelector('.game-board')
    elMat.innerHTML = strHtml
}

function onCellClicked(elCell) {
    if (elCell.style.backgroundColor === 'green' || elCell.style.backgroundColor === 'darkred' || elCell.style.backgroundColor === 'yellow') return

    gCountCellClicked++
    
    if (gCountCellClicked === 1) timer()

    // for(var i=0;i<gBoard[i].length;i++){
    //     if(gLevel[i].SIZE===gBoard.length){
    //         gLives=gLevel[i].MINES
    //     }
    // }
    var strHTML = '<h1>Lives remaning:'
    var Id = elCell.id
    var num = Id.split('-')
    num[0] = +num[0]
    num[1] = +num[1]


    console.log('num: ', num)
    if (gGame.isOn) {     //במידה והמשחק עדיין פועל
        var elLives = document.querySelector('h1')
        var elGameOv = document.querySelector('.gameOver')
        var elColor = document.getElementById(`${num[0]}-${num[1]}`)
        var elSpan = elCell.querySelector('span')
        // if(onHandleKey){
        //     elSpan.innerText=FLAG
        // }


        if (elCell.textContent === MINE) {     //במידה ולחצתי על מוקש בודק אם נשארו חיים ופועל בהתאם
            gLives--
            gCountCellClicked--
            if (gLives > 0) {
                elSpan.style.display = 'block'
                elColor.style.backgroundColor = 'darkred'
                for (var i = 0; i < gLives; i++) {
                    strHTML += '❤️'
                }
                strHTML += '</h1>'
                elLives.innerHTML = strHTML


            }
            else {
                clearInterval(timerInterval)
                elGameOv.style.display = 'block'
                elSpan.style.display = 'block'
                elColor.style.backgroundColor = 'darkred'
                gGame.isOn = false
                var elSmile = document.querySelector('.resetGame')
                elSmile.innerText = '😭'
                elSmile.style.backgroundColor = 'crimson'
                strHTML += '</h1>'
                elLives.innerHTML = strHTML

            }

        }

        else {                                          //במידהולא לחצתי על מוקש

            var numVictory = elCell.getAttribute('data-size')
            var numMines = elCell.getAttribute('data-level')
            expandShown(gBoard, elCell, num[0], num[1])
            elSpan.style.display = 'block'
            elColor.style.backgroundColor = 'green'
            gGame.shownCount++
            if (gGame.shownCount === (numVictory - numMines)) {
                elGameOv.innerText = 'Victory!!'
                elGameOv.style.display = 'block'
                clearInterval(timerInterval)

            }

            // setMinesNegsCount(gBoard,elCell,num[i],num[j])
            //TODO - SHOW RESTART BUTTON
        }

    }
}

function expandShown(board, elCell, i, j) {
    // var arr = []
    // arr.push(elCell.id.split('-'))
    // var num = arr[0]


    
    for (var row = i - 1; row <= i + 1; row++) {
        if (row < 0 || row >= board.length) continue
        for (var col = j - 1; col <= j + 1; col++) {
            if (i === row && j === col) continue
            if (col < 0 || col >= board[row].length) continue
            
            if (board[row][col] !== MINE && !gBoard[row][col].isMine) {
                var elColor = document.getElementById(`${row}-${col}`)
                if (elColor.style.backgroundColor === 'green') continue
                elColor.style.backgroundColor = 'green'
                gGame.shownCount++
            }

        }
    }
    // for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    //     if (i < 0 || i >= board.length) continue

    //     for (var j = colIdx - 1; j <= colIdx + 1; j++) {
    //         if (i === rowIdx && j === colIdx) continue
    //         if (j < 0 || j >= board[i].length) continue
    //         if (board[i][j].isMine) neighborsCount++
    //     }
    // }

}

function onCellHover(elCell) {
    gHoverCell = elCell
}




function Restart() {
    gGame.shownCount = 0
    gLives = 2
    gCountCellClicked = 0
    var elSmile = document.querySelector('.resetGame')
    elSmile.innerText = '🙂'
    elSmile.style.backgroundColor = 'bisque'
    var elGameOv = document.querySelector('.gameOver')
    elGameOv.style.display = 'none'
    var elLives = document.querySelector('h1')
    var strHTML = '<h1>Lives remaning:'
    var elTimer = document.querySelector('h3')
    elTimer.innerText = '0.000'
    for (var i = 0; i < gLives; i++) {
        strHTML += '❤️'
    }
    strHTML += '</h1'
    elLives.innerHTML = strHTML
    clearInterval(timerInterval)
    gBoard = buildBoard(gLevel[0].SIZE)
    console.log('mineBoard: ', gBoard)
    renderBoard(gBoard)

}

function timer() {
    clearInterval(timerInterval)
    var startTime = Date.now()

    timerInterval = setInterval(() => {
        var elapsedTime = Date.now() - startTime
        document.querySelector('h3').innerText = (
            elapsedTime / 1000
        ).toFixed(3)
    }, 37)
}

function changeLevel(size) {
    gGame.shownCount = 0
    var num
    gCountCellClicked = 0
    for (var i = 0; i < gLevel.length; i++) {
        if (gLevel[i].SIZE === size) {
            num = gLevel[i].SIZE
            if (num === 8)
                gLives = 4
            else {
                gLives = 10
            }
        }
        // gLives = 2
    }
    clearInterval(timerInterval)
    gGame.isOn = true
    var elSmile = document.querySelector('.resetGame')
    elSmile.innerText = '🙂'
    elSmile.style.backgroundColor = 'bisque'
    var elGameOv = document.querySelector('.gameOver')
    elGameOv.style.display = 'none'
    var elLives = document.querySelector('h1')
    var strHTML = '<h1>Lives remaning:'
    var elTimer = document.querySelector('h3')
    elTimer.innerText = '0.000'
    for (var i = 0; i < gLives; i++) {
        strHTML += '❤️'
    }
    strHTML += '</h1'
    elLives.innerHTML = strHTML
    elLives.style.width = '470px'
    gBoard = buildBoard(num)
    renderBoard(gBoard)
}

function onCellMarked(elCell) {
    // var splitIdArr = []
    // splitIdArr.push(elCell.id.split('-'))
    // var num = splitIdArr[0]
    // gBoard[num[0]][num[1]].isMarked = true

}

function onHandleKey(ev) {
    if ((ev.key === 'x' || ev.key === 'X') && gHoveredCell) {
        onCellMarked(gHoveredCell)
    }
}


// function checkGameOver() {

// }


// function createBoardRandomWay(size) {
//     const board = []

//     var idxI = getRandomInt(0, size)
//     var idxJ = getRandomInt(0, size)
//     for (var i = 0; i < size; i++) {
//         board.push([])
//         for (var j = 0; j < size; j++) {
//             board[i][j] = { gCell }
//             if ((i === 0 && j === 2) || (i === 2 && j === 3)) {
//                 board[idxI][idxJ].isMine = true

//             }

//         }
//     }
// }


//const board = document.getElementById("board");

function onCellMarked(elCell) {
    if (!gGame.isOn)
         return

    if (elCell.style.backgroundColor === 'green' || elCell.style.backgroundColor === 'darkred') 
        return

    var num = elCell.id.split('-')
    var elSpan = elCell.querySelector('span')

    if (!gBoard[num[0]][num[1]].isMarked) {
        gBoard[num[0]][num[1]].isMarked = true
        elCell.dataset.original = elSpan.innerText
        elSpan.innerText = 'X'
        elSpan.style.display = 'block'
        elCell.style.backgroundColor = 'yellow'
    } else {
        gBoard[num[0]][num[1]].isMarked = false
        elSpan.innerText = elCell.dataset.original
        elSpan.style.display = 'none'
        elCell.style.backgroundColor = ''
    }
}



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
