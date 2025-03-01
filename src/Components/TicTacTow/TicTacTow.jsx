import React, { useRef, useState, useEffect } from "react";
import "./TicTacTow.css";
import circle_icon from "../Assets/circle.png";
import cross_icon from "../Assets/cross.png";

let data = ["", "", "", "", "", "", "", "", ""];

const TicTacTow = () => {
  let [count, setCount] = useState(0);
  let [lock, setLock] = useState(false);
  let titleRef = useRef(null);
  let boxRefs = useRef(new Array(9).fill(null));

  const toggle = (e, num) => {
    if (lock || data[num] !== "") return;

    data[num] = "x";
    e.target.innerHTML = `<img src='${cross_icon}'>`;

    setLock(true);
    setCount(count + 1);
    if (!checkWin("x")) {
      setTimeout(cpuMove, 500);
    } else {
      setLock(false);
    }

  };

  const cpuMove = () => {
    if (lock) return;

    let bestMove = minimax(data, "o").index;
    data[bestMove] = "o";
    
    if (boxRefs.current[bestMove]) {
      boxRefs.current[bestMove].innerHTML = `<img src='${circle_icon}'>`;
    }

    setCount(count + 1);
    setLock(false);
    checkWin("o");
  };

  const minimax = (newData, player) => {
    let emptyCells = newData
      .map((val, index) => (val === "" ? index : null))
      .filter((val) => val !== null);

    if (checkWinner(newData, "x")) return { score: -10 };
    if (checkWinner(newData, "o")) return { score: 10 };
    if (emptyCells.length === 0) return { score: 0 };

    let moves = [];
    for (let i of emptyCells) {
      let move = { index: i };
      newData[i] = player;
      move.score = player === "o" ? minimax(newData, "x").score : minimax(newData, "o").score;
      newData[i] = "";
      moves.push(move);
    }

    let bestMove = moves.reduce((best, move) =>
      player === "o" ? (move.score > best.score ? move : best) : (move.score < best.score ? move : best)
    );

    return bestMove;
  };

  const checkWinner = (board, player) => {
    return (
      (board[0] === player && board[1] === player && board[2] === player) ||
      (board[3] === player && board[4] === player && board[5] === player) ||
      (board[6] === player && board[7] === player && board[8] === player) ||
      (board[0] === player && board[3] === player && board[6] === player) ||
      (board[1] === player && board[4] === player && board[7] === player) ||
      (board[2] === player && board[5] === player && board[8] === player) ||
      (board[0] === player && board[4] === player && board[8] === player) ||
      (board[2] === player && board[4] === player && board[6] === player)
    );
  };

  const checkWin = (player) => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];

    for (let pattern of winPatterns) {
      let [a, b, c] = pattern;
      if (data[a] === player && data[b] === player && data[c] === player) {
        won(player);
        return true;
      }
    }

    
    if (!data.includes("")) {
      titleRef.current.innerHTML = `It's a draw! You really thought you could beat this AI XD`;
      setLock(true);
      return true;
    }

    return false;
};


  const won = (winner) => {
    setLock(true);
    titleRef.current.innerHTML = `Congratulations: <img src=${winner === "x" ? cross_icon : circle_icon}> wins!`;
  };

  const reset = () => {
    setLock(false);
    data = ["", "", "", "", "", "", "", "", ""];
    titleRef.current.innerHTML = `Got what it takes to challenge AI? Have a go!`;
    boxRefs.current.forEach((box) => { if (box) box.innerHTML = ""; });
    setCount(0);
  };

  return (
    <div className="container">
      <h1 className="title">
        tic <span className="tac">tac</span>
        <span className="tow"> toe </span>
      </h1>
      <h2 className = "subtitle" ref = {titleRef}>
        Got what it takes to challenge AI? Have a go!
      </h2>
      <div className="board">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className="boxes"
            ref={(el) => (boxRefs.current[i] = el)}
            onClick={(e) => toggle(e, i)}
          ></div>
        ))}
      </div>
      <button className="reset" onClick={reset}>Try Again?</button>
      <div class="plaintext">
        <p>Confused? I thought so. How can a simple game of tic-tac-toe be this tricky to beat. Well, it's all maths and a simple algorithm behind it. The AI uses a algorithm which we call "minimax". Minimax is one of the
            fundemental algorithms to understand Game Theory for AI bots/CPUs. The tic-tac-toe is one the most basic demonstrations of this algorithm as this game has either 3 states/scenarios; A win, a draw or a loss.
            While both of the players attempt to do the best optimal move at each level, one player (e.g you) is trying to maximise it's chances of winning at each move, while the other (The CPU) is trying to minimize
            your utility. At each move, the CPU generates what we call a game tree recursively, and gives a score to each possible game state possible from that particular board state. A positive score would mean that the
            user is winning, a negetive score would mean that the CPU is winning, and a zero would mean that it is going towards a draw. The CPU would then backtrack towards the original position of the game again, and
            will choose the move that had the negetive most value, thus decreasing the chances of the player winning at each move of the game. This algorithm is mostly applicable on board games due to it's assumption that
            both players are having alternating moves and both players are trying to score the best optimal move at each level. Fascinating right?
        </p>
    </div>
    </div>
  );
};

export default TicTacTow;
