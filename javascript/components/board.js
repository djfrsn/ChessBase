import jsxElem, { render} from '../third-party/jaredsartin-jsx-no-react.js';
import htm from 'https://unpkg.com/htm?module'
const html = htm.bind(jsxElem.createElement);

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

    console.log(board)
    this.board = board
    // init pieces
  }
  connectedCallback() {
    let boardElements = []
    // loop over board array and create a div for each square
    for (let i = 0; i < this.board.length; i++) {
      boardElements.push(html`<div class='square ${this.board[i].color}'></div>`)
    }

    render(html`${boardElements.map(el => el)}`, this);

    // Example event handler
    chessEvents.on('move', ({detail}) => {
      console.log(`Move event received: ${detail.from} -> ${detail.to}`);
    });
  }
}

customElements.define('chess-board', ChessBoard);