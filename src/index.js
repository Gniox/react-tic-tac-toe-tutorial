import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button className="square" onClick={props.onClick} style={props.style}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, color) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        key={i}
        style={{ background: color }}
      />
    );
  }

  createSquares() {
    console.log("array of winners: " + this.props.highlight);
    let rows = [];
    let i = 0;
    for (i; i < 3; i++) {
      let squares = [];
      for (let j = 0; j < 3; j++) {
        let value = 3 * i + j;
        if (
          this.props.highlight != null &&
          this.props.highlight.includes(value)
        ) {
          squares.push(this.renderSquare(value, "blue"));
        } else {
          squares.push(this.renderSquare(value, "white"));
        }
      }
      rows.push(
        <div className="board-row" key={i}>
          {squares}
        </div>
      );
    }
    return rows;
  }

  render() {
    return <div>{this.createSquares()}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      location: [],
      weight: "bold",
      descend: true,
      order: "Descending"
    };
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const location = this.state.location.slice(0, this.state.stepNumber);
    let coords = [];
    if (calculateWinner(squares).player || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    if (i === 0 || i === 1 || i === 2) {
      coords = [i + 1, 1];
    } else if (i === 3 || i === 4 || i === 5) {
      coords = [i - 2, 2];
    } else {
      coords = [i - 5, 3];
    }
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      location: location.concat([coords])
    });
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const location = this.state.location;

    let moves = history.map((step, move) => {
      const desc = move
        ? `go to move # ${move} (${location[move - 1]})`
        : "go to game start";
      console.log("This is move for descending: " + move);
      if (this.state.stepNumber === move) {
        return (
          <li key={move}>
            <button
              onClick={() => {
                this.jumpTo(move);
              }}
              style={{ fontWeight: this.state.weight }}
            >
              {desc}
            </button>
          </li>
        );
      } else {
        return (
          <li key={move}>
            <button
              onClick={() => {
                this.jumpTo(move);
              }}
            >
              {desc}
            </button>
          </li>
        );
      }
    });

    let status;
    if (winner.player) {
      status = "Winner: " + winner.player;
    } else if (moves.length === 10) {
      status = "Tie";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            highlight={winner.locations}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>
            {status}
            <button
              onClick={() => {
                this.setState({
                  descend: !this.state.descend,
                  order: !this.state.descend ? "Descending" : "Ascending"
                });
              }}
            >
              {this.state.order}
            </button>
          </div>
          <ol>{this.state.descend ? moves : moves.reverse()}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], locations: lines[i] };
    }
  }
  return { player: null, locations: null };
}
