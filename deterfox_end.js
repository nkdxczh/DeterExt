console.log("to end");

for(var ele in ele_map){
    console.log(ele.url);
    old_onerror = ele.onerror;
    ele.onerror = function(){
	console.log("onerror");
	console.log(ele);
        //__event_end__(ele_map[ele] + 100, old_onerror);
    }

    old_onload = ele.onload;
    ele.onload = function(){
	console.log("onload");
	console.log(ele);
        //__event_end__(ele_map[ele] + 100, old_onload);
    }
}

var old_onerror = Element.prototype.onerror;
Element.prototype.onerror = function(){
	console.log(arguments);
	console.log(this);
	if(this in ele_map)console.log(this, ele_map[this]);
}

var old_onload = Element.prototype.onload;
Element.prototype.onload = function(){
	console.log("onload " + arguments);
	console.log(this);
	if(this in ele_map)console.log(this, ele_map[this]);
}

var old_windowonerror = window.onerror;
window.onerror = function(){
	console.log(arguments);
	console.log(this);
	console.log(arguments.callee);

	old_windowonerror.apply(arguments);
}
