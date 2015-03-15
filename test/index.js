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

test("capture", function (t) {
  var s = new Screen({width: 10, height: 10})
  s.output(0, 0, "0123456789")
  s.output(1, 0, "0123456789")
  s.output(2, 0, "0123456789")
  s.output(3, 0, "0123456789")
  s.output(4, 0, "0123456789")
  s.output(5, 0, "0123456789")
  s.output(6, 0, "0123456789")
  s.output(7, 0, "0123456789")
  s.output(8, 0, "0123456789")
  s.output(9, 0, 1234567890)
  s.paint()
  s.output(0, 0, "A")
  s.output(1, 1, "B")
  s.output(2, 2, "C")
  s.output(3, 3, "D")
  s.output(4, 4, "E")
  s.output(5, 5, "F")
  s.output(6, 6, "G")
  s.output(7, 7, "H")
  s.output(8, 8, "I")
  s.output(9, 9, "J")
  s.paint()
  var contents = s.capture()
  s.clear()
  s.paint()
  t.equals(s.getChar(0, 0), " ")
  t.equals(s.getChar(0, 1), " ")
  t.equals(s.getChar(1, 1), " ")
  t.equals(s.getChar(1, 2), " ")
  t.equals(s.getChar(2, 2), " ")
  t.equals(s.getChar(2, 3), " ")
  t.equals(s.getChar(3, 3), " ")
  t.equals(s.getChar(3, 4), " ")
  t.equals(s.getChar(4, 4), " ")
  t.equals(s.getChar(4, 5), " ")
  t.equals(s.getChar(5, 5), " ")
  t.equals(s.getChar(5, 6), " ")
  t.equals(s.getChar(6, 6), " ")
  t.equals(s.getChar(6, 7), " ")
  t.equals(s.getChar(7, 7), " ")
  t.equals(s.getChar(7, 8), " ")
  t.equals(s.getChar(8, 8), " ")
  t.equals(s.getChar(8, 9), " ")
  t.equals(s.getChar(9, 9), " ")
  t.equals(s.getChar(9, 1), " ")
  s.output(0, 0, contents)
  s.paint()
  t.equals(s.getChar(0, 0), "A")
  t.equals(s.getChar(0, 1), "1")
  t.equals(s.getChar(1, 1), "B")
  t.equals(s.getChar(1, 2), "2")
  t.equals(s.getChar(2, 2), "C")
  t.equals(s.getChar(2, 3), "3")
  t.equals(s.getChar(3, 3), "D")
  t.equals(s.getChar(3, 4), "4")
  t.equals(s.getChar(4, 4), "E")
  t.equals(s.getChar(4, 5), "5")
  t.equals(s.getChar(5, 5), "F")
  t.equals(s.getChar(5, 6), "6")
  t.equals(s.getChar(6, 6), "G")
  t.equals(s.getChar(6, 7), "7")
  t.equals(s.getChar(7, 7), "H")
  t.equals(s.getChar(7, 8), "8")
  t.equals(s.getChar(8, 8), "I")
  t.equals(s.getChar(8, 9), "9")
  t.equals(s.getChar(9, 9), "J")
  t.equals(s.getChar(9, 0), "1")
  s.cleanup()
  t.end()
})
