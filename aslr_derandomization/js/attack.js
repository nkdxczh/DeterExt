/**
 * Example of the Time to Tick counter. This function waits until performance.now
 * ticks, and then runs the function given. We then count the number of iterations until
 * the next tick. Any difference to performance.now MINUS the number of iterations gives us
 * a more precise timer. Note that the returned value can be thought of as more of a counter,
 * and NOT a unit of time like us or ms.
 */
function TTTcounter(func, ...params) {
  let counter = 0;
  let startTime;
  let endTime;

  // Wait for the tick, and grab the starting time
  let perfCheck = performance.now();
  while ((startTime = performance.now()) === perfCheck) {}

  // Run the function to time
  func.apply(null, params);

  // Wait for the finalizing tick, grabbing the end time
  perfCheck = performance.now();
  while ((endTime = performance.now()) === perfCheck) {
    counter++;
  }

  // Return the difference in time, adjusted by the "time" until the next tick
  return (endTime - startTime) - counter;
}


/** Our attack code */
window.onload = function() {
  let myFunc = function(numIterations) {
    for(let i = 0; i < numIterations; i++) {
      console.log("sleeping...");
    }
  };

  let timeTook = TTTcounter(myFunc, 10);
  console.log("It took: " + timeTook);
}