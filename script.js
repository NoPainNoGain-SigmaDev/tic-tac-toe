function GameBoard() {
  let board = [];

  for (let row = 0; row < 3; row++) {
    board.push([]);
    for (let slot = 0; slot < 3; slot++) {
      board[row].push(new Slot());
    }
  }

  const getBoard = () => board;

  const printBoard = () => {
    const boardWithValues = board.map((row) =>
      row.map((slot) => slot.getValue())
    );
    console.log(boardWithValues);
  };

  const setPlay = (row, slot, player) => {
    if (board[row][slot].getValue() !== 0) return;
    board[row][slot].updateSlot(player);
  };

  return { getBoard, printBoard, setPlay };
}

//An Slot represents an empty space in the board which can be
//0: No token
//1: Player 1 token
//2: Player 2 token
function Slot() {
  let value = 0;

  const updateSlot = (player) => {
    value = player;
  };
  const getValue = () => value;

  return { updateSlot, getValue };
}

function GameController(playerOne = "Player #1", playerTwo = "Player #2") {
  const board = new GameBoard();

  const players = [
    {
      name: playerOne,
      token: 1,
    },
    {
      name: playerTwo,
      token: 2,
    },
  ];

  let activePlayer = players[0];
  let winnerPlayer = players[0];
  let winner = false;

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(getActivePlayer().name + " turn...");
  };

  const getWinner = () => winner;
  const getWinnerName = () => winnerPlayer.name;

  const playRound = (row, slot) => {
    board.setPlay(row, slot, getActivePlayer().token);
    if (checkForWinner()) {
      winner = true;
      return;
    }
    switchPlayerTurn();
    //printNewRound();
  };

  const checkForWinner = () => {
    const boardWithValues = board
      .getBoard()
      .map((row) => row.map((slot) => slot.getValue()));

    //      |    |
    //  ----|----|----
    //      |    |     
    //  ----|----|----    
    //      |    |
    let directions = [
      { dir: "left", row: 0, slot: -1 }, // left
      { dir: "top-left", row: -1, slot: -1 }, // top-left
      { dir: "above", row: -1, slot: 0 }, // above
      { dir: "top-right", row: -1, slot: 1 } // top-right
    ];
    let winnner = false;
    const checkSurroundings = (row, slot) => {
      const currentSlot = boardWithValues[row][slot];

      for (let axisPosition = 0; axisPosition < 4; axisPosition++) {
        const rowBefore = row + directions[axisPosition].row;
        const slotBefore = slot + directions[axisPosition].slot;
        const rowAfter = row + directions[axisPosition].row * -1;
        const slotAfter = slot + directions[axisPosition].slot * -1;

        const beforeSlot = boardWithValues[rowBefore]?.[slotBefore];
        const afterSlot = boardWithValues[rowAfter]?.[slotAfter];
    
        if (!beforeSlot || !afterSlot) {
        } else {
          if (currentSlot === beforeSlot && currentSlot === afterSlot) {
            winnner = true;
            if(currentSlot === 1){
                winnerPlayer = players[0];
            }else{
                winnerPlayer = players[1];
            }
            return;
          }
        }
      }
    };
    for (let row = 0; row < 3; row++) {
      for (let slot = 0; slot < 3; slot++) {
        checkSurroundings(row, slot);
        if (winnner) return true;
      }
    }
  };

  //console only
  //printNewRound();

  return {
    getActivePlayer,
    playRound,
    getBoard: board.getBoard,
    getWinner,
    getWinnerName,
  };
}

function ScreenController() {
  //DOM elements
  const gameBoard = document.getElementById("game-board");
  const playerOneInput = document.getElementById("player-1-name");
  const playerTwoInput = document.getElementById("player-2-name");
  const playerTurn = document.getElementById("player-turn");

  let playerOneName = playerOneInput.value;
  let playerTwoName = playerTwoInput.value;

  if (playerOneInput.value === "") {
    playerOneInput.value = "SOL";
    playerOneName = "SOL";
  }
  if (playerTwoInput.value === "") {
    playerTwoInput.value = "LUNA";
    playerTwoName = "LUNA";
  }

  const game = new GameController(playerOneName, playerTwoName);

  const updateScreen = () => {
    //clears the board
    gameBoard.textContent = "";
    playButton.textContent = "START OVER";

    //get latest board
    const board = game.getBoard();

    const activePlayer = game.getActivePlayer().name;

    //update current player
    playerTurn.textContent = `It is ${activePlayer}'s turn.`;

    const getIconClass = (slot) => {
      const slotValue = slot.getValue();
      if (slotValue === 0) {
        return "empty-slot";
      } else if (slotValue === 1) {
        return "fa-solid fa-x";
      } else {
        return "fa-solid fa-o";
      }
    };

    //load board
    const loadBoard = () => {
      board.forEach((row, indexRow) =>
        row.forEach((slot, indexSlot) => {
          const slotButton = `<button data-row="${indexRow}" data-slot="${indexSlot}">
                                    <i class="${getIconClass(slot)}"></i>
                            </button>`;
          gameBoard.innerHTML += slotButton;
        })
      );
    };

    loadBoard();
    if (game.getWinner()) {
      playerTurn.textContent = `${game.getWinnerName()} Wins!`;
      return;
    }
  };

  //update play
  gameBoard.addEventListener("click", (e) => {
    const selectedRow = e.target.dataset.row;
    const selectedSlot = e.target.dataset.slot;
    if (game.getWinner()) {
      return;
    }
    game.playRound(selectedRow, selectedSlot);
    updateScreen();
  });

  //first load
  updateScreen();
}

const playButton = document.getElementById("play-button");
playButton.addEventListener("click", ScreenController);
