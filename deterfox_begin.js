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

PriorityQueue.prototype.push = function(endTime, cb, params, flag) {
    priority = +endTime;
    for (var i = 0; i < this.data.length && this.data[i][0] < priority; i++);
    if(flag == 1)this.data.splice(i, 0, [priority, cb, params, flag]);
    else{
	if(i < this.data.length && this.data[i][0] == priority && this.data[i][3] == 1)this.data[i] = [priority, cb, params, flag];
	else this.data.splice(i, 0, [priority, cb, params, flag]);
    }
}

PriorityQueue.prototype.pop = function() {
    return this.data.shift();
}

PriorityQueue.prototype.size = function() {
    return this.data.length;
}

PriorityQueue.prototype.top = function() {
    return this.data[0];
}

//declaration for event queue
var __event_queue__ = new PriorityQueue();

var __event_begin__ = function(endTime){
    __event_queue__.push(endTime, null, null, 1);
}

var __event_end__ = function(endTime, cb, params){
    __event_queue__.push(endTime, cb, params, 0);
}

var old_setTimeout = setTimeout;
setTimeout = function(cb, delay, ...params){
    __event_begin__(__counter__ + 100);
    old_setTimeout(__event_end__, delay, __counter__ + 100, cb, params);
}

//run event queue
var dispatch = function(){
    if(__event_queue__.size() > 0 && __event_queue__.top()[3] == 0){
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
