# vz Buffer

[![NPM](https://nodei.co/npm/vz.buffer.png?downloads=true)](https://nodei.co/npm/vz.buffer/)

No piece of software is ever completed, feel free to contribute and be humble

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

**Note:** calls can be chained

### Buffer object

#### Constructor(takeOrder[,giveOrder])

##### takeOrder (Buffer.ordering.take)

In case the buffer has more than one item buffered, this represents the order of taking them when using Buffer.take(). One of 'fifo' or 'lifo'.

##### giveOrder (Buffer.ordering.give)

In case the buffer has more than one callback awaiting, this represents the order of giving items to them when using Buffer.give(). One of 'fifo' or 'lifo'.

#### Buffer.give([item1[,item2[,...]]])

This function adds items to the buffer. In case there's one or more callbacks awaiting on the buffer, the first one will be called asynchronously with given arguments, if not, said arguments will be stored on the buffer.

#### Buffer.toGive

The number of stored items. It's both readable and writable, affected by Buffer.where and the takeOrder.

#### Buffer.target

This property represents the buffer where the give operation takes place. It defaults to *this*.

#### static Buffer.chain(buffer1,buffer2[,buffer3[,buffer4...]])

This function chains the targets of given buffers. For example, 4 buffers would be chained like this:

```

buffer1 --> buffer2
   ^           |
   |           v
buffer4 <-- buffer3


```

In this example, items given to buffer1 should be taken from buffer2, and so on. With two buffers, the chain would be:

```

buffer1 -->
        <-- buffer2

```

Meaning that items given to buffer1 should be taken from buffer2 and vice versa.

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

#### Buffer.taker

Current callback being executed, if any

#### Buffer.takerThis

If there's a callback executing, this represents the thisArg of said callback

#### Buffer.takerTest

If there's a callback executing, this represents the testFunction passed to Buffer.where before the Buffer.take call which received the current callback.

#### Buffer.takerTestThis

If there's a callback executing, this represents the thisArg passed to Buffer.where before the Buffer.take call which received the current callback.

#### Buffer.retake()

Shorcut for buffer.where(buffer.takerTest,buffer.takerTestThis).take(buffer.taker,buffer.takerThis);

