import "./styles.css";

const BOARD_SIZE = 5;
const board = [];
const turnToPlayer = {
  x: 1,
  o: 2
};
const boardElement = document.getElementById("board");
const turnTeller = document.getElementById("turn_teller");
const turnTimer = document.getElementById("turn_timer");
const bar = document.getElementById("bar");
let turn = "x";
let time = 1000;
let gameOver = false;

function checkRow(row) {
  for (let i = 1; i < row.length; i++) {
    if (row[i - 1] !== row[i] || row[i] === "") return false;
  }
  return true;
}

function checkForWin() {
  let tempRow = null,
    prevRow = null,
    prevRowForColCheck = null,
    diagIdxLeft = 0,
    diagIdxRight = board.length - 1,
    equalOnDiagLeft = true,
    equalOnDiagRight = true;

  for (let row of board) {
    if (checkRow(row)) return true;

    // handle column checking

    if (!prevRowForColCheck) {
      prevRowForColCheck = row;
    } else {
      tempRow = [];

      for (let i = 0; i < row.length; i++) {
        tempRow.push(
          prevRowForColCheck[i] === row[i] && row[i] !== "" ? row[i] : null
        );
      }
      prevRowForColCheck = tempRow;
    }

    // handle left diagonal checking

    if (
      row[diagIdxLeft] === "" ||
      (diagIdxLeft !== 0 && row[diagIdxLeft] !== prevRow[diagIdxLeft - 1])
    ) {
      equalOnDiagLeft = false;
    }

    // handle right diagonal checking

    if (
      row[diagIdxRight] === "" ||
      (diagIdxRight !== board.length - 1 &&
        row[diagIdxRight] !== prevRow[diagIdxRight + 1])
    ) {
      equalOnDiagRight = false;
    }

    // finalize iteration

    prevRow = row;
    diagIdxLeft++;
    diagIdxRight--;
  }
  for (let cell of prevRowForColCheck) {
    if (cell !== null) return true;
  }
  if (equalOnDiagLeft) return true;
  if (equalOnDiagRight) return true;

  return false;
}

function changeTurn() {
  turn = turn === "x" ? "o" : "x";
  turnTeller.innerText = "Turn of player " + turnToPlayer[turn];
  time = 1000;
}

const timer = setInterval(() => {
  if (time <= 1) {
    changeTurn();
  } else {
    time--;
  }
  turnTimer.innerText = "Time left: " + Math.round(time / 100);
  bar.style.width = time / 10 + "%";
}, 10);

for (let i = 0; i < BOARD_SIZE; i++) {
  const tr = document.createElement("tr");
  boardElement.appendChild(tr);
  board.push([]);

  for (let j = 0; j < BOARD_SIZE; j++) {
    const td = document.createElement("td");
    td.onclick = () => {
      // if cell taken or game over do nothing
      if (board[i][j] !== "" || gameOver) return;

      td.innerHTML = turn;
      td.setAttribute("class", turn);
      board[i][j] = turn;
      gameOver = checkForWin();

      if (gameOver) {
        alert("Player " + turnToPlayer[turn] + " won!");
        clearInterval(timer);
      } else {
        changeTurn();
      }
    };
    tr.appendChild(td);
    board[i].push([]);
    board[i][j] = "";
  }
}
