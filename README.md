# vz Buffer

[![NPM](https://nodei.co/npm/vz.buffer.png?downloads=true)](https://nodei.co/npm/vz.buffer/)

## Sample usage:

```javascript

var vzBuffer = require('vz.buffer'),
    buff = new vzBuffer();

buff.give('Hello');
buff.take(console.log,console); // Hello
buff.take(console.log,console);
buff.give('world!');            // world!

```

