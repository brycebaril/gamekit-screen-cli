var test = require("tape")

var Screen = require("../screen.js")

test("errors", function (t) {
  t.throws(Screen)
  t.throws(function () {
    Screen(10)
  })
  t.throws(function () {
    Screen("cat", 20)
  })
  t.throws(function () {
    var s = Screen({width: 21, height: 8})
    s.output(21, 8, "NOPE")
  })
  t.throws(function () {
    var s = new Screen({width: 21, height: 8})
    s.output("cat", "dog", "meowf")
  })
  t.throws(function () {
    var s = new Scren({width: 21, height: 8})
    s.getChar("a", "b")
  })
  t.throws(function () {
    var s = new Screen({width: 21, height: 8})
    s.getChar(10, "B")
  })
  t.end()
})

test("simple", function (t) {
  var s = new Screen({width: 21, height: 8})
  t.ok(s instanceof Screen)
  t.equals(s.getChar(0, 0), " ")
  s.output(0, 0, "A")
  t.ok(s.needsPaint)
  t.equals(s.getChar(0, 0), "A")
  s.output(1, 20, "1234")
  t.equals(s.getChar(2, 0), "2")
  s.output(7, 20, "BYE")
  s.paint()
  s.clear()
  t.equals(s.getChar(0, 0), " ")
  s.paint()
  s.cleanup()
  t.end()
})
