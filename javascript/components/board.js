import jsxElem, { render} from '../third-party/jaredsartin-jsx-no-react.js';
import htm from 'https://unpkg.com/htm?module'
const html = htm.bind(jsxElem.createElement);


// Requirements:
// ✅ Draw the basic chess board squares 8x8 (use colors of your preference)
// ✅ Draw the basic chess setup of the 16 pieces per side (see reference image below)
// ✅ Use images or Unicode (https://www.i2symbol.com/symbols/chess) for pieces
// ✅ Animate the display of the chess pieces (your animation of choice, but make the initial
// setup look and be engaging)
// ✅ Create a button that triggers an event to “reset” the pieces and show the setup animation
// again

// Bonus:
// ✅ set board state from array
// - mouse control
// - simple piece movement

// TODO: fix chess board square size on smaller screens
// TODO: make the animation start with the major rank...then pawns

class ChessBoard extends HTMLElement {
  static startingFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  static pieceGraphics = {
    'r': '♜',
    'n': '♞',
    'b': '♝',
    'q': '♛',
    'k': '♚',
    'p': '♟︎',
    'R': '♖	',
    'N': '♘',
    'B': '♝',
    'Q': '♕',
    'K': '♔',
    'P': '♙',
  }
  constructor() {
    super();

    this
      .createBoard()
      .setPieces()
  }

  createBoard() {
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
          color: (i + j) % 2 === 0 ?  'white' : 'black',
          piece: null
        })
      }
    }

    this.board = board

    return this
  }

  setPieces() {
    // init pieces based on FEN implementation in my paperchess project -> https://github.com/djfrsn/paperchess
    // piece placement | side to move | castling ability | en passant target square | halfmove clock | fullmove number -> learned from: https://www.chessprogramming.org/Forsyth-Edwards_Notation
    // split the FEN string into sections
    const boardLayout = ChessBoard.startingFen.split(' ')[0]
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
          this.board[fileIndex + rankIndex * 8].piece = char

          fileIndex += 1
        }
      }
    }

    return this
  }

  connectedCallback() {
    let boardElements = []
    // loop over board array and create a div for each square
    for (let i = 0; i < this.board.length; i++) {
      boardElements.push(
        html`
        <div class='square ${this.board[i].color}'>
          <div class='piece ${this.board[i].piece === this.board[i].piece?.toUpperCase() ? 'white' : 'black'}'>
            ${this.board[i].piece ? ChessBoard.pieceGraphics[this.board[i].piece] : ''}
          </div>
        </div>
        `
      )
    }

    render(html`<div>${boardElements.map(el => el)}</div>`, this);

    // wait for the next frame
    requestAnimationFrame(() => {
      this.constructor.animatePieces()
    });

    // Example event handler
    chessEvents.on('move', ({detail}) => {
      console.log(`Move event received: ${detail.from} -> ${detail.to}`);
    });
  }

  static animatePieces() {
    // animate each two pieces from each rank at a time in a linear fashion -> from the middle pieces to the outside pieces

    // assume pieces are hidden

    // get starting indexes for four sets of pieces...rank8, rank7, rank2, rank1
    const blackPawnStartIndex = [11, 12]
    const whitePawnStartIndex = [51, 52]
    const blackMajorPieceStartIndex = [3, 4]
    const whiteMajorPieceStartIndex = [59, 60]
    const pieces = document.querySelectorAll('.piece')

    // loop over each set of pieces starting with the rank7, rank2 pawns
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 4; j++) {
        // get pieces at the starting index
        const blackPawnLPiece = pieces[blackPawnStartIndex[0] - j]
        const blackPawnRPiece = pieces[blackPawnStartIndex[1] + j]
        const whitePawnLPiece = pieces[whitePawnStartIndex[0] - j]
        const whitePawnRPiece = pieces[whitePawnStartIndex[1] + j]
        const whiteMajorLPiece = pieces[whiteMajorPieceStartIndex[0] - j]
        const whiteMajorRPiece = pieces[whiteMajorPieceStartIndex[1] + j]
        const blackMajorLPiece = pieces[blackMajorPieceStartIndex[0] - j]
        const blackMajorRPiece = pieces[blackMajorPieceStartIndex[1] + j]
        const pieceList = [
          blackPawnLPiece,
          blackPawnRPiece,
          whitePawnLPiece,
          whitePawnRPiece,
          whiteMajorLPiece,
          whiteMajorRPiece,
          blackMajorLPiece,
          blackMajorRPiece
        ]
        // add animation class to each piece
        // add inline animation delay for each piece
        pieceList
          .forEach(piece => {
            piece.classList.add('animate')
            const isPawn = piece.textContent === ChessBoard.pieceGraphics['p']
            || piece.textContent === ChessBoard.pieceGraphics['P']
            console.log(isPawn)
            // animate pawn pieces first, then major pieces
            piece.style.transitionDelay = `${(j * 0.2) + (isPawn ? 0 : 1)}s`
        })
      }
    }
  }

  static resetAnimation() {
    // remove animate class from each piece..this will trigger fade out on each piece
    const pieces = document.querySelectorAll('.piece')
    pieces.forEach(piece => {
      piece.classList.remove('animate')
      piece.style.transitionDelay = ''
    })

    // wait some time before animating again...allow time for the pieces to reset
    // use requestAnimationFrame here because...more fun and more effiecient
    const startAnimation = (timestamp) => {
      if (timestamp < 60) {
        requestAnimationFrame(() => startAnimation(timestamp + 1));
        return;
      }
      this.animatePieces()
    }

    startAnimation(0)
  }
}

customElements.define('chess-board', ChessBoard);

export default ChessBoard;