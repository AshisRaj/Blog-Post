const assert = require("assert");
const addKeyValue = require("../config/keys");

describe("addKeyValue", function () {
  it("should add a key-value pair to an object", function () {
    const obj = { foo: "bar" };
    const key = "baz";
    const value = 42;

    const result = addKeyValue.addKeyValue(obj, key, value);

    assert.deepEqual(result, { foo: "bar", baz: 42 });
  });

  it("should return the same object if the key already exists", function () {
    const obj = { foo: "bar", baz: 42 };
    const key = "baz";
    const value = 84;

    const result = addKeyValue.addKeyValue(obj, key, value);

    assert.deepEqual(result, { foo: "bar", baz: 84 });
  });
});