var $emulator = new function() {
    var self = this;
    this.width = 60;
    this.height = 60;
    this._instrument;

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
                row.appendChild(cell);
            }
        }
        document.getElementById("emulator").appendChild(_root);
    };

    this.drawPoint = function(x, y) {
        var row = _root.childNodes[y];
        var cell = row.childNodes[x];
        if (!js.hasClass(cell, "cellSelected")) {
            js.addClass(cell, "cellSelected");
        }
    };

    this.drawLine = function(x1, y1, x2, y2) {
    };

    window.addEventListener("load", self.init);
};