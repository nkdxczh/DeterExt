
var __counter__ = 0;

var old_performance = performance.now;
performance.now = function(){
    __counter__++;
    return __counter__;
}

function PriorityQueue() {
    this.data = [];
}

PriorityQueue.prototype.push = function(endTime, cb, params, flag) {
    var priority = +endTime;
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
    if(endTime !== endTime)return;
    //console.log('push',endTime, cb, params);
    __event_queue__.push(endTime, cb, params, 1);
    __event_queue__.push(old_performance.call(performance), null, null, 2); 
}

var __event_end__ = function(endTime, cb, params){
    __event_queue__.push(endTime, cb, params, 0); 
    __deter_dispatch__(0);
}

var old_setTimeout = setTimeout;
setTimeout = function(cb, delay, params){
    if(delay === undefined || delay <= 0){
        return old_setTimeout(cb, delay, params);
    }
    let endTime = __counter__ + delay;
    if(typeof endTime != 'number'){
        return old_setTimeout(cb, delay, params);
    }
    //__event_begin__(endTime, cb, arguments );
    //console.log('ST begin',endTime, this, cb, params);
    let setTimeoutcb = function(){
        //console.log('ST end', endTime, cb, params);
        __event_end__(endTime, cb, params);
    }
    return old_setTimeout(setTimeoutcb, delay);
}

var __deter_window_onerror__ = [];
var old_windowonerror;

var __deter_block__ = 0;

var __deter_dispatch__ = function(flag){

    while(__event_queue__.size() > 0){
        refresh();

        if(__event_queue__.top()[3] == 0){
            let e = __event_queue__.pop();
            __counter__ = e[0];
            //console.log('pop',__event_queue__.size(), e);
            let cb = e[1];
            let params = e[2];
            //if(cb != null)cb.apply(this, params);
            if(cb != null){
                try{
                    cb.apply(null, params);
                }catch(err) {
                    console.log(err);
                }
            }
        }
        else if(__event_queue__.top()[3] == 2){
            let e = __event_queue__.pop();
            if(e[0] > __counter__)__counter__ = e[0];
        }
        else{
            if(flag == 2){
                __event_queue__.pop();
            }else{
                //console.log('block ', __event_queue__.top()[0]);
                break;
            }
        }
    }
    if(flag != 1 && __event_queue__.size() == 0)__deter_last__();
    //old_setTimeout(__deter_dispatch__,1000,1);
}

var old_appendChild = Element.prototype.appendChild;
Element.prototype.appendChild = function(){
    if(arguments[0].tagName != 'SCRIPT' && arguments[0].tagName != 'IMG')return old_appendChild.apply(this, arguments);
    duration = 10;

    arguments[0].endTime = __counter__ + duration;
    let mya = arguments;
    __event_begin__(arguments[0].endTime, 'appendChild', mya);

    var old_onload_handler = arguments[0].onload;

    arguments[0].onload = function(){
        if(__deter_window_onerror__.length > 0){
            window_onerror = __deter_window_onerror__.pop();
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

var __deter_requestAnimationFrame_func__;
var __deter_windowonerror_func__;
var __deter_postMessage_func__;
var __deter_onmessage_func__;

var __deter_onmessage_endTime__;

var refresh = function(){

    if(__deter_requestAnimationFrame_func__ !== requestAnimationFrame.toString()){

        var __deter_old_requestAnimationFrame__ = requestAnimationFrame;
        requestAnimationFrame = function(cb){
            var time = 100;
            let __deter_animation_time__ = __counter__ + time;
            __event_begin__(__deter_animation_time__, 'requestAnimationFrame', null);
            var __deter_cb__ = function(){
                __event_end__(__deter_animation_time__, cb, [__counter__]);
            }
            return __deter_old_requestAnimationFrame__(__deter_cb__);
        }
        __deter_requestAnimationFrame_func__ = requestAnimationFrame.toString();
    }

    if(window.onerror !== null && __deter_windowonerror_func__ !== window.onerror.toString()){
        old_windowonerror = window.onerror;
        window.onerror = function(){__deter_window_onerror__.push([old_windowonerror, arguments]);}
        __deter_windowonerror_func__ = window.onerror.toString();
    }

    if(__deter_postMessage_func__ !== postMessage.toString()){

        var __deter_old_postMessage__ = postMessage;
        postMessage = function(){
            if(arguments[0] != window && arguments[0] != 0)return __deter_old_postMessage__.apply(this,arguments);
            var time = 100;
            __deter_onmessage_endTime__ = __counter__ + time;
            refresh();

            //__event_end__(__counter__, __deter_old_postMessage__, arguments);
            return __deter_old_postMessage__.apply(this,arguments);
        }
        __deter_postMessage_func__ = postMessage.toString();
    }

    if(window.onmessage == null || __deter_onmessage_func__ !== window.onmessage.toString()){

        var __deter_old_onmessage__ = window.onmessage;
        window.onmessage = function(){
            //console.log('onmessage ', __deter_onmessage_endTime__ ,arguments, __deter_old_onmessage__);
            __event_end__(__deter_onmessage_endTime__, __deter_old_onmessage__, arguments);
        }
        __deter_onmessage_func__ = onmessage.toString();
    }

}

refresh();

var __deter_last__ = function(){
        while(__deter_window_onerror__.length > 0){
            window_onerror = __deter_window_onerror__.pop();
            __event_end__(9999999, window_onerror[0], window_onerror[1]);
        }
        __deter_dispatch__(1);
}

old_setTimeout(__deter_dispatch__, 30000, 2);
