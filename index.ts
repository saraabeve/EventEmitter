class EventEmmiter {
  public eventObj: { [key: string]: [Function] };
  constructor() {
    this.eventObj;
  }
  public subscribe(event: string, func: Function) {
    if (event in this.eventObj) {
      for (let i = 0; i < this.eventObj[event].length; i++) {
        if (this.eventObj[event][i] === func) {
          const deltedFun = new unsubscribe(this.eventObj[event], func);
          return { deltedFun };
        }
      }
      this.eventObj[event].push(func);
    } else {
      this.eventObj[event] = [func];
    }
    const deltedFun = new unsubscribe(this.eventObj[event], func);
    return { deltedFun };
  }

  public emit(event: string, eventOB: { string: String }) {
    const listFun = this.eventObj[event];
    for (let i = 0; i < listFun.length; i++) {
      listFun[i](eventOB);
    }
  }
}
class unsubscribe {
  public eventListFun: [Function];
  public func: Function;
  constructor(eventListFun: [Function], funcToDel: Function) {
    this.eventListFun = eventListFun;
    this.func = this.func;
  }
  unsubscribe() {
    const index = this.eventListFun.indexOf(this.func);
    this.eventListFun.splice(index, 1);
    return this.eventListFun;
  }
}
