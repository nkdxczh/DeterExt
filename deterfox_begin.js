
var __counter__ = 0;

var old_performance = performance.now;
performance.now = function(){
    return __counter__;
}

function PriorityQueue() {
    this.data = [];
}

PriorityQueue.prototype.push = function(endTime, cb, params, flag) {
    priority = +endTime;
    var i = 0;
    for (; i < this.data.length && this.data[i][0] < priority; i++);
    if(flag == 1)this.data.splice(i, 0, [priority, cb, params, flag]);
    else{
        for(; i < this.data.length && this.data[i][0] == priority && this.data[i][3] == 0; i++);
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


var __event_queue__ = new PriorityQueue();

var __event_begin__ = function(endTime, cb, params){
    __event_queue__.push(endTime, cb, params, 1);
}

var __event_end__ = function(endTime, cb, params){
    __event_queue__.push(endTime, cb, params, 0);
}

var old_setTimeout = setTimeout;
setTimeout = function(cb, delay, params){
    var endTime = __counter__ + delay;
    __event_begin__(endTime, cb, params);
    var setTimeoutcb = function(){
        __event_end__(endTime, cb, params);
    }
    //old_setTimeout(__event_end__, delay, endTime, cb, params);
    old_setTimeout(setTimeoutcb, delay);
}

var __deterfox_window_onerror__ = [];
var old_windowonerror;


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

    if(window.onerror + '' !== 'function (){__deterfox_window_onerror__.push([old_windowonerror,arguments])}'){
        old_windowonerror = window.onerror;
        window.onerror = function(){__deterfox_window_onerror__.push([old_windowonerror, arguments]);}
    }

    old_setTimeout(dispatch, 1);
}

dispatch();

var old_appendChild = Element.prototype.appendChild;
Element.prototype.appendChild = function(){
    if(arguments[0].tagName != "SCRIPT" && arguments[0].tagName != "IMG")return old_appendChild.apply(this, arguments);
    duration = 10;

    arguments[0].endTime = __counter__ + duration;
    __event_begin__(arguments[0].endTime);

    var old_onload_handler = arguments[0].onload;

    arguments[0].onload = function(){
        if(__deterfox_window_onerror__.length > 0){
            window_onerror = __deterfox_window_onerror__.pop();
        }
        else window_onerror = [null, null];

        //old_onload_handler = null;
        var cb = function(){
            onerror_handler = arguments[0];
            onerror_arguments = arguments[1];
            onload_handler = arguments[2];
            onload_arguments = arguments[3];
            window_ptr = arguments[4];
            ele_ptr = arguments[5];
            if(onerror_handler != null)onerror_handler.apply(window_ptr, onerror_arguments);
            if(onload_handler != null)onload_handler.apply(ele_ptr, onload_arguments);
        }
        var params = [window_onerror[0], window_onerror[1], old_onload_handler, arguments, window, this];
        __event_end__(this.endTime, cb, params);
    }

    var old_onerror_handler = arguments[0].onerror;

    arguments[0].onerror = function(){
        __event_end__(this.endTime, old_onerror_handler, arguments);
    }

    return old_appendChild.apply(this, arguments);
}

var __deterfox_old_requestAnimationFrame__ = requestAnimationFrame;
requestAnimationFrame = function(cb){
    var time = 100;
    var __deterfox_animation_time__ = __counter__ + time;
    __event_begin__(__deterfox_animation_time__);
    var __deterfox_cb__ = function(){
        __event_end__(__deterfox_animation_time__, cb, [__deterfox_animation_time__]);
    }
    __deterfox_old_requestAnimationFrame__(__deterfox_cb__);
}
