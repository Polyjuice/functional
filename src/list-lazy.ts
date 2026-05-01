import { IterableGenerator } from "./list.js";
//import { partialCall } from "./curry";

export function map<E, E2>(fn: (e: E, index?: number) => E2, xs: Iterable<E>): Iterable<E2>;
export function map<E, E2>(fn: (e: E, index?: number) => E2) : (xs: Iterable<E>) => Iterable<E2>;
export function map<E, E2>(fn: (e: E, index?: number) => E2, xs?: Iterable<E>): Iterable<E2> | ((xs: Iterable<E>) => Iterable<E2>) {
    const inner = (fn: (e: E, index?: number) => E2 ) => (xs: E[] | Iterable<E>): Iterable<E2> => {
        return new IterableGenerator(
            function* () {
                var i = 0
                for (const e of xs) {
                    yield fn(e, i);
                    i++
                }
            });
    };
//    return (xs === undefined) ? partialCall(_map, fn) : _map(fn, xs); // Curry if list is omitted
    return (xs === undefined) ? inner(fn) : inner(fn)(xs); // Curry if list is omitted
}

