var $board = new function() {
    var self = this;
    this.width = 60;
    this.height = 40;
    this._instrument;
    this._els = [];

    var _root;
    this.init = function() {
        self._instrument = new pointInstrument();

        _root = document.createElement("div");
        for (var y = 0; y < self.height; y++) {
            var row = document.createElement("div");
            row.setAttribute("class", "row");
            _root.appendChild(row);
            for (var x = 0; x < self.width; x++) {
                var cell = document.createElement("div");
                cell.setAttribute("class", "cell");
                cell._x = x;
                cell._y = y;
                row.appendChild(cell);
            }
        }
        document.getElementById("board").appendChild(_root);
        js.attach(_root, "mousedown", js.bind(self.onMouseDown, self));
        js.attach(_root, "mouseup", js.bind(self.onMouseUp, self));
        js.attach(_root, "mouseover", js.bind(self.onMouseOver, self));
    };

    this.onMouseDown = function(ev) {
        this._instrument.onMouseDown(ev);
    };

    this.onMouseUp = function(ev) {
        this._instrument.onMouseUp(ev);
    };

    this.onMouseOver = function(ev) {
        this._instrument.onMouseOver(ev);
    };

    this.getEls = function() {
        return this._els;
    };

    this.getXY = function(el) {
        var obj = {x:0,y:0};
        obj.x = el._x;
        obj.y = el._y;
        
        return obj;
    };

    this.getVal = function() {
        var res = [];
        for (var y = 0; y < self.height; y++) {
            var row = _root.childNodes[y];
            for (var x = 0; x < self.width; x++) {
                var cell = row.childNodes[x];
                if (js.hasClass(cell, "cellSelected")) {
                    var obj = $board.getXY(cell);
                    res.push(obj);
                }
            }
        }
        return res;
    };

    this.drawPoint = function(x, y) {
        var row = _root.childNodes[y];
        var cell = row.childNodes[x];
        if (!js.hasClass(cell, "cellFired")) {
            js.addClass(cell, "cellFired");
        }
    };

    this.drawLine = function(x1, y1, x2, y2) {
    };

    window.addEventListener("load", self.init);
};

/*
instrumentBase
*/
function instrumentBase() {
};

instrumentBase.prototype.onMouseDown = function(ev) {
};

instrumentBase.prototype.onMouseUp = function(ev) {
};

instrumentBase.prototype.onMouseOver = function(ev) {
};

/*
pointInstrument
*/
function pointInstrument() {
    this._button = -1;
    pointInstrument.supper.constructor.call(this);
};

js.extend(pointInstrument, instrumentBase);

pointInstrument.prototype.onMouseDown = function(ev) {
    pointInstrument.supper.onMouseDown.call(this, ev);

    var el = ev.target;
    if (js.hasClass(el, "cell")) {
        console.log("md = " + ev.which);
        this._button = ev.which;
        if (this._button == 1) {
            if (!js.hasClass(el, "cellSelected")) {
                js.addClass(el, "cellSelected");

                var obj = $board.getXY(el);
                $board.getEls().push(obj);
            }
        }
    }

    ev.preventDefault();
    ev.stopPropagation();
};

pointInstrument.prototype.onMouseUp = function(ev) {
    pointInstrument.supper.onMouseUp.call(this, ev);

    this._button = -1;
};

pointInstrument.prototype.onMouseOver = function(ev) {
    pointInstrument.supper.onMouseOver.call(this, ev);

    var el = ev.target;
    if (js.hasClass(el, "cell")) {
        if (this._button == 1 && (ev.which == 1)) {
            console.log("mo = " + ev.which);
            if (!js.hasClass(el, "cellSelected")) {
                js.addClass(el, "cellSelected");

                var obj = $board.getXY(el);
                $board.getEls().push(obj);
            }
        }
    }
};

/*
lineInstrument
*/
function lineInstrument() {
    lineInstrument.supper.constructor.call(this);
};

js.extend(lineInstrument, instrumentBase);

lineInstrument.prototype.onMouseDown = function(ev) {
    lineInstrument.supper.onMouseDown.call(this, ev);

};

lineInstrument.prototype.onMouseUp = function(ev) {
    lineInstrument.supper.onMouseUp.call(this, ev);
};

lineInstrument.prototype.onMouseOver = function(ev) {
    lineInstrument.supper.onMouseOver.call(this, ev);
};