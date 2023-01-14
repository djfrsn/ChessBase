// Basic event bus:
// object has on/off function bind that will take an event name and a callback
// object has once function bind that will take an event name and callback, only running on first matched event
// object has emit function to send an event with data to all bound listeners

export default class EventBus {
    constructor(description = '') { this.eventTarget = document.appendChild(document.createComment(description)); }
    on(type, listener) { this.eventTarget.addEventListener(type, listener); }
    once(type, listener) { this.eventTarget.addEventListener(type, listener, { once: true }); }
    off(type, listener) { this.eventTarget.removeEventListener(type, listener); }
    emit(type, detail) { return this.eventTarget.dispatchEvent(new CustomEvent(type, { detail })); }
}