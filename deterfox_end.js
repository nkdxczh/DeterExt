for(var ele in ele_map){
    old_onerror = ele.onerror;
    ele.onerror = function(){
        __event_end__(ele_map[ele] + 100, old_onerror);
    }

    old_onload = ele.onload;
    ele.onload = function(){
        __event_end__(ele_map[ele] + 100, old_onload);
    }
}
