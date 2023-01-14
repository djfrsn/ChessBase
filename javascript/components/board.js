import jsxElem, { render} from '../third-party/jaredsartin-jsx-no-react.js';
import htm from 'https://unpkg.com/htm?module'
const html = htm.bind(jsxElem.createElement);


// Requirements:
// ✅ Draw the basic chess board squares 8x8 (use colors of your preference)
// - Draw the basic chess setup of the 16 pieces per side (see reference image below)
// - Use images or Unicode (https://www.i2symbol.com/symbols/chess) for pieces
// - Animate the display of the chess pieces (your animation of choice, but make the initial
// setup look and be engaging)
// - Create a button that triggers an event to “reset” the pieces and show the setup animation
// again

// Bonus:
// - set board state from array
// - mouse control
// - simple piece movement
// - show board coordinates

class ChessBoard extends HTMLElement {
  constructor() {
    super();

    // the idea is to create a 2d array of objects that represent the board
    // each object will have a position, color, and piece
    // position = [row, column]
    // color = 'white' or 'black'
    // piece = null or a piece object

    const board = []
    // create a 8x8 2d array
    // iterate 8 times for each row
    for (let i = 0; i < 8; i++) {
      // iterate 8 times for each column
      for (let j = 0; j < 8; j++) {
        board.push({
          // coordinates are i = row, j = column
          position: [i, j],
          // even squares are white, odd squares are black
          color: (i + j) % 2 === 0 ? 'white' : 'black',
          piece: null
        })
      }
    }

    this.board = board
    // init pieces based on FEN implementation in my paperchess project
    // piece placement | side to move | castling ability | en passant target square | halfmove clock | fullmove number -> learned from: https://www.chessprogramming.org/Forsyth-Edwards_Notation
    const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

    // split the FEN string into sections
    const boardLayout = fen.split(' ')[0]
    // rank8, rank7, rank6, rank5, rank4, rank3, rank2, rank1...rank per board row
    // rank8 = black top row major pieces
    // rank7 = black pawns
    // rank2 = white pawns
    // rank1 = white top row major pieces
    const rankLayout = boardLayout.split('/') // rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR = 8 ranks

    for (let rankIndex = 0; rankIndex < rankLayout.length; rankIndex++) {
      let fileIndex = 0 // column index
      for (let j = 0; j < rankLayout[rankIndex].length; j++) {
        // from rankLayout get the pieces at a given rankIndex, then the piece at a given fileIndex
        let char = rankLayout[rankIndex][j]

        let num = parseFloat(char)

        if (!isNaN(num) && isFinite(num)) {
          // if the character is a number, then skip that many squares
          // this is used to represent empty squares 8/8/8/8 or rn1qkbnr(your bishop has moved) for example
          fileIndex += Number(parseFloat(char))
        } else {
          // if we run into a character that is not a number, then we have a piece
          // get the x, y position of the piece based on curr rank/file
          let pos = [
            fileIndex,
            rankIndex
          ]
          this.board[fileIndex + rankIndex * 8].piece = char

          fileIndex += 1
        }
      }
    }
  }

  connectedCallback() {
    let boardElements = []
    // loop over board array and create a div for each square
    for (let i = 0; i < this.board.length; i++) {
      boardElements.push(html`<div class='square ${this.board[i].color}'></div>`)
    }

    render(html`<div>${boardElements.map(el => el)}</div>`, this);

    // Example event handler
    chessEvents.on('move', ({detail}) => {
      console.log(`Move event received: ${detail.from} -> ${detail.to}`);
    });
  }
}

customElements.define('chess-board', ChessBoard);