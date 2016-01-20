var $app = new function() {
    var self = this;
    this.width = 10;
    this.height = 10;
    var _button = -1;
    var _root;
    this.init = function() {
        _root = document.createElement("div");
        for (var y = 0; y < self.height; y++) {
            var row = document.createElement("div");
            row.setAttribute("class", "row");
            _root.appendChild(row);
            for (var x = 0; x < self.width; x++) {
                var cell = document.createElement("div");
                cell.setAttribute("class", "cell");
                row.appendChild(cell);
            }
        }
        document.getElementById("td1").appendChild(_root);
        _root.addEventListener("mousedown", self.onMouseDown);
        _root.addEventListener("mouseup", self.onMouseUp);
        _root.addEventListener("mouseover", self.onMouseOver);
    };

    this.onMouseDown = function(ev) {
        var el = ev.target;
        if (hasClass(el, "cell")) {
            console.log("md = " + ev.which);
            _button = ev.which;
            if (_button == 1) {
                if (!hasClass(el, "cellSelected")) {
                    addClass(el, "cellSelected");
                } else {
                    removeClass(el, "cellSelected");
                }
            }
        }
        ev.preventDefault();
        ev.stopPropagation();
    };

    this.onMouseUp = function(ev) {
        _button = -1;
    };

    this.getVal = function() {
        var res = [];
        for (var y = 0; y < self.height; y++) {
            var row = _root.childNodes[y];
            for (var x = 0; x < self.width; x++) {
                var cell = row.childNodes[x];
                if (hasClass(cell, "cellSelected")) {
                    var obj = {
                        y: y,
                        x: x
                    };
                    res.push(obj);
                }
            }
        }
        return res;
    };

    this.onMouseOver = function(ev) {
        var el = ev.target;
        if (hasClass(el, "cell")) {
            if (_button == 1 && (ev.which == 1)) {
                console.log("mo = " + ev.which);
                if (!hasClass(el, "cellSelected")) {
                    addClass(el, "cellSelected");
                } else {
                    removeClass(el, "cellSelected");
                }
            }
        }
    };

    window.addEventListener("load", self.init);
};


var $emulator = new function() {
    var self = this;
    var _root;
    var _cursor;

    var _x = 0;
    var _y = 0;
    var _z = 1;

    this.init = function() {
        _root = document.createElement("div");
        addClass(_root, "emulator");

        _cursor = document.createElement("div");
        addClass(_cursor, "cursor");

        for (var y = 0; y < $app.height; y++) {
            var row = document.createElement("div");
            row.setAttribute("class", "row");
            _root.appendChild(row);
            for (var x = 0; x < $app.width; x++) {
                var cell = document.createElement("div");
                cell.setAttribute("class", "cell");
                row.appendChild(cell);

                if (x == 0 && y == 0) {
                    cell.appendChild(_cursor);

                }
            }
        }
        document.getElementById("td2").appendChild(_root);
        _root.addEventListener("mousedown", self.onMouseDown);
        _root.addEventListener("mouseup", self.onMouseUp);
        _root.addEventListener("mouseover", self.onMouseOver);

    };
    window.addEventListener("load", self.init);

    this.moveX = function(x) {
        if (_x > x) {
            for (var i = _x - 1; i >= x; --i) {
                delay();
                var cell = getCellXY(i, _y);
                cell.appendChild(_cursor);
                
            }
        } else {
            for (var i = _x + 1; i <= x; ++i) {
                delay();
                var cell = getCellXY(i, _y);
                cell.appendChild(_cursor);
                
            }
        }
        _x = x;
    };

    this.moveY = function(y) {
        if (_y > y) {
            for (var i = _y - 1; i >= y; --i) {
                delay();
                var cell = getCellXY(_x, i);
                cell.appendChild(_cursor);
                
            }
        } else {
            for (var i = _y + 1; i <= y; ++i) {
                delay();
                var cell = getCellXY(_x, i);
                cell.appendChild(_cursor);
                
            }
        }
        _y = y;
    };

    this.moveZ = function(z) {
        if (_z > z) {
            for (var i = _z - 1; i >= z; --i) {
                delay();
            }
        } else {
            for (var i = _z + 1; i <= z; ++i) {
                delay();
            }
        }
        _z = z;
        if (z > 0) {
            addClass(_cursor, "cursor_up");
        }
        else {
            removeClass(_cursor, "cursor_up");
            draw();
        }
    };

    function getCellXY(x, y) {
        var row = _root.childNodes[y];
        var cell = row.childNodes[x];
        return cell;
    }

    function draw() {
        var cell = getCellXY(_x, _y);
        if (_z == 0) {
            addClass(cell, "fired");
            var n = cell.getAttribute("count");
            if (n == undefined || (n == NaN)) {
                n = 0;
            }
            cell.setAttribute("count", (++n));
            var r = 14 - (n * 2);
            var s = r.toString(16);
            cell.style.backgroundColor = "#" + s + s + s + s + s + s;
            cell.innerHTML = "p:" + n;
            cell.appendChild(_cursor);
        }
    };

    function delay() {
        js.ajax.postSync(js.mvcUrl("App", "Delay"), { miliseconds: 1000 }, function() {
        });
    };
};
function asyncArray() {
    var _arr = [];
    var _fn;
    this.addItem = function() {
        var args = [];
        for (var i = 0, len = arguments.length; i < len; ++i) {
            args.push(arguments[i]);
        }
        args.push(complete);
        _arr.push(bind.apply(this, args));
    };

    this.start = function(fn) {
        _fn = fn;
        complete();
    };
    function complete() {
        var fn1 = _arr.shift();
        if (fn1) {
            fn1();
        }
        else {
            if (_fn) {
                _fn();
            }
        }
    }
    
};
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
