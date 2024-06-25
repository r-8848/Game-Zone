let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn1");
const exitBtn = document.getElementById('exit-btn');
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let msg2= document.querySelector("#msg-2");
const startAIBtn = document.getElementById('start-ai-btn');
const startYOUBtn = document.getElementById('start-you-btn');
const quitBtn = document.getElementById('quit-btn');

let turnO = true; 
let count = 0; 
const winPatterns = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];


let board = [];


for (let i = 0; i < 3; i++) {
    
    let row = [];
    
    for (let j = 0; j < 3; j++) {
       
        row.push('');
    }

    board.push(row);
}

const music = document.getElementById('background-music');
music.volume = 0.5; // Adjust volume as needed
music.play();


const resetGame = () => {
  turnO = true;
  count = 0;
  enableBoxes();
  msgContainer.classList.add("hide");
  board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];
};


const newGame = () => {
  // Hide the message container
  // msgContainer.classList.add('hide');
  newGameBtn.classList.add('hide');
  exitBtn.classList.add('hide'); 
  msg2.classList.remove('hide');
  msg.innerText = 'Can You Beat the AI?';
  // Show the AI and self-start buttons
  startAIBtn.classList.remove('hide');
  startYOUBtn.classList.remove('hide');

};
quitBtn.addEventListener('click', function() {
  // Redirect to the home page
  window.location.href = 'home.html';
});


exitBtn.addEventListener('click', function() {
  // Redirect to the index page
  window.location.href = 'index.html';
});

startAIBtn.addEventListener('click', function() {
  startAIGame();
});

startYOUBtn.addEventListener('click', function() {
  startPlayerFirstGame();
});

function startAIGame() {
  turnO = true;
  count = 0;
  enableBoxes();
  msgContainer.classList.add("hide");
  startAIBtn.classList.add("hide");
  startYOUBtn.classList.add("hide");
  board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];
  if(count==0){
    bestmove();

    count++;

    isWinner = checkWinner();

    if (count === 9 && !isWinner) {
       gameDraw();
    }
  }
}

// Function to start player-first game
function startPlayerFirstGame() {
  turnO = true;
  count = 0;
  enableBoxes();
  msgContainer.classList.add("hide");
  startAIBtn.classList.add("hide");
  startYOUBtn.classList.add("hide");
  board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];
}

newGameBtn.addEventListener("click", newGame);
resetBtn.addEventListener("click", resetGame);


function enableHumanVsAI() {
  
  boxes.forEach((box, index) => {
    box.addEventListener("click", () => {
      
      let j = index % 3;
      let i = Math.floor(index / 3);
      box.innerText = "O";
      board[i][j] = 'O';
      turnO = false;
      box.disabled = true;
      count++;

      let isWinner = checkWinner();

      if (count === 9 && !isWinner) {
        gameDraw();
        return;
      }

      bestmove();

      count++;

      isWinner = checkWinner();

      if (count === 9 && !isWinner) {
        gameDraw();
      }
    });
  });
}

enableHumanVsAI();

const gameDraw = () => {
  msg.innerText = `It's a Draw.`;
  msgContainer.classList.remove("hide");
  newGameBtn.classList.remove('hide');
  exitBtn.classList.remove('hide'); 
  msg2.classList.add('hide');
  disableBoxes();
};

const disableBoxes = () => {
  for (let box of boxes) {
    box.disabled = true;
  }
};

const enableBoxes = () => {
  for (let box of boxes) {
    box.disabled = false;
    box.innerText = "";
  }
};

const showWinner = (winner) => {
  if(winner=='X'){
    msg.innerText = 'AI wins';
  }else{
    msg.innerText = 'You won';
  }
  
  msgContainer.classList.remove("hide");
  newGameBtn.classList.remove('hide');
  exitBtn.classList.remove('hide'); 
  msg2.classList.add('hide');
  disableBoxes();
};

const checkWinner = () => {
  for (let pattern of winPatterns) {
    let pos1Val = boxes[pattern[0]].innerText;
    let pos2Val = boxes[pattern[1]].innerText;
    let pos3Val = boxes[pattern[2]].innerText;

    if (pos1Val != "" && pos2Val != "" && pos3Val != "") {
      if (pos1Val === pos2Val && pos2Val === pos3Val) {
        showWinner(pos1Val);
        return true;
      }
      
    }
  }
};
const checkWinner_minimax = () => {
  for (let pattern of winPatterns) {
    let pos1Val = board[Math.floor(pattern[0] / 3)][pattern[0] % 3];
    let pos2Val = board[Math.floor(pattern[1] / 3)][pattern[1] % 3];
    let pos3Val = board[Math.floor(pattern[2] / 3)][pattern[2] % 3];

    if (pos1Val != "" && pos2Val != "" && pos3Val != "") {
      if (pos1Val === pos2Val && pos2Val === pos3Val) {
        return pos1Val;
      }
    }
  }
  

  let openSpots = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] == '') {
        openSpots++;
      }
    }
  }
  if (openSpots == 0) {
    return 'tie';
  }

  return "";
};

const bestmove = () => {
  let bestscore = -Infinity;
  let bestMove;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] == '') {
        board[i][j] = "X";
        const initialAlpha = -Infinity;
        const initialBeta = Infinity;

        let score = minimax(0, false, initialAlpha, initialBeta);

        board[i][j] = '';
        if (score > bestscore) {
          bestscore = score;
          bestMove = { i, j };
        }
      }
    }
  }

  board[bestMove.i][bestMove.j] = "X";
  let index = 3 * (bestMove.i) + (bestMove.j);
  boxes[index].innerText = "X";
  boxes[index].disabled = true;
  turnO = true;
}

let scores = {
  'X': 1,
  'O': -1,
  'tie': 0,
}
const minimax = (depth, isMaximizing, alpha, beta) => {
  // base condition 
  let result = checkWinner_minimax();
  if (result !== "") {
    let score = scores[result];
    return score;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === '') {
          board[i][j] = "X";
          let score = minimax(depth + 1, false, alpha, beta);
          board[i][j] = "";
          bestScore = Math.max(score, bestScore);
          alpha = Math.max(alpha, score);
          if (beta <= alpha) {
            break;
          }
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === '') {
          board[i][j] = "O";
          let score = minimax(depth + 1, true, alpha, beta);
          board[i][j] = "";
          bestScore = Math.min(score, bestScore);
          beta = Math.min(beta, score);
          if (beta <= alpha) {
            break;
          }
        }
      }
    }
    return bestScore;
  }
};

