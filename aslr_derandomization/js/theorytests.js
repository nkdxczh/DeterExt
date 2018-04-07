/** Calculate the average number of loops we can fit into the time between increments to performance.now's return */
function performanceNowIncrementTest() {
    avg = 0;
    numRuns = 100;

    for (let i = 0; i < numRuns; i++) {
      counter = 0;
      startTime = window.performance.now();
      while (startTime == window.performance.now()) {
        counter++;
      }
      avg += counter;
    }

    return avg / numRuns;
}

// Output value to body of page
function outputToBody(outputString) {
  let newElem = document.createElement("p");
  newElem.innerHTML = outputString;
  document.body.appendChild(newElem);
}