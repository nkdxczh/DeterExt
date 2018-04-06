/**
 * This function returns a counter representing the number of iterations
 * until performance.now's next tick. Therefore, the larger the counter
 * returned, the shorter amount of time it took the action timed to execute.
 * 
 * Note: To use this timer, first call TTTtimer before the FAST code you want to
 * time. Then call this function again directly after. The counter from THAT
 * call is the result.
 */
function TTTcounter() {
  let counter = 0;
  let startTime = performance.now();
  while (startTime == performance.now()) {
    counter++;
  }
  return counter;
}


/**
 * This function returns a counter representing the number of iterations
 * performed in a seperate thread (web worker) until a given operation has finished.
 * The larger the counter, the longer the action took to execute.
 * 
 * @param func The function to time
 * @param params The parameters for the function
 */
function SMCcounter(func, ...params) {
  return new Promise(function(resolve) {
    // Create a new web worker
    let _worker = new Worker("webworker.js");

    func.apply(null, params);       // Run the code we wish to time
    console.log("Stopping");
    _worker.postMessage("stop");    // Stop the worker
    console.log(_worker.timer);
    _worker.terminate();
  });
}



/** Our attack code */
window.onload = function() {
  let myFunc = function(numRuns) {
    let dummy = 0;
    for (let i = 0; i < numRuns; i++) {
      dummy += Math.random();
    }
    return dummy;
  }
  let SMCPromise = SMCcounter(myFunc, 1000);
  SMCPromise.then(function(res) {
    console.log("WE OUT!!!");
  });
}