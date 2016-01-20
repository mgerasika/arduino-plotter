
function bind(func,context) {
    var args = [];
    if (arguments.length >= 3) {
        for (var i = 2, len = arguments.length; i < len; ++i) {
            args.push(arguments[i]);
        }
    }
    return function() {
        if (args.length) {
            return func.apply(context, args);
        } else {
            return func.apply(context, arguments);
        }
    };
}

function hasClass(element, classname) {
    var cn = element.className;
    if (cn.indexOf(classname) != -1) {
        return true;
    }
    return false;
};

function addClass(element, classname) {
    var cn = element.className;
    if (cn.indexOf(classname) != -1) {
        return;
    }
    if (cn != '') {
        classname = ' ' + classname;
    }
    element.className = cn + classname;
};

function removeClass(element,classname) {
    var cn = element.className;
    var rxp = new RegExp("\\s?\\b" + classname + "\\b", "g");
    cn = cn.replace(rxp, '');
    element.className = cn;
};
