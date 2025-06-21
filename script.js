function GameBoard() {
  let board = [];

  for(let row = 0; row < 3; row++){
    board.push([]);
    for(let slot = 0; slot < 3; slot++){
        board[row].push(new Slot());
    }
  }

  const getBoard = () => board;

  const printBoard = () => {
    const boardWithValues = board.map(row=>row.map(slot=>slot.getValue()));
    console.log(boardWithValues);
  };

  const setPlay = (row, slot, player)=>{
    if(board[row][slot].getValue()!== 0 )return;
    board[row][slot].updateSlot(player);
  };

  return {getBoard, printBoard, setPlay};
}

//An Slot represents an empty space in the board which can be
//0: No token
//1: Player 1 token
//2: Player 2 token
function Slot() {
  let value = 0;

  const updateSlot = (player) =>{
    value = player
  };
  const getValue = ()=>value;

  return {updateSlot, getValue};
}


function GameController(
    playerOne = "Player #1",
    playerTwo = "Player #2"
){
    const board = new GameBoard();

    const players = [
        {
            name: playerOne,
            token: 1
        },
        {
            name: playerTwo,
            token:2
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = ()=>{
        activePlayer = activePlayer === players[0]? players[1] : players[0];
    };

    const getActivePlayer = ()=>activePlayer; 

    const printNewRound = () =>{
        board.printBoard();
        console.log(getActivePlayer().name + " turn...");
    }

    const playRound = (row, slot)=>{
        board.setPlay(row, slot, getActivePlayer().token);
        switchPlayerTurn();
        printNewRound();
    };

    printNewRound();

    return {getActivePlayer, playRound};
}

const game = new GameController();