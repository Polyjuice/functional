
/**
 * Module "functional"
 * 
 * Pure functions with lazy evalation. Inspired by Ramda and Imlazy. Intentionally not curried such as
 * the user may choose how (and if) the functions will be curried.
 */

/**
 * Wrapps a generator function as an Iterable. Used to create lazy evalation
 * for functions such as append, map and filter.
 */

export class IterableGenerator<E> implements Iterable<E> {

    generator: () => Generator<E, void, unknown>;

    /**
     * 
     */
    _cache: Array<E> | null;

    constructor(generator: () => Generator<E, void, unknown>) {
        this.generator = generator;
        this._cache = null;
    }

    [Symbol.iterator](): Iterator<E> {
        return this._cache ?
            this._cache[Symbol.iterator]()
            : this.generator();
    }

    // cache(): Array<E> {
    //     return (this._cache = Array.from(this));
    // }

    // toArray(): Array<E> {
    //     return this.cache();
    // }

    // toString() {
    //     let arr = Array.from(take(11, this));
    //     if (arr.length == 11) {
    //         arr = Array.from(take(10, this))
    //         return `[${arr.join(",")},...]`;
    //     }
    //     return `[${arr.join(",")}]`
    // }
}


export function filter<E>(filterFn: (element: E, index?: number) => boolean): (xs: Iterable<E>) => Iterable<E>;
export function filter<E>(filterFn: (element: E, index?: number) => boolean, xs: Iterable<E>): Iterable<E>;
export function filter<E>(
    filterFn: (element: E, index?: number) => boolean, xs?: Iterable<E>): Iterable<E> | ((xs: Iterable<E>) => Iterable<E>) {

    function inner(xs: Iterable<E>) {
        return new IterableGenerator(
            function* () {
                var i = 0
                for (const e of xs) {
                    if (filterFn(e, i)) {
                        yield e
                    }
                    i++
                }
            });
    }
    if (xs) {
        return inner(xs);
    }
    return inner;
}


export const Filter = filter; // TODO! REMOVE!



/**
 * @param count The number of elements in the genereted list
 * @param list The list to take from
 * @returns  The first `count` elements of a list.
 */
export const take = function <E>(count: number, list: Iterable<E>): Iterable<E> {
    return new IterableGenerator(
        function* () {
            var i = 0
            for (const e of list) {
                if (++i <= count)
                    yield e
                else
                    break
            }
        });
};




/**
 * Returns a list void of the last element
 * @param list The list to take from
 * @returns A smaller list. If the list is empty an empty list is returned.
 */
export const init = function <E>(list: Iterable<E>): Iterable<E> {
    return new IterableGenerator(
        function* () {
            let xs = list[Symbol.iterator]();
            let candidate = xs.next();
            if (candidate.done) {
                return;
            }
            while (true) {
                let next = xs.next();
                if (next.done) {
                    break;
                }
                yield candidate.value;
                candidate = next;
            }
        });
};


/**
 * Gives a list that lacks the first element
 * @param list The list to extract the tail from
 * @returns  The list without the first element.
 */
export const tail = function <E>(list: Iterable<E>): Iterable<E> {
    // TODO! Optimize for linked lists (return cdr)
    return new IterableGenerator(
        function* () {
            var skipped = false;
            for (const e of list) {
                if (skipped)
                    yield e
                else
                    skipped = true;
            }
            if (!skipped) {
                throw "Cannot extract the tail of an empty list";
            }
        });
};

// /**
//  * The last part of a list skipping a number of elements in the front.
//  * @param from The number of elements to skip aka the starting position
//  * @param list The list to take from
//  * @returns  The first `count` elements of a list.
//  */
// export const from = function <E>(start: number, list: List<E>): List<E> {
//     return new IterableGenerator(
//         function* () {
//             var i = 0
//             for (const e of list) {
//                 if (++i > start)
//                     yield e
//                 else
//                     break
//             }
//         });
// };


// /**
//  * 
//  * @param newElement 
//  * @param oldList 
//  */
export function append<E>(newElement: E): (oldList: Iterable<E>) => Iterable<E>;
export function append<E>(newElement: E, oldList: Iterable<E>): Iterable<E>;
export function append<E>(newElement: E, oldList?: Iterable<E>) {
    function inner(oldList: Iterable<E>): Iterable<E> {
        return new IterableGenerator(
            function* () {
                yield* oldList;
                yield newElement;
            }
        );
    }
    return (oldList == undefined) ? inner : inner(oldList);
}


/**
 * 
 * @param newElement 
 * @param oldList 
 */
export const Cons = function <E>(newElement: E, oldList: Iterable<E>): Iterable<E> {
    // TODO! Optimize for arrays and linked lists
    return new IterableGenerator(
        function* () {
            yield newElement;
            yield* oldList;
        }
    );
}
export let cons = <E>(newElement: E) => (oldList: Iterable<E>) => {
    return Cons(newElement, oldList);
}




export const Concat = <E>(a: Iterable<E>, xs: Iterable<E>): Iterable<E> => {
    return new IterableGenerator(
        function* () {
            yield* xs;
            yield* a;
        }
    );
}


// export function concat<E>(a: Iterable<E> ) : (xs:Iterable<E>) => Iterable<E>;
// export function concat<E>(a: Iterable<E>, xs:Iterable<E> ) : Iterable<E>;
// export function concat<E>(a: Iterable<E>, xs?:Iterable<E> ) {
//     function inner (xs: Iterable<E>) : Iterable<E> {
//         return new IterableGenerator(
//             function* () {
//                 yield* xs;
//                 yield* a;
//             }
//         );    
//     }
//     if (xs == undefined) {
//         return inner;
//     }
//     return inner(xs);
// }

export function concat<E>(listOfLists: Iterable<Iterable<E>>): Iterable<E> {
    return new IterableGenerator(
        function* () {
            for (let list of listOfLists) {
                yield* list;
            }
        }
    );
}




// /**
//  * 
//  * @param a 
//  * @param b 
//  */
// export const intersect = function <E>(a: List<E>, b: List<E>): List<E> {
//     const map = new Map<E, boolean>();
//     for (const e of a) {
//         map.set(e, true);
//     }
//     return new IterableGenerator(
//         function* () {
//             for (const e of b) {
//                 if (map.has(e)) {
//                     yield e;
//                 }
//             }
//         }
//     );
// }


// /**
//  * 
//  * @param fn 
//  * @param list 
//  */
// export const _map = function <E, E2>(fn: (e: E, index: number) => E2, list: Iterable<E>): Iterable<E2> {
//     return new IterableGenerator(
//         function* () {
//             var i = 0;
//             for (const e of list) {
//                 yield fn(e, i++);
//             }
//         }
//     );
// }

// export let map = <E, E2>(fn: (e: E, index: number) => E2) => (list: Iterable<E>) => {
//     return _map(fn, list);
// }

export function map<E, E2>(fn: (e: E, index: number) => E2, xs: Iterable<E>): Iterable<E2>;
export function map<E, E2>(fn: (e: E, index: number) => E2): (xs: Iterable<E>) => Iterable<E2>;

export function map<E, E2>(fn: (e: E, index: number) => E2, xs?: Iterable<E>): Iterable<E2> | ((xs: Iterable<E>) => Iterable<E2>) {
    const _map = (fn: (e: E, index: number) => E2, xs: Iterable<E>): Iterable<E2> => {
        if (Array.isArray(xs)) {
            let ret = new Array(xs.length) as E2[];
            let i = 0;
            for (let e of xs) {
                ret[i] = fn(e, i);
                i++;
            }
            return ret;
        } else {
            let ret: E2[] = [];
            let i = 0;
            for (let e of xs) {
                ret.push(fn(e, i));
                i++;
            }
            return ret;
        }
    };
    return (xs === undefined) ? (xs: Iterable<E>) => _map(fn, xs) : _map(fn, xs); // Curry if list is omitted
}

export function array<E>(xs: Iterable<E>): Array<E> {
    if (Array.isArray(xs)) {
        return xs;
    }
    let ret: E[] = [];
    for (let e of xs) {
        ret.push(e);
    }
    return ret;
}


// /**
//  * 
//  * @param where 
//  * @param toInsert 
//  * @param original 
//  */
// export const insertAdv = <E>(
//     where: (index: number, previous?: E, next?: E) => boolean,
//     toInsert: List<E>,
//     original: List<E>): List<E> => {

//     return new IterableGenerator(
//         function* () {
//             var i = 0;
//             var next: IteratorResult<any, any> = { value: null, done: false };
//             var stream = original[Symbol.iterator]();
//             var previous: IteratorResult<any, any>;

//             do {
//                 previous = next;
//                 next = stream.next();
//                 var insertHere = where(i, previous.value, next.value);
//                 if (insertHere) {
//                     yield* toInsert;
//                 }
//                 if (next.done)
//                     break;
//                 yield next.value;
//                 i++;
//             } while (true)
//         });
// };

type WhereFn<E> = (element: E, index?: number) => boolean

// /**
//  * 
//  * @param where 
//  * @param toInsert 
//  * @param original 
//  */
// export function Insert<E>(
//     where: (element: E, index?: number) => boolean,
//     toInsert: List<E>,
//     xs: List<E>): List<E> {

//     return new IterableGenerator(
//         function* () {
//             var i = 0;

//             for (const x of xs) {
//                 if (where(x, i)) {
//                     for (const x2 of toInsert) {
//                         yield x2
//                         i++
//                     }
//                 }
//                 yield x
//                 i++
//             }
//         });
// };


// export let insert = <E>(position: WhereFn<E>) => (listToInsert: List<E>) => (originalList: List<E>) =>
//     Insert(position, listToInsert, originalList);



/**
 * 
 * @param where 
 * @param toInsert 
 * @param original 
 */
export function InsertAt<E>(
    where: number,
    toInsert: Iterable<E>,
    xs: Iterable<E>): Iterable<E> {

    return new IterableGenerator(
        function* () {
            var i = 0;

            for (const x of xs) {
                if (i == where) {
                    yield* toInsert;
                }
                yield x
                i++
            }
        });
};
export let insertAt = <E>(where: number) => (toInsert: Iterable<E>) => (xs: Iterable<E>): Iterable<E> => InsertAt(where, toInsert, xs)



/**
 * 
 * @param fn 
 * @param list 
 */
export const Union = function <E>(first: Iterable<E>, second: Iterable<E>) {
    return new IterableGenerator(
        function* () {
            var map = new Map<any, any>();
            for (const e of first) {
                if (map.get(e) == undefined) {
                    yield e;
                    map.set(e, e);
                }
            }
            for (const e of second) {
                if (map.get(e) == undefined) {
                    yield e;
                    map.set(e, e);
                }
            }
        }
    );
}
export let union = <E>(first: Iterable<E>) => (second: Iterable<E>) => {
    return Union(first, second);
}

//import { take } from "./functional-lazy.js";

//type MapFn<IN, OUT> = ;

//export const etake = <E>( cnt : number, list : Iterable<E> ) : Array<E> => Array.from(take(cnt,list));

export function _map<IN, OUT>(fn: (element: IN, index: number) => OUT, iterable: Iterable<IN>): Iterable<OUT> {
    return new IterableGenerator(
        function* () {
            var i = 0
            for (const e of iterable) {
                yield fn(e, i);
                i++
            }
        });
}

type MapFn<T1, T2> = (e: T1, i: number) => T2;
export function _mapEager<IN, OUT>(fn: MapFn<IN, OUT>, iterable: Iterable<IN>): Array<OUT> {
    if (Array.isArray(iterable)) {

        const source = iterable as Array<IN>;
        const arr = Array(source.length);
        for (var i = 0; i < arr.length; i++) {
            arr[i] = fn(source[i], i);
        }
        return arr;
    }
    var i = 0;
    var arr: Array<OUT> = [];
    for (const e of iterable) {
        arr.push(fn(e, i));
        i++;
    }
    return arr;
}


function* test() {
    yield "test"
}

export function count(iterable: Iterable<any>): number {
    if (Array.isArray(iterable)) {
        return (iterable as []).length;
    }
    var i = 0;
    for (const e of iterable) {
        i++;
    }
    return i;
}

export type NonEmptyIterable<E> = Iterable<E>

export function head<E>(list: NonEmptyIterable<E>): E;

/**
 * Returns the first element of a list
 * @param list The list
 * @return The first element or null of there is no first element
 */
export function head<E>(xs: Iterable<E> | NonEmptyIterable<E>): E | null {
    const next = xs[Symbol.iterator]().next();
    if (next.done) {
        return null; //throw "Cannot take the head of an empty list";
    }
    return next.value;
}


/**
 * Returns the last element of a list
 * @param list The list
 * @return The first element or null of there is no second last element
 */
export function last<E>(xs: Iterable<E> | NonEmptyIterable<E>): E | null {
    if (Array.isArray(xs)) {
        let len = xs.length;
        if (len > 0) {
            return xs[len - 1];
        }
        return null;
    }
    let iterator = xs[Symbol.iterator]();
    var x: IteratorResult<E>;
    var last = null;
    while (true) {
        x = iterator.next();
        if (x.done) {
            break;
        }
        last = x.value;
    }
    return last;
}

/**
 * Returns the second last element of a list
 * @param list The list
 * @return The second last element or null of there is no second last element
 */
export function secondLast<E>(xs: Iterable<E> | NonEmptyIterable<E>): E | null {
    if (Array.isArray(xs)) {
        let len = xs.length;
        if (len > 2) {
            return xs[len - 2];
        }
        return null;
    }
    let iterator = xs[Symbol.iterator]();
    var x: IteratorResult<E>;
    var secondLast = null;
    var last = null;
    while (true) {
        x = iterator.next();
        if (x.done) {
            break;
        }
        secondLast = last;
        last = x.value;
    }
    return secondLast;
}

export function single<T>(xs: Iterable<T>): T {
    let foundAny = false;
    let result: T;
    for (const x of xs) {
        if (!foundAny) {
            result = x;
            foundAny = true;
        } else {
            throw new Error("Exactly one element expected.");
        }
    }
    if (foundAny) {
        //@ts-ignore
        return result;
    } else {
        throw new Error("Exactly one element expected.");
    }
}

export function singleOr<T, Default>(xs: Iterable<T>, deflt?: Default): T | Default {
    let foundAny = false;
    let result: T;
    for (const x of xs) {
        if (!foundAny) {
            result = x;
            foundAny = true;
        } else {
            throw new Error("Zero or one elements expected.");
        }
    }
    //@ts-ignore
    return foundAny ? result : deflt;
}

export let Foldr = <ACC, E>(fn: (b: E, a: ACC) => ACC, acc: ACC, xs: Iterable<E>): ACC => {
    let arr = [...xs];
    for (let i = arr.length - 1; i >= 0; i--) {
        acc = fn(arr[i], acc);
    }
    return acc;
}

export let foldr = <ACC, E>(fn: (elem: E, acc: ACC) => ACC) => (init: ACC) => (xs: Iterable<E>): ACC => {
    return Foldr(fn, init, xs);
}

export function foldl<ACC, E>(fn: (acc: ACC, elem: E) => ACC): (init: ACC) => (xs?: Iterable<E>) => ACC;
export function foldl<ACC, E>(fn: (acc: ACC, elem: E) => ACC): (init: ACC, xs?: Iterable<E>) => (init: ACC, xs?: Iterable<E>) => ACC;
export function foldl<ACC, E>(fn: (acc: ACC, elem: E) => ACC, init: ACC): (xs: Iterable<E>) => ACC;
export function foldl<ACC, E>(fn: (acc: ACC, elem: E) => ACC, init: ACC, xs: Iterable<E>): ACC;
export function foldl<ACC, E>(fn: (acc: ACC, elem: E) => ACC, init?: ACC, xs?: Iterable<E>) {
    let inner = (fn: (acc: ACC, elem: E) => ACC, init: ACC, xs: Iterable<E>): ACC => {
        for (const e of xs) {
            init = fn(init, e);
        }
        return init;
    }
    if (init == undefined) {
        return (init: ACC, xs?: Iterable<E>) => {
            if (xs == undefined) {
                return (xs: Iterable<E>) => inner(fn, init, xs);
            }
            return inner(fn, init, xs);
        }
    }
    return inner(fn, init, xs as Iterable<E>);
}



export let Fold = <E>(fn: (acc: E, e: E) => E, xs: NonEmptyIterable<E>): E => {
    var iterator = xs[Symbol.iterator]();
    var next;
    next = iterator.next();
    if (next.done) {
        throw "Cannot fold an empty lists"
    }
    else {
        var acc = next.value;
        while (true) {
            next = iterator.next();
            if (next.done) {
                break;
            } else {
                acc = fn(acc, next.value);
            }
        }
        return acc;
    }
}

export let fold = <E>(fn: (acc: E, e: E) => E) => (xs: NonEmptyIterable<E>): E => {
    return Fold(fn, xs);
}

// /**
//  * Converts a list to a object (map)
//  * @param idfn A function mapping a list element to a key string in the resulting map object
//  * @param xs The list to convert
//  */
// export let MakeMap = <E>(idfn: ((fn: E) => string), xs: Iterable<E>) => {
//     var map = {} as { [key: string]: any }
//     for (let x of xs) {
//         map[idfn(x)] = x;
//     }
//     return map;
// }

// export let makeMap = <E>(idfn: ((fn: E) => string)) => (xs: Iterable<E>) => {
//     return MakeMap(idfn, xs);
// }


/**
 * Creates an object (i.e. a dictionary/map) from a list.
 * The function is automatically curried if you omit arguments.
 * @param keyFn A function that extracts a string key from each item in the list
 * @returns A function that takes the list
 */
export function obj<T>(keyFn: (e: T) => string): (xs: Iterable<T>) => { [key: string]: T };
/**
 * Creates an object (i.e. a dictionary/map) from a list.
 * The function is automatically curried if you omit arguments.
 * @param keyFn A function that extracts a string key from each item in the list
 * @param xs A list
 */
export function obj<T>(keyFn: (e: T) => string, xs: Iterable<T>): { [key: string]: T };
export function obj<T>(keyFn: (e: T) => string, xs?: Iterable<T>) {
    function inner(xs: Iterable<T>) {
        var map = {} as { [key: string]: any }
        for (let x of xs) {
            map[keyFn(x)] = x;
        }
        return map;
    }
    if (xs == undefined) {
        return inner;
    }
    return inner(xs);
}


export function zip<T, T2>(xs: Iterable<T>, ys: Iterable<T2>): Iterable<T | T2> {
    return new IterableGenerator(
        function* () {
            let iter1 = xs[Symbol.iterator]();
            let iter2 = ys[Symbol.iterator]();
            while (true) {
                let nextx = iter1.next();
                let nexty = iter2.next();
                if (nextx.done || nexty.done) {
                    break;
                }
                if (!nextx.done) {
                    yield nextx.value;
                }
                if (!nexty.done) {
                    yield nexty.value;
                }
            }
        });
}


export function repeat<T>(x: T) {
    return new IterableGenerator(
        function* () {
            while (true) {
                yield x;
            }
        });
}

export function sorted<T>(compareFn: (a: T, b: T) => number): (xs: Iterable<T>) => Iterable<T>;
export function sorted<T>(compareFn: (a: T, b: T) => number, xs: Iterable<T>): Iterable<T>;

export function sorted<T>(
    compareFn: (a: T, b: T) => number,
    xs?: Iterable<T>
): Iterable<T> | ((xs: Iterable<T>) => Iterable<T>) {
    function* sorter(xs: Iterable<T>) {
        yield* [...xs].sort(compareFn);
    };
    return xs ? sorter(xs) : sorter;
}

/**
 * Compares two sequences for equality.
 * 
 * @remarks
 * The sequences are equal if their elements are pairwise equal according
 * to the given equality predicate. It follows therefore that sequences of
 * different length are non-equal.
 */
export function equal<T>(
    equals: (left: T, right: T) => boolean
): ((xs: Iterable<T>) => (ys: Iterable<T>) => boolean);
export function equal<T>(
    equals: (left: T, right: T) => boolean,
    xs: Iterable<T>
): (ys: Iterable<T>) => boolean;
export function equal<T>(
    equals: (left: T, right: T) => boolean,
    xs: Iterable<T>,
    ys: Iterable<T>
): boolean;

export function equal<T>(
    equals: (left: T, right: T) => boolean,
    xs?: Iterable<T>,
    ys?: Iterable<T>
): ((xs: Iterable<T>) =>
    | ((ys: Iterable<T>) => boolean))
    | ((ys: Iterable<T>) => boolean)
    | boolean {
    function inner(xs: Iterable<T>, ys: Iterable<T>): boolean {
        const xit = xs[Symbol.iterator]();
        const yit = ys[Symbol.iterator]();
        for (; ;) {
            const { value: xvalue, done: xdone } = xit.next();
            const { value: yvalue, done: ydone } = yit.next();
            if (xdone && ydone) {
                return true;
            }
            if (xdone !== ydone) {
                return false;
            }
            // |- !xdone && !ydone
            if (!equals(xvalue, yvalue)) {
                return false;
            }
        }
    }
    if (xs && ys) {
        return inner(xs, ys);
    } else if (xs) {
        return (ys: Iterable<T>) => inner(xs, ys);
    } else {
        return (xs: Iterable<T>) => (ys: Iterable<T>) => inner(xs, ys);
    }
}