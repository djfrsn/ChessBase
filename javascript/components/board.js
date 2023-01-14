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
// -

class ChessBoard extends HTMLElement {
  constructor() {
    super();

    // init board array
    // the idea is to create a 2d array of objects that represent the board
    // each object will have a position, color, and piece
    // position = [row, column]
    // color = 'white' or 'black'
    // piece = null or a piece object

    // create a 8x8 2d array
    const board = []

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
    const pieceLayout = boardLayout.split('/')

    for (let i = 0; i < pieceLayout.length; i++) {
      let fileIndex = 0
      for (let j = 0; j < pieceLayout[i].length; j++) {
        let char = pieceLayout[i][j]
        console.log('char', char)
        // let num = parseFloat(char)
        // if (!isNaN(num) && isFinite(num)) {
        //   fileIndex += Number(parseFloat(char))
        // } else {
        //   let colourIndex = char.toUpperCase() == char ? 0 : 1 // 0 = white, 1 = black
        //   let pieceIndex = this.pieceOrder.indexOf(char.toUpperCase())
        //   let texture = this.pieceTextures[pieceIndex][colourIndex]
        //   let sprite = new PIXI.Sprite(texture)
        //   let pos = new PIXI.Point(
        //     fileIndex * this.boardSize + this.boardSize * 0.5,
        //     rankIndex * this.boardSize + this.boardSize * 0.5
        //   )

        //   this.initPieceSprite(sprite, pos)
        //   fileIndex += 1
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