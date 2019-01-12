// Create a promise

let promise = new Promise((fulfill, reject) => {
  // After the timeout reaches 300ms, fulfill the promise with value
  // 'FULFILLED!'.
  
  setTimeout(fulfill, 300, 'FULFILLED!')
})

// Add a handler to the promise’s fulfillment. `console.log` will be called
// with the value passed to `fulfill`, which is `'FULFILLED!'`.
// Note that this statement will ALWAYS be executed before `fulfill` is
// called (we'll talk about this in depth in the lessons to come).

promise.then(console.log)