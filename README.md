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

## Reference

### Buffer object

#### Constructor(takeOrder[,giveOrder])

##### takeOrder

In case the buffer has more than one item buffered, this represents the order of taking them when using Buffer.take(). One of 'fifo' or 'lifo'.

##### giveOrder

In case the buffer has more than one callback awaiting, this represents the order of giving items to them when using Buffer.give(). One of 'fifo' or 'lifo'.

#### Buffer.give([item1[,item2[,...]]])

This function adds items to the buffer. In case there's one or more callbacks awaiting on the buffer, the first one will be called asynchronously with given arguments, if not, said arguments will be stored on the buffer.

#### Buffer.toGive

The number of stored items. It's both readable and writable, affected by Buffer.where and the takeOrder.

#### Buffer.take(callback[,thisArg])

This function retrieves items from the buffer. In case there's one or more items awaiting on the buffer, the callback will be called with the first ones as arguments, if not, said callback will be kept awaiting on the buffer.

#### Buffer.toTake

The number of awaiting functions. It's both readable and writable, affected by Buffer.where and the giveOrder.

#### Buffer.upTo(times)

If this function is used, the next give or take operation on this buffer will take place "times" times. "times" can be any number from 1 to Infinity.

#### Buffer.where(testFunction[,thisArg])

If this function is used, the next give or take operation on this buffer will only affect items or callbacks for which the testFunction returns true.

#### Buffer.inPlace()

If this function is used, the next give or take operation on this buffer will happen synchronously.

#### Buffer.as(order)

If this function is used, the next give or take operation on this buffer will take place in the provided order, one of 'lifo' or 'fifo'.

#### Buffer.inFront()

If this function is used, and the next give or take operation needs to store an item or callback, it will be stored at the front of the queue. Otherwise it will be stored at the back.

#### Buffer.apply(thisArg,arguments)

Shorcut for Buffer.give(arguments\[0\]\[,arguments\[1\]...\])



