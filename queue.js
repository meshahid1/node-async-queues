// queue.js

const EventEmitter = require('events');

class AsyncQueue extends EventEmitter {
  constructor() {
    super();
    this.queue = [];
    this.interval = 250;
    this.timerId = null;
    this.paused = false; // Initialize the paused flag as false
    this.listenForInterval(); // Call the method to start listening for the 'interval' event
  }

  enqueue(item) {
    if (this.isValidItem(item)) {
      this.queue.push(item);
      this.emit('enqueued', item);
    } else {
      throw new Error('Invalid item. Only Number, String, and Object are allowed.');
    }
  }

  peek() {
    if (this.queue.length > 0) {
      return this.queue[0];
    } else {
      return null;
    }
  }

  print() {
    return this.queue.slice();
  }

  getCurrentInterval() {
    return this.interval;
  }

  start() {
    if (!this.timerId) {
      this.paused = false; // Reset paused flag when starting
      this.timerId = setInterval(() => {
        if (this.queue.length > 0 && !this.paused) {
          const dequeuedItem = this.queue.shift();
          this.emit('dequeued', dequeuedItem);
        }
      }, this.interval);
    }

    // Add back the event listener for 'interval' when starting
    this.listenForInterval();
  }

  pause() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
      this.paused = true; // Set the paused flag
    }
  }

  listenForInterval() {
    this.on('interval', (data) => {
      if (data > 0) {
        this.interval = data;
        if (this.timerId) {
          clearInterval(this.timerId);
          this.timerId = setInterval(() => {
            if (this.queue.length > 0 && !this.paused) {
              const dequeuedItem = this.queue.shift();
              this.emit('dequeued', dequeuedItem);
            }
          }, this.interval);
        }
      }
    });
  }

  isValidItem(item) {
    return typeof item === 'number' || typeof item === 'string' || (typeof item === 'object' && item !== null);
  }
}

module.exports = AsyncQueue;
