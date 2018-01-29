var ele_map = {};

var old_appendChild = document.body.appendChild;
document.body.appendChild = function(obj){
    ele_map[obj] = __counter__;
    old_appendChild(obj);
}
