
/**
 * Module "functional"
 * 
 * Pure functions with lazy evaulation. Inspired by Ramda and Imlazy. Intentionally not curried such as
 * the user may choose how (and if) the functions will be curried.
 */



/**
 * Wrapps a generator function as an Iterable. Used to create lazy evaulation
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



export type List<E> = Iterable<E> // Five vs eight characters

export const filter = <E>(
    filterFn: (element: E, index?: number) => boolean) =>
    (listToFilter: List<E>): List<E> => {

        return new IterableGenerator(
            function* () {
                var i = 0
                for (const e of listToFilter) {
                    if (filterFn(e, i)) {
                        yield e
                    }
                    i++
                }
            });
    }



/**
 * @param count The number of elements in the genereted list
 * @param list The list to take from
 * @returns  The first `count` elements of a list.
 */
export const take = function <E>(count: number, list: List<E>): List<E> {
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
export const tail = function <E>(list: List<E>): List<E> {
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
// export const append = function <E>(newElement: E, oldList: Iterable<E>): Iterable<E> {
//     return new IterableGenerator(
//         function* () {
//             yield* oldList;
//             yield newElement;
//         }
//     );
// }


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
export let cons = <E>(newElement: E) => ( oldList: Iterable<E>) => {
    return Cons( newElement, oldList );
}




/**
//  * 
//  * @param newElement 
//  * @param oldList 
//  */
// export const concat = function <E>(a: List<E>, b: List<E>): List<E> {
//     return new IterableGenerator(
//         function* () {
//             yield* a;
//             yield* b;
//         }
//     );
// }


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

export let map = <E, E2>(fn: (e: E, index: number) => E2) => (list: Iterable<E>) => {
    return _map(fn, list);
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
export const Union = function <E>(first:Iterable<E>,second:Iterable<E>) {
    return new IterableGenerator(
        function* () {
            var map = new Map<any,any>();
            for (const e of first) {
                if (map.get(e) == undefined) {
                    yield e;
                    map.set(e,e);
                }
            }
            for (const e of second) {
                if (map.get(e) == undefined) {
                    yield e;
                    map.set(e,e);
                }
            }
        }
    );
}
export let union = <E>(first:Iterable<E>) => (second:Iterable<E>) => {
    return Union(first, second);
}

//import { take } from "./functional-lazy.js";

type MapFn<IN, OUT> = (element: IN, index: number) => OUT;

//export const etake = <E>( cnt : number, list : Iterable<E> ) : Array<E> => Array.from(take(cnt,list));

export function _map<IN, OUT>(fn: MapFn<IN, OUT>, iterable: Iterable<IN>): Array<OUT> {
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
        if (len > 1) {
            return xs[len-1];
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
            return xs[len-2];
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

export let Foldr = <ACC, E>(fn: (b: E, a: ACC) => ACC, acc: ACC, xs: Iterable<E>): ACC => {
    let arr = [...xs];
    for (let i = arr.length-1;i>=0;i--) {
        acc = fn(arr[i],acc);
    }
    return acc;
}

export let foldr = <ACC, E>(fn: (elem: E, acc: ACC) => ACC) => (init: ACC) => (xs: Iterable<E>) => {
    return Foldr(fn, init, xs);
}


export let Foldl = <ACC, E>(fn: (acc: ACC, elem: E) => ACC, init: ACC, xs: Iterable<E>) => {
    for (const e of xs) {
        init = fn(init, e);
    }
    return init;
}
export let foldl = <ACC, E>(fn: (a: ACC, b: E) => ACC) => (init: ACC) => (xs: Iterable<E>) => {
    return Foldl(fn, init, xs);
}



export let Fold = <E extends RET,RET>(fn: (acc: E, e: E) => RET, xs: NonEmptyIterable<E>): RET => {
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
                acc = acc + next.value;
            }
        }
        return acc;
    }
}

export let fold = <E extends RET,RET>(fn: (acc: E, e: E) => RET) => (xs: NonEmptyIterable<E>): RET => {
    return Fold(fn, xs);
}

/**
 * Converts a list to a object (map)
 * @param idfn A function mapping a list element to a key string in the resulting map object
 * @param xs The list to convert
 */
export let MakeMap = <E>( idfn: ((fn:E) => string), xs:Iterable<E>) => {
    var map = {} as {[key:string]:any}
    for (let x of xs) {
        map[idfn(x)] = x;
    }
    return map;
}

export let makeMap =  <E>( idfn: ((fn:E) => string)) => ( xs:Iterable<E>) => {
    return MakeMap( idfn, xs );
}

