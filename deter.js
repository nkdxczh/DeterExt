// Our global counter variable
var __counter__ = 0;

// Override for the performance.now function - increments and returns our counter
var old_performance = performance.now;
performance.now = function(){
    __counter__++;
    return __counter__;
}

/** The PriorityQueue class containing our queue structure */
function PriorityQueue() {
    this.data = [];
}

/**
 * Push a new callback object to our queue. If it is flag 1, it will be inserted after all lower priorities. If it is flag 0,
 * it may either be inserted after all lower/equal priorities, OR replace an element with flag 1 of the same priority.
 */
PriorityQueue.prototype.push = function(endTime, cb, params, flag) {
    var priority = +endTime;
    var i = 0;

    // Get the index of the first element in the queue with priority greater than the one given
    for (; i < this.data.length && this.data[i][0] < priority; i++);

    // If flag of element to insert is 1, insert the element before
    if (flag === 1) {
        this.data.splice(i, 0, [priority, cb, params, flag]);
        return;
    }

    // Get index of first element that has a greater priority, OR same priority with flag 1 (whichever comes first)
    for (; i < this.data.length && this.data[i][0] === priority && this.data[i][3] === 0; i++);

    // If element at index has same priority and flag 1, replace it with this element of flag 0
    // Otherwise, insert the new element before index i
    if (i < this.data.length && this.data[i][0] === priority && this.data[i][3] === 1) {
        this.data[i] = [priority, cb, params, flag];
    }
    else {
        this.data.splice(i, 0, [priority, cb, params, flag]);
    }

}

/** Remove the first element of the queue and return it. */
PriorityQueue.prototype.pop = function() {
    return this.data.shift();
}

/** Return the number of elements in the queue. */
PriorityQueue.prototype.size = function() {
    return this.data.length;
}

/** Get the first element of the queue. */
PriorityQueue.prototype.top = function() {
    return this.data[0];
}

// Create our queue
var __event_queue__ = new PriorityQueue();


/**
 * Push an element of flag 1 to the queue that will block queue execution when at the head. 
 * Also, push an empty element with a priority of the current timestamp and a flag of 2 to the queue.
 * Therefore, every time this function is called, the counter is incremented.
 */
var __event_begin__ = function(endTime, cb, params){
    if (endTime !== endTime) {
        return;
    }
    //console.log('push',endTime, cb, params);
    __event_queue__.push(endTime, cb, params, 1);
    __event_queue__.push(old_performance.call(performance), null, null, 2); 
}

/**
 * Push an element of flag 0 to the queue that will be ran immediately when at the head of the queue.
 * Note: This may be used to replace an element previously inserted with flag 1.
 */
var __event_end__ = function(endTime, cb, params){
    __event_queue__.push(endTime, cb, params, 0); 
    __deter_dispatch__(0);
}



// Override setTimeout to, after the delay specified, push the callback given to our queue
var old_setTimeout = setTimeout;
setTimeout = function(cb, delay, params){
    if (delay === undefined || delay <= 0) {
        // Use the old settimeout handler for these special cases
        return old_setTimeout(cb, delay, params);
    }

    var endTime = __counter__ + delay;
    if (typeof endTime != 'number') {
        // Use old settimeout handler for this special case
        return old_setTimeout(cb, delay, params);
    }

    //__event_begin__(endTime, cb, arguments );
    //console.log('ST begin',endTime, this, cb, params);

    // Push this function to our queue with flag 0 after the delay specified
    var setTimeoutcb = function(){
        //console.log('ST end', endTime, cb, params);
        __event_end__(endTime, cb, params);
    }
    return old_setTimeout(setTimeoutcb, delay);
}


/**
 * Loop through popping elements off the front of our queue. If the element has flag 0, run its callback immediately.
 * If the element has flag 2, it is a timestamp and we should update our counter to match it. When we reach an element of flag 1,
 * pop it if dispatch was called with a flag of 2 and continue looping, otherwise, do nothing and STOP looping.
 */
var __deter_dispatch__ = function(flag) {

    while (__event_queue__.size() > 0) {
        refresh();  // Make sure that our overrides are in effect

        // If the first element has flag 0, pop and run the callback, and assign counter to its priority
        if (__event_queue__.top()[3] === 0) {
            var e = __event_queue__.pop();
            __counter__ = e[0];

            //console.log('pop',__event_queue__.size(), e);
            if (e[1] != null) {
                try {
                    e[1].apply(null, e[2]);
                } catch(err) {
                    console.log(err);
                }
            }
        }
        // If first element has flag 2, it is simply a timestamp to move our counter forward
        else if (__event_queue__.top()[3] === 2) {
            var e = __event_queue__.pop();
            if (e[0] > __counter__) {
                __counter__ = e[0];
            }
        }
        // Otherwise, if dispatch was called with flag 2, pop the first element. Otherwise, break.
        else {
            if (flag === 2) {
                __event_queue__.pop();
            }
            else {
                //console.log('block ', __event_queue__.top()[0]);
                break;
            }
        }
    }

    // If our queue is empty and we didn't call dispatch with flag 1, report a window error and re-call with flag 1
    if (flag != 1 && __event_queue__.size() === 0) {
        __deter_last__();
    }
    //old_setTimeout(__deter_dispatch__,1000,1);
}

// An array for window.onerror, and a variable for holding the old window.onerror() function for when we override it
var __deter_window_onerror__ = [];
var old_windowonerror;


// Override the Element.appendChild function to safely execute for typical targets of attacks:
// appending images and script elements to a page
var old_appendChild = Element.prototype.appendChild;
Element.prototype.appendChild = function(){

    // If the element being appended is not of concern, do it the old way
    if (arguments[0].tagName != 'SCRIPT' && arguments[0].tagName != 'IMG') {
        return old_appendChild.apply(this, arguments);
    }

    // Average duration to append an element to the page we want to show every time
    var avgDuration = 10;

    // Append the blocking element with flag 1 to the queue
    arguments[0].endTime = __counter__ + avgDuration;
    __event_begin__(arguments[0].endTime, 'appendChild', arguments);

    var old_onload_handler = arguments[0].onload;

    // Override what to do when the element loads on the page
    arguments[0].onload = function() {
        window_onerror = [null, null];
        if (__deter_window_onerror__.length > 0) {
            window_onerror = __deter_window_onerror__.pop();
        }

        //old_onload_handler = null;
        var cb = function(){
            onerror_handler = arguments[0];
            onerror_arguments = arguments[1];
            onload_handler = arguments[2];
            onload_arguments = arguments[3];
            window_ptr = arguments[4];
            ele_ptr = arguments[5];
            if (onerror_handler != null) {
                onerror_handler.apply(window_ptr, onerror_arguments);
            }
            if (onload_handler != null) {
                onload_handler.apply(ele_ptr, onload_arguments);
            }
        }
        var params = [window_onerror[0], window_onerror[1], old_onload_handler, arguments, window, this];
        __event_end__(this.endTime, cb, params);
    }

    var old_onerror_handler = arguments[0].onerror;

    arguments[0].onerror = function() {
        __event_end__(this.endTime, old_onerror_handler, arguments);
    }

    return old_appendChild.apply(this, arguments);
}

// The string versions of all of the overridden functions below
var __deter_requestAnimationFrame_func__;
var __deter_windowonerror_func__;
var __deter_postMessage_func__;
var __deter_onmessage_func__;
var __deter_onmessage_endTime__;

/** Re-override all necessary functions, just in case things have changed */
var refresh = function() {

    if (__deter_requestAnimationFrame_func__ !== requestAnimationFrame.toString()) {

        var __deter_old_requestAnimationFrame__ = requestAnimationFrame;
        requestAnimationFrame = function(cb) {
            var time = 100;
            var __deter_animation_time__ = __counter__ + time;
            __event_begin__(__deter_animation_time__, 'requestAnimationFrame', null);
            var __deter_cb__ = function() {
                __event_end__(__deter_animation_time__, cb, [__counter__]);
            }
            return __deter_old_requestAnimationFrame__(__deter_cb__);
        }
        __deter_requestAnimationFrame_func__ = requestAnimationFrame.toString();
    }

    if (window.onerror !== null && __deter_windowonerror_func__ !== window.onerror.toString()) {
        old_windowonerror = window.onerror;
        window.onerror = function() {
            __deter_window_onerror__.push([old_windowonerror, arguments]);
        }
        __deter_windowonerror_func__ = window.onerror.toString();
    }

    if (__deter_postMessage_func__ !== postMessage.toString()) {

        var __deter_old_postMessage__ = postMessage;
        postMessage = function() {
            if (arguments[0] != window && arguments[0] != 0) {
                return __deter_old_postMessage__.apply(this,arguments);
            }
            var time = 100;
            __deter_onmessage_endTime__ = __counter__ + time;
            refresh();

            //__event_end__(__counter__, __deter_old_postMessage__, arguments);
            return __deter_old_postMessage__.apply(this,arguments);
        }
        __deter_postMessage_func__ = postMessage.toString();
    }

    if (window.onmessage === null || __deter_onmessage_func__ !== window.onmessage.toString()) {

        var __deter_old_onmessage__ = window.onmessage;
        window.onmessage = function() {
            //console.log('onmessage ', __deter_onmessage_endTime__ ,arguments, __deter_old_onmessage__);
            __event_end__(__deter_onmessage_endTime__, __deter_old_onmessage__, arguments);
        }
        __deter_onmessage_func__ = onmessage.toString();
    }

}

// Perform all of our overrides
refresh();

var __deter_last__ = function(){
        while (__deter_window_onerror__.length > 0) {
            window_onerror = __deter_window_onerror__.pop();
            __event_end__(9999999, window_onerror[0], window_onerror[1]);
        }
        __deter_dispatch__(1);
}

// Kick off our dispatch method after 30 seconds
old_setTimeout(__deter_dispatch__, 30000, 2);
