module.exports = Screen

var ansi = require("ansi")
var cursor = ansi(process.stdout)
var xtend = require("xtend")

function Screen(options) {
  if (!(this instanceof Screen)) {
    return new Screen(options)
  }
  options = xtend({border: true}, options)

  if (options.width >>> 0 != options.width) {
    throw new TypeError("width must be a positive integer")
  }
  if (options.height >>> 0 != options.height) {
    throw new TypeError("height must be a positive integer")
  }

  this.width = options.width
  this.height = options.height
  this.border = options.border
  this.needsPaint = true
  this.content = emptySpace(this.width * this.height, " ")
  cursor.hide()
  // TODO color bins (bg/fg)

  var self = this
  process.once("SIGTERM", function sigterm() {
    self.cleanup()
  })
  process.once("SIGINT", function sigint() {
    self.cleanup()
  })
}

Screen.prototype.cleanup = function cleanup() {
  cursor.reset()
  cursor.show()
}

Screen.prototype._clear = function _clear() {
  process.stdout.write("\u001B[2J\u001B[0;0f")
}

Screen.prototype.paint = function paint(force) {
  if (!this.needsPaint && !force) {
    return
  }

  this._clear()

  var horizontalBorder = ""
  var verticalBorder = ""

  if (this.border) {
    var horizontalBorder = emptySpace(this.width, "─")
    var verticalBorder = "│"

    cursor.write("┌")
    cursor.write(horizontalBorder)
    cursor.write("┐")
    cursor.write("\n")
  }

  // TODO colors

  var rows = this._rows()

  for (var i = 0; i < rows.length; i++) {
    cursor.write(verticalBorder)
    cursor.write(rows[i])
    cursor.write(verticalBorder)
    cursor.write("\n")
  }

  if (this.border) {
    cursor.write("└")
    cursor.write(horizontalBorder)
    cursor.write("┘")
    cursor.write("\n")
  }


  this.needsPaint = false
}

// Returns the rows as an array of strings per row
Screen.prototype._rows = function _rows() {
  var rows = new Array(this.height)
  for (var i = 0; i < this.height; i++) {
    rows[i] = this.content.substr(i * this.width, this.width)
  }
  return rows
}

Screen.prototype.output = function output(row, column, text) {
  if (row >>> 0 != row) {
    throw new TypeError("row must be a positive integer")
  }
  if (column >>> 0 != column) {
    throw new TypeError("column must be a positive integer")
  }
  if (row >= this.height) {
    throw new RangeError("row must be <= window height")
  }
  if (column >= this.width) {
    throw new RangeError("column must be <= window width")
  }

  if (text == null || text.length == 0) {
    return
  }
  // scrub newlines
  text = text.replace(/\s/g, " ")

  var pos = row * this.width + column

  var prevContent = this.content.substr(0, pos)
  var afterContent = this.content.substr(pos + text.length)

  this.content = (prevContent + text + afterContent).substr(0, this.height * this.width)
  this.needsPaint = true
}

Screen.prototype.getChar = function getChar(row, column) {
  if (row >>> 0 != row) {
    throw new TypeError("row must be a positive integer")
  }
  if (column >>> 0 != column) {
    throw new TypeError("column must be a positive integer")
  }
  if (row >= this.height) {
    throw new RangeError("row must be <= window height")
  }
  if (column >= this.width) {
    throw new RangeError("column must be <= window width")
  }
  return this._rows()[row][column]
}

function emptySpace(n, char) {
  if (char == null) {
    char = " "
  }
  var collect = []
  for (var i = 0; i < n; i++) {
    collect.push(char)
  }
  return collect.join("")
}
