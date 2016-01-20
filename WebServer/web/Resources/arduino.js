var $arduino = new function() {
    var self = this;
    var _activeHandler;

    this.calibrate = function() {
        this.writeToComPort("calibrate");
    };

    this.onMotorX = function(direction) {
        var str = direction == "left" ? "motorLeft:on" : "motorRight:on";
        this.writeToComPort(str);
    };

    this.offMotorX = function() {
        var str = "motorX:off";
        this.writeToComPort(str);
    };

    this.onMotorY = function(direction) {
        var str = direction == "up" ? "motorUp:on" : "motorDown:on";
        this.writeToComPort(str);
    };

    this.offMotorY = function() {
        var str = "motorY:off";
        this.writeToComPort(str);
    };


    this.onMotorZ = function(direction) {
        var str = direction == "up" ? "motorZUp:on" : "motorZDown:on";
        this.writeToComPort(str);
    };

    this.offMotorZ = function() {
        var str = "motorZ:off";
        this.writeToComPort(str);
    };

    this.moveXY = function(x, y) {
        var str = "moveXY:" + x + ":" + y;
        this.writeToComPort(str);
    };

    this.drawPoint = function(x, y) {
        var str = "drawPoint:" + x + ":" + y;
        this.writeToComPort(str);
    };

    this.drawLine = function(x1, y1, x2, y2) {
        var str = "drawLine:" + x1 + ":" + y1 + ":" + x2 + ":" + y2;
        this.writeToComPort(str);
    };

    this.writeToComPort = function(msg) {
        js.ajax.post(js.mvcUrl("Arduino", "WriteToComPort"), { msg: msg }, function() {
        });
    };

    this.print = function(arr, fn) {
        this._xxx = {};
        this._xxx._arr = arr;
        this._xxx._fn = fn;
        this._xxx.run = function() {
            if (this._item && this._fn) {
                this._fn(this._item.x,this._item.y);
            }
            var obj = this._arr.shift();
            this._item = obj;
            if (obj) {
                $arduino.writeToComPort("drawPoint:" + obj.x + ":" + obj.y);
            }
        }
        this._xxx.run();
    };

    this.subscribeToComPort = function() {
        var self = this;
        js.ajax.get(js.mvcUrl("ArduinoCommet", "ReceiveData"), function(res) {
            console.log("received data = " + res);
            if (res) {
                if (res == "@") {
                    if (self._xxx) {
                        self._xxx.run();
                    }
                }
                if (_activeHandler) {
                    _activeHandler();
                    _activeHandler = undefined;
                }
            }
            self.subscribeToComPort();
        }, self.subscribeToComPort);
    };

    this.subscribeToComPort();
};