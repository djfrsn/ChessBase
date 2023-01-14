import jsxElem, { render, renderAppend } from '../third-party/jaredsartin-jsx-no-react.js';
import htm from 'https://unpkg.com/htm?module'
const html = htm.bind(jsxElem.createElement);

class ChessControls extends HTMLElement {
  connectedCallback() {
    // Replace contents with this render
    render(html`<h1>Chess Controls</h1>`, this);

    // Example events for moves
    // Render append will append the elements to the container
    renderAppend(html`<button onClick=${() => chessEvents.emit('move', {from: 'e7', to: 'e5'})}>Move e7 -> e5</button>`, this);
    renderAppend(html`<button onClick=${() => chessEvents.emit('move', {from: 'e2', to: 'e4'})}>Move e2 -> e4</button>`, this);
  }
}

customElements.define('chess-controls', ChessControls);