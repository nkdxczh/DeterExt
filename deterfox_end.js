/*for(var ele in ele_map){
    old_onabort = ele.onabort;
    ele.onabort = function(){
	console.log("onabort");
	console.log(ele.idx);
    }

    old_onerror = ele.onerror;
    ele.onerror = function(){
	console.log("onerror");
	console.log(ele);
    }

    old_onload = ele.onload;
    ele.onload = function(){
	console.log("onload");
	console.log(ele);
    }
    console.log(ele + ":" + ele_map[ele]);
}

var old_onerror = Element.prototype.onerror;
Element.prototype.onerror = function(){
	console.log(arguments);
	console.log(this);
	if(this in ele_map)console.log(this, ele_map[this]);
}*/

/*var old_onload = Element.prototype.onload;
Element.prototype.onload = function(){
	console.log("all onload " + this.idx);
	if(old_onload != null)old_onload.apply(arguments);
}*/

//var __deterfox_window_onerror__ = [];

/*var old_windowonerror = window.onerror;
window.onerror = function(){__deterfox_window_onerror__.push([old_windowonerror, arguments]);}*/
