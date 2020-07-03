
export let _ = Symbol('Placeholder');


// Borrowed from Ramda
//export let curry = _curry1(function curry(fn:Function) {
//  return curryN(fn.length, fn);
//});

export let curry = function curry(fn:Function) {
  return curryN(fn.length, fn);
}


// Borrowed from Ramda
const _curryN = (length : number, received : any[], fn : Function ) : Function => {
  return function() {
    var combined = [];
    var argsIdx = 0;
    var left = length;
    var combinedIdx = 0;
    while (combinedIdx < received.length || argsIdx < arguments.length) {
      var result;
      if (combinedIdx < received.length &&
          (received[combinedIdx] != _ ||
           argsIdx >= arguments.length)) {
        result = received[combinedIdx];
      } else {
        result = arguments[argsIdx];
        argsIdx += 1;
      }
      combined[combinedIdx] = result;
      if (result != _) {
        left -= 1;
      }
      combinedIdx += 1;
    }
    return left <= 0 ? fn.apply(null, combined)
                     : _arity(left, _curryN(length, combined, fn));
  };
}

// Borrowed from Ramda
export function _arity(n:number, fn:Function) {
  switch (n) {
    case 0: return function() { return fn.apply(null, arguments); };
    case 1: return function(a0:any) { return fn.apply(null, arguments); };
    case 2: return function(a0:any, a1:any) { return fn.apply(null, arguments); };
    case 3: return function(a0:any, a1:any, a2:any) { return fn.apply(null, arguments); };
    case 4: return function(a0:any, a1:any, a2:any, a3:any) { return fn.apply(null, arguments); };
    case 5: return function(a0:any, a1:any, a2:any, a3:any, a4:any) { return fn.apply(null, arguments); };
    case 6: return function(a0:any, a1:any, a2:any, a3:any, a4:any, a5:any) { return fn.apply(null, arguments); };
    case 7: return function(a0:any, a1:any, a2:any, a3:any, a4:any, a5:any, a6:any) { return fn.apply(null, arguments); };
    case 8: return function(a0:any, a1:any, a2:any, a3:any, a4:any, a5:any, a6:any, a7:any) { return fn.apply(null, arguments); };
    case 9: return function(a0:any, a1:any, a2:any, a3:any, a4:any, a5:any, a6:any, a7:any, a8:any) { return fn.apply(null, arguments); };
    case 10: return function(a0:any, a1:any, a2:any, a3:any, a4:any, a5:any, a6:any, a7:any, a8:any, a9:any) { return fn.apply(null, arguments); };
    default: throw new Error('First argument to _arity must be a non-negative integer no greater than ten');
  }
}

// Borrowed from Ramda
const curryN = function curryN(length:number, fn:Function) {
  if (length === 1) {
    return _curry1(fn);
  }
  return _arity(length, _curryN(length, [], fn));
};


// Borrowed from Ramda
export function _curry1(fn:Function) {
  return function f1(a:any) {
    if (arguments.length === 0 || a == _ ) {
      return f1;
    } else {
      return fn.apply(null, arguments);
    }
  };
}

// Borrowed from Ramda
export function _curry2(fn:Function) {
  return function f2(a:any, b:any) {
    switch (arguments.length) {
      case 0:
        return f2;
      case 1:
        return (a == _ ) ? f2
             : _curry1(function(_b:any) { return fn(a, _b); });
      default:
        return (a == _ ) && (b == _ ) ? f2
             : (a == _ ) ? _curry1(function(_a:any) { return fn(_a, b); })
             : (b == _ ) ? _curry1(function(_b:any) { return fn(a, _b); })
             : fn(a, b);
    }
  };
}
