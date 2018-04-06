self.onmessage = function(e) {
    console.log("HEY");
    if (e.data === 'stop') {
        postMessage(counter);
        self.close();
    }
};

self.timer = 0;

self.timedCount = function() {
    self.timer++;
    console.log('HIT');
    setTimeout(timedCount, 1);
}

console.log("Worker Started");
self.timedCount();