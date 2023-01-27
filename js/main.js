'use strict'
const MINE = `💥`
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
function Init() {
    console.log('Hi')
    console.log('MINE: ', MINE)
    gBoard = buildBoard(gLevel[0].SIZE)
    console.log('mineBoard: ', gBoard)
    renderBoard(gBoard)

}
var helpBoard = buildBoard(gLevel[0].SIZE)
//console.log('helpBoard: ',helpBoard)



function buildBoard(size) {

    var board = []
    // var idx = getRandomInt(0, size)
    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            board[i][j] = { gCell }
            if ((i === 0 && j === 2) || (i === 2 && j === 3)) {
                board[i][j].isMine = true
                // gBoard[i][j].isMine=true

            }

        }

    }
    if (size === 8) {

            //0,2      2,3     4,4    3,4      4,0
        board[6][6].isMine = true
        board[6][0].isMine = true
        board[2][5].isMine = true
        board[4][4].isMine = true
        board[3][4].isMine = true
        board[4][0].isMine = true
        board[1][7].isMine = true
        board[1][1].isMine = true
        board[5][3].isMine = true
        board[7][6].isMine = true
        board[7][5].isMine = true
        board[5][7].isMine = true
        

    }
    gGame.isOn = true;
    return board
    // return gBoard

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
    var idx=0
    for(var x=0;x<gLevel.length;x++){
        if(board.length===gLevel[x].SIZE)
        idx=gLevel[x].MINES
        
    }
    var value = null
    var strHtml = '<table class="mineBoard"><tbody class="">'
    for (var i = 0; i < board.length; i++) {
        //var row = board[i]
        strHtml += '<tr>\n'
        for (var j = 0; j < board[i].length; j++) {

            if (!board[i][j].isMine) {
                value = setMinesNegsCount(i, j, board)
                gBoard[i][j] = value   //---------
                console.log('value: ', value)
                //board[i][j] = value

            }
            else {
                value = MINE

            }

            strHtml += `\t<td id="${i}-${j}" data-size="${board.length**2}" data-level="${idx}" class="cell", "hide", onclick="onCellClicked(this)"><span>${value}</span></td>\n`
        }
        strHtml += '</tr>\n'
    }
    strHtml += '</tbody></table>'
    // console.log(strHtml);
    var elMat = document.querySelector('.game-board')
    elMat.innerHTML = strHtml
}

function onCellClicked(elCell, gBoard) {

    gCountCellClicked++
    debugger;
    if (gCountCellClicked === 1) timer()

    // for(var i=0;i<gBoard[i].length;i++){
    //     if(gLevel[i].SIZE===gBoard.length){
    //         gLives=gLevel[i].MINES
    //     }

    // }
    var strHTML = '<h1>Lives remaning:'
    var splitIdArr = []
    splitIdArr.push(elCell.id.split('-'))
    var num = splitIdArr[0]
    console.log('num: ', num)
    if (gGame.isOn) {
        var elLives = document.querySelector('h1')
        var elGameOv = document.querySelector('.gameOver')
        var elColor = document.getElementById(`${num[0]}-${num[1]}`)
        var elSpan = elCell.querySelector('span')

        if (elCell.textContent === MINE) {
            gLives--
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

        else {
            
            var numVictory= elCell.getAttribute('data-size')
            var numMines= elCell.getAttribute('data-level')
            expandShown(gBoard, elCell, num[0], num[1])
            elSpan.style.display = 'block'
            elColor.style.backgroundColor = 'green'
            if(gCountCellClicked===(numVictory- numMines)){
                elGameOv.innerText='Victory!!'
                elGameOv.style.display = 'block'
                clearInterval(timerInterval)

            }
            
            // setMinesNegsCount(gBoard,elCell,num[i],num[j])
            //TODO - SHOW RESTART BUTTON
        }
        //onCellMarked(elCell)
    }
}

function expandShown(board, elCell, i, j) {
    // var arr = []
    // arr.push(elCell.id.split('-'))
    // var num = arr[0]

    for (var row = i - 1; i < row + 1; row++) {
        if (row < 0 || row >= board.length) continue

        for (var col = j - 1; col < j + 1; col++) {
            if (i === row && j === col) continue
            if (col < 0 || col >= board[row].length) continue
            var elColor = document.getElementById(`${row}-${col}`)
            debugger;
            if (!board[row][col].isMine) {
                var elSpan = elCell.querySelector('span')
                elColor.style.backgroundColor = 'green'
                elSpan.style.display = 'block'
            }

        }
    }


    // var x = setMinesNegsCount(i, j, board)
    // for (var i = i; i < x; i++) {
    //     var elSpan = elCell.querySelector('span')
    //     elSpan.style.display = 'block'

    // }
    // setMinesNegsCount(i,j,board)


}

function Restart() {
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
    var gBoard = buildBoard(gLevel[0].SIZE)
    console.log('mineBoard: ', gBoard)
    renderBoard(gBoard)

}

function timer() {
    var startTime = Date.now()

    timerInterval = setInterval(() => {
        var elapsedTime = Date.now() - startTime
        document.querySelector('h3').innerText = (
            elapsedTime / 1000
        ).toFixed(3)
    }, 37)
}

function changeLevel(size) {
    var num
    gCountCellClicked = 0
    for (var i = 0; i < gLevel.length; i++) {
        if (gLevel[i].SIZE === size) {
            num = gLevel[i].SIZE
            if(num===8)
            gLives = 4
            else{
                gLives=10
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
    var splitIdArr = []
    splitIdArr.push(elCell.id.split('-'))
    var num = splitIdArr[0]
    gBoard[num[0]][num[1]].isMarked = true

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
