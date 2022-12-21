var EventEmmiter = /** @class */ (function () {
    function EventEmmiter() {
        this.eventObj;
    }
    EventEmmiter.prototype.subscribe = function (event, func) {
        if (event in this.eventObj) {
            for (var i = 0; i < this.eventObj[event].length; i++) {
                if (this.eventObj[event][i] === func) {
                    var deltedFun_1 = new unsubscribe(this.eventObj[event], func);
                    return { deltedFun: deltedFun_1 };
                }
            }
            this.eventObj[event].push(func);
        }
        else {
            this.eventObj[event] = [func];
        }
        var deltedFun = new unsubscribe(this.eventObj[event], func);
        return { deltedFun: deltedFun };
    };
    EventEmmiter.prototype.emit = function (event, eventOB) {
        var listFun = this.eventObj[event];
        for (var i = 0; i < listFun.length; i++) {
            listFun[i](eventOB);
        }
    };
    return EventEmmiter;
}());
var unsubscribe = /** @class */ (function () {
    function unsubscribe(eventListFun, funcToDel) {
        this.eventListFun = eventListFun;
        this.func = this.func;
    }
    unsubscribe.prototype.unsubscribe = function () {
        var index = this.eventListFun.indexOf(this.func);
        this.eventListFun.splice(index, 1);
        return this.eventListFun;
    };
    return unsubscribe;
}());
