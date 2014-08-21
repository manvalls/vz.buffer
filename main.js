
var cons = require('vz.constants'),
		Collection = require('vz.collection'),
    nextTick = require('vz.next-tick');

function Buffer(takeOrder,giveOrder){
	
	Object.defineProperties(this,{
		
		_collection: {
			value: new Collection()
		},
		
		_callbacks: {
			value: []
		},
		_callbacksThats: {
			value: []
		},
		_callbacksTimes: {
			value: []
		},
		_callbacksTestsThats: {
			value: []
		},
		_callbacksTests: {
			value: []
		},
		
		_args: {
			value: []
		},
		_argsTimes: {
			value: []
		},
		_argsTests: {
			value: []
		},
		_argsTestsThats: {
			value: []
		},
		
		_inmediate: {
			value: []
		},
		_times: {
			value: []
		},
		_test: {
			value: []
		},
		_testThat: {
			value: []
		},
		_order: {
			value: []
		},
		_infront: {
			value: []
		},
		
		ordering: {
			value: {
				give: giveOrder || takeOrder || 'fifo',
				take: takeOrder || 'fifo'
			}
		},
		target: {
			value: this,
			writable: true
		}
		
	});
	
}

function caller(cb,args,that,test,testThat){
	Buffer.prototype.taker = cb;
	Buffer.prototype.takerThis = that;
	Buffer.prototype.takerTest = test;
	Buffer.prototype.takerTestThis = testThat;
	
	if(cb instanceof Buffer) cb.inPlace().give.apply(cb,args);
	else cb.apply(that,args);
	
	delete Buffer.prototype.taker;
	delete Buffer.prototype.takerThis;
	delete Buffer.prototype.takerTest;
	delete Buffer.prototype.takerTestThis;
}

Buffer.chain = function(){
	arguments[arguments.length - 1].target = arguments[0];
	
	var i;
	for(i = 0;i < arguments.length - 1;i++){
		arguments[i].target = arguments[i + 1];
	}
};

Object.defineProperties(Buffer.prototype,{
	toString: {
		value: function(){
			return '[vz Buffer]';
		}
	},
	
	upTo: {
		value: function(n){
			this._times.push(n);
			return this;
		}
	},
	where: {
		value: function(test,that){
			this._test.push(test);
			this._testThat.push(that || this);
			return this;
		}
	},
	inPlace: {
		value: function(){
			this._inmediate.push(true);
			return this;
		}
	},
	as: {
		value: function(order){
			this._order.push(order);
			return this;
		}
	},
	inFront: {
		value: function(){
			this._infront.push(true);
			return this;
		}
	},
	
	give: {
		value: function(){
			var target = this.target || this,
					times = this._times.pop(),
					test = this._test.pop() || cons.TRUE,
					testThat = this._testThat.pop() || this,
					inmediate = this._inmediate.pop() || false,
					infront = this._infront.pop() || false,
					order = this._order.pop(),
					
					i;
			
			if(times <= 0) return;
			times = times || 1;
			
			switch(order || target.ordering.give){
				case 'lifo': {
					i = target._callbacks.length - 1;
					
					while(times > 0 && i >= 0){
						if(	target._callbacksTests[i].apply(target._callbacksTestsThats[i],arguments) &&
								test.apply(testThat,[target._callbacks[i],target._callbacksThats[i]]) ){
							
							while(times > 0){
								
								this._collection.add(caller,[
									target._callbacks[i],
									arguments,
									target._callbacksThats[i],
									target._callbacksTests[i],
									target._callbacksTestsThats[i]
								]);
								
								times--;
								
								if(--target._callbacksTimes[i] <= 0){
									target._callbacks.splice(i,1);
									target._callbacksThats.splice(i,1);
									
									target._callbacksTests.splice(i,1);
									target._callbacksTestsThats.splice(i,1);
									
									target._callbacksTimes.splice(i,1);
									
									i--;
									break;
								}
							}
							
						}else i--;
					}
					
				} break;
				default: {
					i = 0;
					
					while(times > 0 && i < target._callbacks.length){
						if(	target._callbacksTests[i].apply(target._callbacksTestsThats[i],arguments) &&
								test.apply(testThat,[target._callbacks[i],target._callbacksThats[i]]) ){
							
							while(times > 0){
								
								this._collection.add(caller,[
									target._callbacks[i],
									arguments,
									target._callbacksThats[i],
									target._callbacksTests[i],
									target._callbacksTestsThats[i]
								]);
								
								times--;
								
								if(--target._callbacksTimes[i] <= 0){
									target._callbacks.splice(i,1);
									target._callbacksThats.splice(i,1);
									
									target._callbacksTests.splice(i,1);
									target._callbacksTestsThats.splice(i,1);
									
									target._callbacksTimes.splice(i,1);
									
									break;
								}
							}
							
						}else i++;
					}
					
				} break;
			}
			
			if(times > 0){
				if(this._infront){
					target._args.unshift(arguments);
					target._argsTimes.unshift(times);
					
					target._argsTests.unshift(test);
					target._argsTestsThats.unshift(testThat);
				}else{
					target._args.push(arguments);
					target._argsTimes.push(times);
					
					target._argsTests.push(test);
					target._argsTestsThats.push(testThat);
				}
			}
			
			if(inmediate) this._collection.resolve();
			else nextTick(this._collection.resolve,[],this._collection);
			
			return this;
		}
	},
	take: {
		value: function(callback,that){
			var times = this._times.pop(),
					test = this._test.pop() || cons.TRUE,
					testThat = this._testThat.pop() || this,
					inmediate = this._inmediate.pop() || false,
					infront = this._infront.pop() || false,
					order = this._order.pop(),
					
					i;
			
			if(times <= 0) return;
			times = times || 1;
			
			callback = callback || cons.NOOP;
			that = that || this;
			
			switch(order || this.ordering.take){
				case 'lifo': {
					i = this._args.length - 1;
					
					while(times > 0 && i >= 0){
						if(	this._argsTests[i].apply(this._argsTestsThats[i],[callback,that]) &&
								test.apply(testThat,this._args[i]) ){
							
							while(times > 0){
								
								this._collection.add(caller,[
									callback,
									this._args[i],
									that,
									test,
									testThat
								]);
								
								times--;
								
								if(--this._argsTimes[i] <= 0){
									this._args.splice(i,1);
									
									this._argsTests.splice(i,1);
									this._argsTestsThats.splice(i,1);
									
									this._argsTimes.splice(i,1);
									
									i--;
									break;
								}
							}
							
						}else i--;
					}
					
				} break;
				default: {
					i = 0;
					
					while(times > 0 && i < this._args.length){
						if(	this._argsTests[i].apply(this._argsTestsThats[i],[callback,that]) &&
								test.apply(testThat,this._args[i]) ){
							
							while(times > 0){
								
								this._collection.add(caller,[
									callback,
									this._args[i],
									that,
									test,
									testThat
								]);
								
								times--;
								
								if(--this._argsTimes[i] <= 0){
									this._args.splice(i,1);
									
									this._argsTests.splice(i,1);
									this._argsTestsThats.splice(i,1);
									
									this._argsTimes.splice(i,1);
									
									break;
								}
							}
							
						}else i++;
					}
					
				} break;
			}
			
			if(times > 0){
				if(infront){
					this._callbacks.unshift(callback);
					this._callbacksThats.unshift(that);
					this._callbacksTimes.unshift(times);
					
					this._callbacksTests.unshift(test);
					this._callbacksTestsThats.unshift(testThat);
				}else{
					this._callbacks.push(callback);
					this._callbacksThats.push(that);
					this._callbacksTimes.push(times);
					
					this._callbacksTests.push(test);
					this._callbacksTestsThats.push(testThat);
				}
			}
			
			if(inmediate) this._collection.resolve();
			else nextTick(this._collection.resolve,[],this._collection);
			
			return this;
		}
	},
	
	retake: {
		value: function(){
			this.where(this.takerTest,this.takerTestThis).take(this.taker,this.takerThis);
			return this;
		}
	},
	apply: {
		value: function(that,args){
			this.give.apply(this,args);
		}
	},
	
	toGive: {
		get: function(){
			var i,size = 0,
					test = this._test.pop() || cons.TRUE,
					testThat = this._testThat.pop() || this;
			
			for(i = 0;i < this._argsTimes.length;i++) if(test.apply(testThat,this._args[i])) size += this._argsTimes[i];
			return size;
		},
		set: function(size){
			var total = 0,order = this._order.pop(),gap,
					test = this._test.pop() || cons.TRUE,
					testThat = this._testThat.pop() || this;
			
			switch(order || this.ordering.take){
				case 'lifo': {
					
					for(i = 0;i < this._argsTimes.length;i++){
						if(!test.apply(testThat,this._args[i])) continue;
						
						gap = size - total;
						
						if(gap <= 0){
							
							this._args.splice(i,1);
							this._argsTimes.splice(i,1);
							this._argsTests.splice(i,1);
							this._argsTestsThats.splice(i,1);
							
							i--;
							
							continue;
						}
						
						if(gap < this._argsTimes[i]) this._argsTimes[i] = gap;
						total += this._argsTimes[i];
					}
					
				} break;
				default: {
					
					for(i = this._argsTimes.length - 1;i >= 0;i--){
						if(!test.apply(testThat,this._args[i])) continue;
						
						gap = size - total;
						
						if(gap <= 0){
							
							this._args.splice(i,1);
							this._argsTimes.splice(i,1);
							this._argsTests.splice(i,1);
							this._argsTestsThats.splice(i,1);
							
							continue;
						}
						
						if(gap < this._argsTimes[i]) this._argsTimes[i] = gap;
						total += this._argsTimes[i];
					}
					
				} break;
			}
			
		}
	},
	toTake: {
		get: function(){
			var i,size = 0,
					test = this._test.pop() || cons.TRUE,
					testThat = this._testThat.pop() || this;
			
			for(i = 0;i < this._callbacksTimes.length;i++) if(test.apply(testThat,[this._callbacks[i],this._callbacksThats[i]])) size += this._callbacksTimes[i];
			return size;
		},
		set: function(size){
			var total = 0,order = this._order.pop(),gap,
					test = this._test.pop() || cons.TRUE,
					testThat = this._testThat.pop() || this;
			
			switch(order || this.ordering.give){
				case 'lifo': {
					
					for(i = 0;i < this._callbacksTimes.length;i++){
						if(!test.apply(testThat,[this._callbacks[i],this._callbacksThats[i]])) continue;
						
						gap = size - total;
						
						if(gap <= 0){
							
							this._callbacks.splice(i,1);
							this._callbacksThats.splice(i,1);
							this._callbacksTimes.splice(i,1);
							this._callbacksTests.splice(i,1);
							this._callbacksTestsThats.splice(i,1);
							
							i--;
							
							continue;
						}
						
						if(gap < this._callbacksTimes[i]) this._callbacksTimes[i] = gap;
						total += this._callbacksTimes[i];
					}
					
				} break;
				default: {
					
					for(i = this._callbacksTimes.length - 1;i >= 0;i--){
						if(!test.apply(testThat,[this._callbacks[i],this._callbacksThats[i]])) continue;
						
						gap = size - total;
						
						if(gap <= 0){
							
							this._callbacks.splice(i,1);
							this._callbacksThats.splice(i,1);
							this._callbacksTimes.splice(i,1);
							this._callbacksTests.splice(i,1);
							this._callbacksTestsThats.splice(i,1);
							
							continue;
						}
						
						if(gap < this._callbacksTimes[i]) this._callbacksTimes[i] = gap;
						total += this._callbacksTimes[i];
					}
					
				} break;
			}
			
		}
	}
});

module.exports = Buffer;
