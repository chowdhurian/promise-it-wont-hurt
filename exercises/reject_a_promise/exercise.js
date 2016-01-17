var exercise = require('workshopper-exercise')();
var filecheck = require('workshopper-exercise/filecheck');
var execute = require('workshopper-exercise/execute');
var comparestdout = require('workshopper-exercise/comparestdout');
var wrappedexec = require('@timothygu/workshopper-wrappedexec');
var starttime = require('../../lib/starttime');
var endtime = require('../../lib/endtime');

var MINIMUM = 300;
var THRESHOLD = 100;

// checks that the submission file actually exists
exercise = filecheck(exercise);

// execute the solution and submission in parallel with spawn()
exercise = execute(exercise);

// start timer
exercise = starttime(exercise);

// end timer
exercise = endtime(exercise, THRESHOLD, MINIMUM);

// compare stdout of solution and submission
exercise = comparestdout(exercise);

// make sure Promise is available
// and wrap Promise with hooks used to check if the user used Promises as
// instructed
exercise = wrappedexec(exercise, 'all');
exercise.wrapModule(require.resolve('./wrap.js'));

// check if hooks have been activated
exercise.addVerifyProcessor(function (callback) {
  var ok = true;

  if (exercise.wrapData.usedPromise) {
    this.emit('pass', 'Used Promise constructor');
  } else {
    this.emit('fail', 'You didn\'t use the Promise constructor');
    ok = false;
  }

  if (exercise.wrapData.usedRejectWithError) {
    this.emit('pass', 'Used reject method with Error object');
  } else {
    ok = false;

    if (exercise.wrapData.usedReject) {
      this.emit('fail', 'You used reject method with a non-Error object');
    } else {
      this.emit('fail', 'You didn\'t use the reject method');
    }
  }

  if (exercise.wrapData.usedPrototypeThenSecondCb) {
    this.emit('pass', 'Used then method');
  } else {
    ok = false;

    if (exercise.wrapData.usedPrototypeThenFirstCb) {
      this.emit('fail',
        'Almost there! You added a success handler rather than a rejection ' +
        'handler to the promise in the `.then` call. Review the ' +
        'instructions, especially the Hints section.'
      );
    } else if (exercise.wrapData.usedPrototypeThen) {
      this.emit('fail',
        'You called `.then` without any callbacks. Review the last lesson ' +
        'on how to use `.then` if you need to.'
      );
    } else {
      this.emit('fail', 'You didn\'t use the `.then` method');
    }
  }

  process.nextTick(function () {
    callback(null, ok);
  });
});

module.exports = exercise;
