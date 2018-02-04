//configurations for synchrounous defense
var __counter__ = 0;

var old_performance = performance.now;
performance.now = function(){
    //__counter__ += 1;
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
    __event_begin__(__counter__ + delay);
    old_setTimeout(__event_end__, delay, __counter__ + delay, cb, params);
}

var __deterfox_window_onerror__ = [];
var old_windowonerror;

//run event queue
var dispatch = function(){
    if(__event_queue__.size() > 0 && __event_queue__.top()[3] == 0){
        var e = __event_queue__.pop();
        __counter__ = e[0];
        cb = e[1];
        params = e[2];
        if(cb != null)cb.apply(this, params);
    }
    else if(__event_queue__.size() > 0 && __event_queue__.top()[3] == 1){
	if(__counter__ + 1 <= __event_queue__.top()[0])__counter__ += 1;
    }
    else{
        __counter__ += 1;
    }
    
    if(window.onerror + "" !== "function (){__deterfox_window_onerror__.push([old_windowonerror, arguments]);}"){
    	console.log("reset");
	old_windowonerror = window.onerror;
	window.onerror = function(){__deterfox_window_onerror__.push([old_windowonerror, arguments]);}
    }

    old_setTimeout(dispatch, 1);
}

dispatch();

var idx = 0
var __deterfox_label__ = function(){
	idx += 1;
	return idx;
}

var ele_map = {};

var old_appendChild = Element.prototype.appendChild;
Element.prototype.appendChild = function(){

	arguments[0].endTime = __counter__ + 100;
	__event_begin__(arguments[0].endTime);

	var old_onload_handler = arguments[0].onload;
	
	arguments[0].onload = function(){
		//console.log("all onload " + this.endTime);
		if(__deterfox_window_onerror__.length > 0)window_onerror = __deterfox_window_onerror__.pop();
		else window_onerror = [null, null];

		old_onload_handler = null;
		var cb = function(){
			onerror_handler = arguments[0];
			onerror_arguments = arguments[1];
			onload_handler = arguments[2];
			onload_arguments = arguments[3];
			if(onerror_handler != null)onerror_handler.apply(onerror_arguments);
			if(onload_handler != null)onload_handler.apply(onload_arguments);
		}
		var params = [window_onerror[0], window_onerror[1], old_onload_handler, arguments];
		__event_end__(this.endTime, cb, params);
	}

	old_appendChild.apply(this, arguments);
}
