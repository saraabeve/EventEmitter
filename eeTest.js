const EventEmitter = require("./index.ts");

const sinon = require("sinon");
var assert = require("assert");
describe("scenario: one subscribe, one emit", function () {
  it("subscribe does not call the function", function () {
    const ee = new EventEmitter();
    const foo1 = sinon.fake();
    ee.subscribe("key1", foo1);
    assert(foo1.notCalled);
  });
  it("emit does call the function once", function () {
    const ee = new EventEmitter();
    const foo1 = sinon.fake();
    ee.subscribe("key1", foo1);
    ee.emit("key1");
    assert(foo1.calledOnce);
  });
});
describe("scenario: callback should receive event argument", function () {
  it("check", function () {
    const ee = new EventEmitter();
    const foo1 = sinon.fake();
    const arg = "arg";
    ee.subscribe("key1", foo1);
    ee.emit("key1", arg);
    assert(foo1.firstArg === arg);
  });
});
describe("scenario: three different keys, and three different functions", function () {
  let ee, foo1, foo2;
  const [key1, key2] = ["key1", "key2"];
  beforeEach(function () {
    ee = new EventEmitter();
    foo1 = sinon.fake();
    foo2 = sinon.fake();
    foo3 = sinon.fake();
  });
  it("subscribe and emit once on each should call function once", function () {
    ee.subscribe("key1", foo1);
    ee.subscribe("key2", foo2);
    ee.subscribe("key3", foo3);
    ee.emit("key2");
    assert(foo2.calledOnce);
    ee.emit("key1");
    assert(foo1.calledOnce);
    ee.emit("key3");
    assert(foo3.calledOnce);
  });
  it("subscribe on 3 functions, emit on 2", function () {
    ee.subscribe("key1", foo1);
    ee.emit("key1");
    assert(foo1.calledOnce);
    ee.subscribe("key2", foo2);
    ee.subscribe("key3", foo3);
    ee.emit("key2");
    assert(foo1.calledOnce);
    assert(foo2.calledOnce);
    assert(foo3.notCalled);
  });
});
describe("scenario: multiple functions on the same key", function () {
  it("key1 - 3 functions, key2 - 2 functions", function () {
    const ee = new EventEmitter();
    const [foo1, foo2, foo3, foo4, foo5] = [
      sinon.fake(),
      sinon.fake(),
      sinon.fake(),
      sinon.fake(),
      sinon.fake(),
    ];
    ee.subscribe("key1", foo1);
    ee.subscribe("key1", foo2);
    ee.subscribe("key2", foo4);
    ee.subscribe("key1", foo3);
    ee.subscribe("key2", foo5);
    ee.emit("key1");
    assert(foo1.calledOnce);
    assert(foo2.calledOnce);
    assert(foo3.calledOnce);
    ee.emit("key2");
    assert(foo4.calledOnce);
    assert(foo5.calledOnce);
  });
});
describe("scenario: emit on not subscribed", function () {
  it("subscribe does not call the function", function () {
    const ee = new EventEmitter();
    const foo1 = sinon.fake();
    ee.subscribe("key1", foo1);
    assert(foo1.notCalled);
  });
  it("emit does not call the function that not subscribed ", function () {
    const ee = new EventEmitter();
    const foo1 = sinon.fake();
    const foo2 = sinon.fake();
    ee.subscribe("key1", foo1);
    ee.subscribe("key2", foo1);
    ee.emit("key1");
    assert(foo2.notCalled);
  });
  it("emit does not call the function that not subscribed version 2", function () {
    const ee = new EventEmitter();
    const foo1 = sinon.fake();
    const foo2 = sinon.fake();
    ee.subscribe("key1", foo1);
    ee.subscribe("key2", foo1);
    ee.emit("key1");
    ee.emit("key1");
    assert(foo2.notCalled);
  });
});
describe("scenario: multiple emits", function () {
  it("one key, 4 emits", function () {
    const ee = new EventEmitter();
    const foo1 = sinon.fake();
    ee.subscribe("key1", foo1);
    ee.emit("key1");
    ee.emit("key1");
    ee.emit("key1");
    ee.emit("key1");
    assert(foo1.callCount == 4);
  });
  it("two keys, 2 emits every", function () {
    const ee = new EventEmitter();
    const [foo1, foo2] = [sinon.fake(), sinon.fake()];
    ee.subscribe("key1", foo1);
    ee.subscribe("key2", foo2);
    ee.emit("key1");
    ee.emit("key1");
    ee.emit("key2");
    ee.emit("key2");
    assert(foo1.calledTwice);
    assert(foo2.calledTwice);
  });
  it("two keys with two funcs each, 2 emits every", function () {
    const ee = new EventEmitter();
    const [foo1a, foo2a, foo1b, foo2b] = [
      sinon.fake(),
      sinon.fake(),
      sinon.fake(),
      sinon.fake(),
    ];
    ee.subscribe("key1", foo1a);
    ee.subscribe("key1", foo1b);
    ee.subscribe("key2", foo2a);
    ee.subscribe("key2", foo2b);
    ee.emit("key1");
    ee.emit("key1");
    ee.emit("key2");
    ee.emit("key2");
    for (foo of [foo1a, foo2a, foo1b, foo2b]) {
      assert(foo.calledTwice);
    }
  });
});
describe("scenario: unsubscribe", function () {
  it("no calls after unsubscribe", function () {
    const ee = new EventEmitter();
    const foo1 = sinon.fake();
    const s = ee.subscribe("key1", foo1);
    s.unsubscribe();
    ee.emit("key1");
    assert(foo1.notCalled);
  });
  it("no calls after unsubscribe - more complex check", function () {
    const ee = new EventEmitter();
    const [foo1, foo2, foo3] = [sinon.fake(), sinon.fake(), sinon.fake()];
    ee.subscribe("key1", foo1);
    const s = ee.subscribe("key1", foo2);
    ee.subscribe("key2", foo3);
    s.unsubscribe();
    ee.emit("key1");
    assert(foo1.calledOnce);
    assert(foo2.notCalled);
    assert(foo3.notCalled);
    ee.emit("key2");
    assert(foo3.calledOnce);
  });
});
