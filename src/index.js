import "./styles.css";

const BOARD_SIZE = 5;
const board = [];
const turnToPlayer = {
  x: 1,
  o: 2
};
const container = document.getElementById("container");
const turnTeller = document.getElementById("turn_teller");
const turnTimer = document.getElementById("turn_timer");
const bar = document.getElementById("bar");
let turn = "x";
let time = 10;
let gameOver = false;
turnTimer.innerText = "Time left: " + time;
bar.style.width = time * 10 + "%";

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

  // reset timer
  clearInterval(interval);
  time = 10;
  interval = setInterval(timer, 1000);
  turnTimer.innerText = "Time left: " + time;
  bar.style.width = time * 10 + "%";
}

function timer() {
  if (time <= 1) {
    changeTurn();
  } else {
    time--;
  }
  turnTimer.innerText = "Time left: " + time;
  bar.style.width = time * 10 + "%";
}

let interval = setInterval(timer, 1000);

for (let i = 0; i < BOARD_SIZE; i++) {
  const row = document.createElement("div");
  row.setAttribute("class", "row");
  container.appendChild(row);
  board.push([]);

  for (let j = 0; j < BOARD_SIZE; j++) {
    board[i].push([]);
    board[i][j] = "";

    const col = document.createElement("div");
    col.setAttribute("class", "col center");
    col.onclick = () => {
      // if cell taken or game over do nothing
      if (board[i][j] !== "" || gameOver) return;

      col.innerHTML = turn;
      col.classList.add(turn);
      board[i][j] = turn;
      gameOver = checkForWin();

      if (gameOver) {
        alert("Player " + turnToPlayer[turn] + " won!");
        clearInterval(interval);
      } else {
        changeTurn();
      }
    };
    row.appendChild(col);
  }
}
