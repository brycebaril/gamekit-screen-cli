gamekit-screen-cli
=====

[![NPM](https://nodei.co/npm/gamekit-screen-cli.png)](https://nodei.co/npm/gamekit-screen-cli/)

This is a CLI/Terminal implementation of the `Screen` display portion of the http://npm.im/gamekit API.

It lets you create a grid ascii area on the terminal and read/write characters in it.

```javascript
var Screen = require("gamekit-screen-cli")

var screen = new Screen({width: 21, height: 8})

screen.paint()
screen.output(1,1,"abcd")

var c = screen.getChar(1,1)
screen.output(5,5,c)
screen.paint()
```

API
===

`var screen = new Screen(options)`
---

Create a new Screen instance.

`options` are:
  * width (required): screen width in columns
  * height (required): screen height in rows
  * border (default `true`): whether or not to draw a border around the screen

`options` accepts a `border` boolean (default: true)

`screen.paint([force])`
---

Draw the current contents of the screen to the terminal, clearing the terminal first.

Does nothing if it doesn't think the screen contents have changed. To force a paint, pass a true value.

`screen.output(row, column, text)`
---

Change the contents of the screen to contain `text` at those coordinates (0-indexed).

Does *not* force a paint, so paint must be called to see the updated output.

If the text would overflow the current row, it will overflow into the next row.

`screen.getChar(row, column)`
---

Fetch the character at this `row` and `column`, returns the character.

`screen.cleanup()`
---

Reset the pen and re-enable the cursor so that your terminal tries to go back to normal.

It will automatically set up SIGINT and SIGTERM handlers to call `cleanup` but you should still call cleanup yourself on exit.

LICENSE
=======

MIT
