//configurations for synchrounous defense
var __counter__ = 0;

var old_performance = performance.now;
performance.now = function(){
    __counter__ += 1;
    return __counter__;
}

//priority queue declaration
function PriorityQueue() {
    this.data = [];
}

PriorityQueue.prototype.push = function(endTime, cb, params) {
    priority = +endTime;
    for (var i = 0; i < this.data.length && this.data[i][1] > priority; i++);
    this.data.splice(i, 0, [priority, cb, params]);
}

PriorityQueue.prototype.pop = function() {
    return this.data.shift();
}

PriorityQueue.prototype.size = function() {
    return this.data.length;
}

//declaration for event queue
var __event_queue__ = new PriorityQueue();

var __event_end__ = function(endTime, cb, params){
    __event_queue__.push(endTime, cb, params);
}

var old_setTimeout = setTimeout;
setTimeout = function(cb, delay, ...params){
    old_setTimeout(__event_end__, delay, __counter__ + delay, cb, params);
}

//run event queue
var dispatch = function(){
    if(__event_queue__.size() > 0){
        var e = __event_queue__.pop();
        __counter__ = e[0];
        cb = e[1];
        params = e[2];
        cb.apply(params);
    }
    else{
        __counter__ += 1;
    }

    old_setTimeout(dispatch, 1);
}

dispatch();
