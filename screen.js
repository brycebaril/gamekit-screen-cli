module.exports = Screen

var ansi = require("ansi")
var cursor = ansi(process.stdout)
var xtend = require("xtend")

function Screen(width, height, options) {
  if (!(this instanceof Screen)) {
    return new Screen(width, height, options)
  }
  if (width >>> 0 != width) {
    throw new TypeError("width must be a positive integer")
  }
  if (height >>> 0 != height) {
    throw new TypeError("height must be a positive integer")
  }

  this.width = width
  this.height = height
  this.options = xtend({border: true}, options)
  this.needsPaint = true
  this.content = emptySpace(width * height, " ")
  // TODO color bins (bg/fg)
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

  if (this.options.border) {
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

  if (this.options.border) {
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