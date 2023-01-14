import jsxElem, { render} from '../third-party/jaredsartin-jsx-no-react.js';
import htm from 'https://unpkg.com/htm?module'
const html = htm.bind(jsxElem.createElement);

class ChessBoard extends HTMLElement {
  connectedCallback() {
    render(html`<h1>Render your board here!</h1>`, this);

    // Example event handler
    chessEvents.on('move', ({detail}) => {
      console.log(`Move event received: ${detail.from} -> ${detail.to}`);
    });
  }
}

customElements.define('chess-board', ChessBoard);