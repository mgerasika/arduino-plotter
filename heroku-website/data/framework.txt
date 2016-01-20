var js = {
    _doc: document,
    _uniqueIdx: 0,
    formatDate: function(date, addTime) {
        var today, dd, mm, yy, hh, m;
        if (date) {
            today = date;
        } else {
            today = new Date();
        }
        dd = today.getDate();
        mm = today.getMonth() + 1;
        yy = today.getFullYear();
        hh = today.getHours();
        m = today.getMinutes();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        if (m < 10) {
            m = '0' + m;
        }
        if (hh < 10) {
            hh = '0' + hh;
        }

        var separator = js.settings.inst().getDateSeparator();
        var today = mm + separator + dd + separator + yy;
        if (addTime) {
            today = today + ' ' + hh + ":" + m;
        }
        return today;
    },

    getSrcElement: function(ev) {
        var res;
        if (ev.explicitOriginalTarget) {
            res = ev.explicitOriginalTarget;
            if (!res.tagName) {
                res = res.parentNode;
            }
        } else if (ev.srcElement) {
            res = ev.srcElement;
        } else {
            res = ev.target;
        }
        return res;
    },

    getById: function(id, cont) {
        var res = null;
        if (!cont) {
            res = this._doc.getElementById(id);
        } else {
            if (cont.getElementById) {
                res = cont.getElementById(id);
            } else if (cont.children) {
                for (var i = 0, len = cont.children.length; i < len; ++i) {
                    var el = cont.children[i];
                    if (el.id == id) {
                        res = el;
                        break;
                    }
                    if (el.children.length) {
                        res = this.getById(id, el);
                        if (res) {
                            break;
                        }
                    }
                }
            }
        }
        return res;
    },

    getEventButton: function(ev) {
        var res = ev.button || ev.which;
        return res;
    },

    url: function(url) {
        var loc = js._doc.location;
        var virtualDirectory = window._virtualDirectory ? "/"
				+ window._virtualDirectory : "";
        var res = loc.protocol + '/' + '/' + loc.host + virtualDirectory + '/'
				+ url;
        return res;
    },

    mvcUrl: function(controller, view, id) {
        var res = controller + ".mvc";
        if (view) {
            res += "/" + view;
        }
        if (id) {
            res += "/" + id;
        }
        return this.url(res);
    },

    bind: function(func, context) {
        var args = [];
        if (arguments.length >= 3) {
            args.push(undefined); // event object insert here;
            for (var i = 2, len = arguments.length; i < len; ++i) {
                args.push(arguments[i]);
            }
        }
        return function() {
            js.assert(func);
            if (args.length) {
                // js.assert(1 == arguments.length);
                args[0] = arguments[0];
                return func.apply(context, args);
            } else {
                return func.apply(context, arguments);
            }
        };
    },

    attach: function(el, eventName, handler) {
        el = (typeof (el) == "string") ? this.getById(el) : el;
        js.assert(el);
        js.assert(el.tagName);
        el.addEventListener(eventName, handler, false);
        return handler;
    },

    detach: function(el, eventName, handler) {
        el.removeEventListener(eventName, handler, false);
    },

    addClass: function(el, className) {
        if (!this.hasClass(el, className)) {
            el.className += ' ' + className;
        }
    },

    removeClass: function(el, className) {
        if (this.hasClass(el, className)) {
            var regExp = new RegExp(className, "gi");
            el.className = el.className.replace(regExp, "");
        }
    },
    toogleClass: function(el, className) {
        if (this.hasClass(el, className)) {
            var regExp = new RegExp(className, "gi");
            el.className = el.className.replace(regExp, "");
        } else {
            el.className += ' ' + className;
        }
    },
    hasClass: function(el, className) {
        js.assert(el, "Element can't be empty.Class name is " + className);

        var elClass = el.className;
        var res = false;
        if (elClass) {
            var idx = elClass.indexOf(className);
            if (-1 != idx) {
                var str = elClass.substr(idx);
                if (str == className) {
                    res = true;
                } else {
                    var len = className.length;
                    if (str.length >= len) {
                        var lastChar = (str.length > len) ? str
								.charAt(className.length) : ' ';

                        str = str.substr(0, className.length);
                        if (str == className && lastChar == ' ') {
                            res = true;
                        }
                    }
                }
            }
        }
        return res;
    },

    contains: function(cont, el) {
        var res = false;
        if (cont == el) {
            res = true;
        } else {
            for (var i = 0, len = cont.children.length; i < len; ++i) {
                var item = cont.children[i];
                if (item == el) {
                    res = true;
                    break;
                } else if (item.children.length) {
                    res = this.contains(item, el);
                    if (res) {
                        break;
                    }
                }
            }
        }

        return res;
    },

    getByClass: function(cont, className) {
        var res = [];
        if (!cont.getElementsByClassName) {
            for (var i = 0, len = cont.children.length; i < len; ++i) {
                var item = cont.children[i];
                if (this.hasClass(item, className)) {
                    res[res.length] = item;
                } else if (item.children.length) {
                    var tmpRes = this.getByClass(item, className);
                    if (tmpRes && tmpRes.length) {
                        for (var j = 0, lenj = tmpRes.length; j < lenj; ++j) {
                            res[res.length] = tmpRes[j];
                        }
                    }
                }
            }
        } else {
            res = cont.getElementsByClassName(className);
        }
        return res;
    },

    getOneByClass: function(cont, className) {
        js.assert(this.getByClass(cont, className).length == 1);

        var res = js._processGetOneByClass(cont, className);
        return res;
    },

    _processGetOneByClass: function(cont, className) {
        var res = undefined;
        if (!cont.getElementsByClassName) {
            for (var i = 0, len = cont.children.length; i < len; ++i) {
                var item = cont.children[i];
                if (this.hasClass(item, className)) {
                    res = item;
                    break;
                } else if (item.children.length) {
                    var tmpRes = this._processGetOneByClass(item, className);
                    if (tmpRes) {
                        res = tmpRes;
                        break;
                    }
                }
            }
        } else {
            res = cont.getElementsByClassName(className)[0];
        }
        return res;
    },

    getByTagName: function(cont, tagName) {
        return cont.getElementsByTagName(tagName);
    },

    getByName: function(name) {
        var els = document.getElementsByName(name);
        return els;
    },

    getOneByTagName: function(cont, tagName) {
        var els = this.getByTagName(cont, tagName);
        js.assert(els.length == 1);
        return els[0];
    },

    getChildren: function(cont) {
        js.assert(cont.children);
        return cont.children;
    },

    getParent: function(cont, parentTagName) {
        var parNode = cont.parentNode;
        var res = null;
        if (!parentTagName) {
            res = parNode;
        } else {
            if (parNode.tagName.toLowerCase() == parentTagName) {
                res = parNode;
            } else if (parNode.tagName.toLowerCase() == 'body') {
                res = null;
            } else {
                res = this.getParent(parNode, parentTagName);
            }
        }
        return res;
    },

    getFirstChild: function(cont) {
        return this.getChildren(cont)[0];
    },

    cancelEvent: function(ev) {
        if (ev.preventDefault) {
            ev.preventDefault();
            ev.stopPropagation();
        }
        ev.returnValue = false;
    },

    extend: function(some, base) {
        var f = function() {
        };
        f.prototype = base.prototype;
        some.prototype = new f;
        some.prototype.constructor = some;
        some.supper = base.prototype;
    },

    generateId: function() {
        var id = "c_" + this._uniqueIdx++;
        this.assert(!this.getById(id));
        return id;
    },

    log: function(msg, level) {
    },

    assert: function(exp, msg) {
        if (!exp) {
            if (!msg) {
                msg = arguments.caller;
            }
            if (confirm("ASSERT:" + msg)) {
                debugger;
            }
        }
    }
};

js.json = function() {
    /*
    * convert json object to string.
    */
    this.serealize = function(json) {
        var str = '';

        var separator = js.settings.inst().getDateSeparator();

        if (!json) {
            str = null;
        } else if (json.getTime && json.setTime) {
            str = '"' + (json.getMonth() + 1) + separator + json.getDate()
					+ separator + json.getFullYear() + ' ' + json.getHours()
					+ ":" + json.getMinutes() + ":" + json.getSeconds() + '"';
        } else if (json.length == 0) {
            str = '[]';
        } else if (json.length > 0) {
            str = '[';
            for (var i = 0, len = json.length; i < len; ++i) {
                if (typeof (json[i]) == "object") {
                    str += js.json.serealize(json[i]) + ",";
                } else {
                    str += '"' + js.utils.escape(json[i]) + '"' + ",";
                }
            }
            if (str.length && str.charAt(str.length - 1) == ",") {
                str = str.substr(0, str.length - 1);
            }
            str += ']';
        } else {
            str = '{';
            for (var c in json) {
                var obj = json[c];
                if (typeof (obj) == "object") {
                    str += '"' + js.utils.escape(c) + '":'
							+ js.json.serealize(obj) + ',';
                } else if (typeof (obj) == "function") {
                } else {

                    if (undefined === obj) {
                        obj = null;
                    } else if ("string" == typeof (obj)) {
                        obj = '"' + js.utils.escape(obj) + '"';
                    } else if ("number" == typeof (obj)) {
                    } else if ("boolean" == typeof (obj)) {
                    } else if ("" == obj) {
                        obj = '""';
                    }

                    str += '"' + js.utils.escape(c) + '":' + obj + ',';
                }
            }
            if (str.length && str.charAt(str.length - 1) == ",") {
                str = str.substr(0, str.length - 1);
            }
            str += '}';
        }
        return str;
    };

    /*
    * convert string to json.
    */
    this.deserialize = function(str) {
        var obj = null;
        try {
            obj = eval("obj=" + str);
        } catch (e) {
        }
        obj = this._fixTypes(obj);
        return obj;
    };

    this._fixTypes = function(obj) {
        if (obj) {
            if (typeof (obj) == "object") {
                if (obj.length >= 0) {
                    for (var i = 0, len = obj.length; i < len; ++i) {
                        if (obj[i]) {
                            obj[i] = this._fixTypes(obj[i]);
                        }
                    }
                } else {
                    for (var name in obj) {
                        if (obj[name]) {
                            obj[name] = this._fixTypes(obj[name]);
                        }
                    }
                }
            }
            else if ((typeof (obj) == "string") && ((obj.search('/') == 2) || (-1 != obj.indexOf('Date')))) {
                obj = js.utils.parseDate(obj);
            }
        }
        return obj;
    };
};
js.json = new js.json();

js.ajax = function() {
    var _xmlHttpFactories = [function() {
        return new XMLHttpRequest();
    }, function() {
        return new ActiveXObject("Msxml2.XMLHTTP");
    }, function() {
        return new ActiveXObject("Msxml3.XMLHTTP");
    }, function() {
        return new ActiveXObject("Microsoft.XMLHTTP");
    } ];

    this.get = function(url, success, failed) {
        sendRequest("GET", url, undefined, success, failed, true);
    };

    this.post = function(url, data, success, failed) {
        var jsonData = js.json.serealize(data);
        sendRequest("POST", url, jsonData, success, failed, true);
    };

    this.getSync = function(url, success, failed) {
        sendRequest("GET", url, undefined, success, failed, false);
    };

    this.postSync = function(url, data, success, failed) {
        var jsonData = js.json.serealize(data);
        sendRequest("POST", url, jsonData, success, failed, false);
    };

    function sendRequest(method, url, postData, success, failed, async) {
        var req = createXMLHTTPObject();
        if (req) {
            var time = new Date();
            time = "time=" + time.getTime();
            
            if (!window.name) {
                window.name = guid();
            }
            var session = "SessionID=" + window.name;
            
            req.open(method, url + "?" + session + "&" + time, async);
            req.setRequestHeader('User-Agent', 'XMLHTTP/1.0');
            req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            if (postData) {
                req.setRequestHeader('Accept', 'application/json, text/javascript, */*');
                req.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
                //req.setRequestHeader("Content-length", postData.length);
                req.setRequestHeader("Cache-Control", "no-cache");
                req.setRequestHeader("Connection", "close");
            }
            req.onreadystatechange = function() {
                postData = undefined;

                if (req.readyState == 4) {
                    if (req.status == 200) {
                        if (success) {
                            var obj = js.json.deserialize(req.responseText);
                            var str = req.responseText;
                            req = undefined;
                            success(obj, str);
                        }
                    } else {
                        if (req.status == 500) {
                            if (failed) {
                                failed(req.responseText);
                            }
                        }
                        req = undefined;
                    }
                }
            };
            if (req.readyState != 4) {
                req.send(postData);
            }
        }
    };

    function createXMLHTTPObject() {
        var xmlhttp = "";
        for (var i = 0, len = _xmlHttpFactories.length; i < len; i++) {
            try {
                xmlhttp = _xmlHttpFactories[i]();
                break;
            } catch (e) {
            }
        }
        return xmlhttp;
    };
};
js.ajax = new js.ajax();

js.utils = function() {
    this.indexOf = function(arr, find, i /*opt*/) {
        var res = -1;
        if (i === undefined) {
            i = 0;
        }
        if (i < 0) {
            i += arr.length;
        }
        if (i < 0) {
            i = 0;
        }
        if (typeof (find) == "function") {
            for (var n = arr.length; i < n; i++) {
                if (i in arr && find(arr[i])) {
                    res = i;
                    break;
                }
            }
        }
        else {
            for (var n = arr.length; i < n; i++) {
                if (i in arr && arr[i] === find) {
                    res = i;
                    break;
                }
            }
        }
        return res;
    };

    this.contains = function(items, obj) {
        var res = false;
        if (typeof (obj) == "function") {
            for (var i = 0, len = items.length; i < len; ++i) {
                if (obj(items[i])) {
                    res = true;
                    break;
                }
            }
        } else {
            for (var i = 0, len = items.length; i < len; ++i) {
                if (items[i] == obj) {
                    res = true;
                    break;
                }
            }
        }
        return res;
    };

    this.htmlDecode = function(str) {
        if (str && (typeof (str) == "string")) {
            return str.replace(/&/g, '&amp;')
            //.replace(/<br>/g, '\r\n')
			.replace(/</g, '&lt;').replace(/"/g, '&quot;')
					.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
        return str;
    };

    this.htmlEncode = function(str) {
        if (str && (typeof (str) == "string")) {
            return str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(
					/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
            //.replace(/\r\n/g, '<br>');
        }
        return str;
    };

    this.escape = function(str) {
        if (str && (typeof (str) == "string")) {
            return str.replace(/[\\]/g, '\\\\').replace(/[\"]/g, '\\"')
					.replace(/[\/]/g, '\\/').replace(/[\b]/g, '\\b').replace(
							/[\f]/g, '\\f').replace(/[\n]/g, '\\n').replace(
							/[\r]/g, '\\r').replace(/[\t]/g, '\\t');
        }
        return str;
    };

    this.setTimeout = function(fn, time) {
        function handler() {
            if (window._res) {
                window.clearTimeout(window._res);
            }
            fn();
            fn = undefined;
            handler = undefined;
        }
        window._res = window.setTimeout(handler, time);
    };

    this.orderBy = function(array, field) {
        if (typeof (field) == "function") {
            array = array.sort(field);
        }
        else {
            array = array.sort(function(obj1, obj2) {
                if (obj1[field] > obj2[field]) {
                    return 1;
                }
                if (obj1[field] < obj2[field]) {
                    return -1;
                }
                return 0;
            });
        }
        return array;
    },

	this.orderByDesc = function(array, field) {
	    if (typeof (field) == "function") {
	        array = array.sort(field);
	    }
	    else {
	        array = array.sort(function(obj1, obj2) {
	            if (obj1[field] > obj2[field]) {
	                return -1;
	            }
	            if (obj1[field] < obj2[field]) {
	                return 1;
	            }
	            return 0;
	        });
	    }
	    return array;
	},

	this.single = function(array, key, value) {
	    return this.where(array, key, value)[0];
	},

	this.filter = function(array, key, value) {
	    var res = [];
	    for (var i = 0, len = array.length; i < len; ++i) {
	        var val1 = array[i][key].toLowerCase();
	        var val2 = value.toLowerCase();
	        var isEqual = true;
	        for (var j = 0, len2 = val2.length; j < len2; ++j) {
	            if (val1[j] != val2[j]) {
	                isEqual = false;
	                break;
	            }
	        }
	        if (isEqual) {
	            res.push(array[i]);
	        }
	    }
	    return res;
	};

    this.where = function(array, key, value) {
        var res = [];
        js.assert(array);
        if (typeof (key) == "function") {
            for (var i = 0, len = array.length; i < len; ++i) {
                if (key(array[i], i)) {
                    res.push(array[i]);
                }
            }
        } else {
            for (var i = 0, len = array.length; i < len; ++i) {
                if (array[i][key] == value) {
                    res.push(array[i]);
                }
            }
        }
        return res;
    };

    this.remove = function(array, key, value) {
        var res = [];
        if (typeof (key) == "string") {
            for (var i = 0, len = array.length; i < len; ++i) {
                if (array[i][key] != value) {
                    res.push(array[i]);
                }
            }
        } else if (typeof (key) == "number") {
            for (var i = 0, len = array.length; i < len; ++i) {
                if (i != key) {
                    res.push(array[i]);
                }
            }
        } else if (typeof (key) == "function") {
            for (var i = 0, len = array.length; i < len; ++i) {
                if (!key(array[i])) {
                    res.push(array[i]);
                }
            }
        } else {
            for (var i = 0, len = array.length; i < len; ++i) {
                if (array[i] != key) {
                    res.push(array[i]);
                }
            }
        }
        while (array.length) {
            array.pop();
        }
        for (var i = 0, len = res.length; i < len; ++i) {
            array.push(res[i]);
        }
        return array;
    };

    this.clone = function(obj) {
        var newObj;

        if (obj && typeof (obj) == "object" && obj.getTime) {
            newObj = new Date();
            newObj.setTime(obj.getTime());
        } else if (!obj) {
            newObj = obj;
        } else if (obj.length >= 0 && typeof (obj) != "string") {
            newObj = [];
            for (var i = 0, len = obj.length; i < len; ++i) {
                newObj[i] = this.clone(obj[i]);
            }
        } else if (valType == "string" || valType == "number"
				|| valType == "boolean") {
            newObj = obj;
        } else {
            newObj = {};
            for (var c in obj) {
                var val = obj[c];
                var valType = typeof (val);
                if (val && val.clone) {
                    newObj[c] = val.clone();
                } else if (valType == "string" || valType == "number"
						|| valType == "boolean") {
                    newObj[c] = val;
                } else {
                    newObj[c] = this.clone(val);
                }
            }
        }

        return newObj;
    };

    this.toBool = function(val) {
        var res = false;
        if (val == 1 || val == true || val == "True" || val == "true") {
            res = true;
        }
        return res;
    };

    this.foreach = function(els, fn) {
        if (els && els.length) {
            for (var i = 0, len = els.length; i < len; ++i) {
                fn(els[i], i);
            }
        }
    };

    this.select = function(els, fn) {
        var res = [];
        if (els && els.length) {
            if (typeof (fn) == "function") {
                for (var i = 0, len = els.length; i < len; ++i) {
                    var o = fn(els[i], i);
                    res.push(o);
                }
            } else {
                for (var i = 0, len = els.length; i < len; ++i) {
                    var o = els[i][fn];
                    res.push(o);
                }
            }
        }
        return res;
    };

    this.copyStyle = function(stlDest, stlSource) {
        stlDest.minWidth = stlSource.minWidth;
        stlDest.maxWidth = stlSource.maxWidth;
        stlDest.width = stlSource.width;
        stlDest.display = stlSource.display;
        stlDest.textAlign = stlSource.textAlign;
    };

    this.equalsDate = function(date1, date2) {
        if (date1.getDate() == date2.getDate()
				&& date1.getMonth() == date2.getMonth()
				&& date1.getFullYear() == date2.getFullYear()) {
            return true;
        }
        return false;
    };

    this.parseDate = function(txt) {
        var res = null;
        if (txt) {
            if (txt.getFullYear && txt.getDate) {
                res = txt;
            } else if (-1 != txt.indexOf('Date')) {
                res = new Date(eval(txt.replace(/\/Date\((\d+)\)\//gi,
						"new Date($1)")));
            } else {
                var separator = js.settings.inst().getDateSeparator();

                var ymd = txt.split(separator); // year,month,day
                if (ymd.length == 3) {
                    try {
                        var month = parseInt(ymd[0], 10) - 1;
                        var day = ymd[1];

                        var idx = ymd[2].indexOf(' ');
                        var year = (idx != -1) ? ymd[2].substr(0, idx) : ymd[2];
                        var hms = (-1 == idx) ? [] : ymd[2].substr(idx).split(
								":"); // hours,minutes,secconds
                        var hours = hms[0] ? hms[0] : 0;
                        var minutes = hms[1] ? hms[1] : 0;
                        var seconds = hms[2] ? hms[2] : 0;
                        var date = new Date(year, month, day, hours, minutes,
								seconds);
                        res = date;
                    } catch (ex) {
                    }
                }
            }
        }
        if (res && res.toString() == "NaN") {
            res = "";
        }
        return res;
    };
};
js.utils = new js.utils();

/*
js.listener
*/
js.listener = function() {
    this._handlers = [];
};

js.listener.prototype.subscribe = function(callback) {
    this._handlers.push(callback);
};

js.listener.prototype.unsubscribe = function(callback) {
    js.utils.remove(this._handlers, callback);
};

js.listener.prototype.fire = function(arg) {
    var handlers = this._handlers;
    for (var i = 0, len = handlers.length; i < len; ++i) {
        var hnd = handlers[i];
        hnd(arg);
    }
};

/*
js.listenerList
*/
js.listenerList = function() {
    this._listeners = [];
};

js.listenerList.prototype._getListener = function(name) {
    return this._listeners[name];
};

js.listenerList.prototype.register = function(name) {
    js.assert(this._getListener(name) == undefined);
    var newListener = new js.listener();
    this._listeners[name] = newListener;
};

js.listenerList.prototype.unregister = function(name) {
    var lst = this._getListener(name);
    js.utils.remove(this._listeners, lst);
};

js.listenerList.prototype.subscribe = function(name, callback) {
    var lst = this._getListener(name);
    js.assert(lst, "Register listener first");
    lst.subscribe(callback);
};

js.listenerList.prototype.unsubscribe = function(name, callback) {
    var lst = this._getListener(name);
    js.assert(lst, "Register listener first");
    lst.unsubscribe(callback);
};

js.listenerList.prototype.fire = function(name, arg) {
    var lst = this._getListener(name);
    js.assert(lst, "Register listener first");
    lst.fire(arg);
};

js.listenerList.inst = function() {
    if (!js.listenerList._inst) {
        js.listenerList._inst = new js.listenerList();
    }
    return js.listenerList._inst;
};

js.array = function(arg) {
    this._id = arg ? arg.id : js.generateId();
    this._items = [];

    this._addItem = new js.listener();
    this._removeItem = new js.listener();
    this._listChange = new js.listener();
    this._itemChange = new js.listener();
};

js.array.prototype.addItem = function(item) {
    this._items.push(item);
    this._addItem.fire(item);
};

js.array.prototype.removeItem = function(item) {
    js.utils.remove(this._items, item);
    this._removeItem.fire(item);
};

js.array.prototype.setValue = function(items) {
    this._items = items;
    this.fireListChange();
};

js.array.prototype.findById = function(id) {
    var it = js.utils.single(this.getEnumerator(), "id", id);
    return it;
};

js.array.prototype.setItem = function(item) {
    //js.assert(js.utils.contains(this._items, function(el) { return el.id == item.id; }));

    for (var i = 0, len = this._items.length; i < len; ++i) {
        if (this._items[i].id == item.id) {
            this._items[i] = item;

            this.fireItemChange(item);
            break;
        }
    }
};

js.array.prototype.get = function(idx) {
    return this._items[idx];
};

js.array.prototype.getLength = function(idx) {
    return this._items.length;
};

js.array.prototype.getEnumerator = function() {
    return this._items;
};

js.array.prototype.subscribeAddItem = function(callback) {
    this._addItem.subscribe(callback);
};

js.array.prototype.subscribeRemoveItem = function(callback) {
    this._removeItem.subscribe(callback);
};

js.array.prototype.subscribeListChange = function(callback) {
    this._listChange.subscribe(callback);
};

js.array.prototype.subscribeItemChange = function(callback) {
    this._itemChange.subscribe(callback);
};

js.array.prototype.fireListChange = function() {
    this._listChange.fire(this._items);
};

js.array.prototype.fireItemChange = function(item) {
    this._itemChange.fire(item);
};

/*dateSeparator*/
js.settings = function() {
    this._separator = "/";
};

js.settings.prototype.getDateSeparator = function() {
    js.assert(this._separator.length == 1);
    return this._separator;
};

js.settings.prototype.setDateSeparator = function(separator) {
    this._separator = separator;
};

js.settings.inst = function() {
    if (!js.settings._inst) {
        js.settings._inst = new js.settings();
    }
    return js.settings._inst;
};

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
};

function guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
};