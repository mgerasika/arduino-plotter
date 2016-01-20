var $hex = new function() {
    var self = this;
    this.width = 5;
    this.height = 7;
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

        self.refresh();
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
                self.refresh();
            }
        }
        ev.preventDefault();
        ev.stopPropagation();
    };

    this.refresh = function() {
        var vals = this.getVal();
        var str = "{";
        for (var i = 0, len = vals.length; i < len; ++i) {
            var s = vals[i];
            var hex = "0x" + parseInt(s, 2).toString(16).toUpperCase();
            str += hex;
            if (i < len - 1) {
                str += ",";
            }
        }
        str += "}"
        document.getElementById("result").value = str;
    };

    this.clear = function() {
        for (var y = 0; y < self.height; y++) {
            var str = ""; var row = _root.childNodes[y];
            for (var x = 0; x < self.width; x++) {
                var cell = row.childNodes[x];
                removeClass(cell, "cellSelected");
            }
        }
        self.refresh();
    };

    this.onMouseUp = function(ev) {
        _button = -1;
    };

    this.getVal = function() {
        var res = [];
        for (var y = 0; y < self.height; y++) {
            var str = ""; var row = _root.childNodes[y];
            for (var x = 0; x < self.width; x++) {
                var cell = row.childNodes[x];
                if (hasClass(cell, "cellSelected")) {
                    str += "1";
                }
                else {
                    str += "0";
                }
            }
            res.push(str);
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
                self.refresh();
            }
        }
    };

    window.addEventListener("load", self.init);
};
