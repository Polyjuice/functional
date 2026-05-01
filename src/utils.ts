import { IterableGenerator } from "./list.js";
export type JsonValue = string | number | boolean | null | { [key: string]: JsonValue } | Array<JsonValue>;
export type JsonObject = { [key: string]: JsonValue };

export function pointersToTree<T,T2>(
    fnPointer: (x: T) => string,
    nodify: (key:string, kids: Iterable<[string,T2]>, stack:Array<T|null>,pointer:string) => T2,
    xs?: Iterable<T> ) : T2;
export function pointersToTree<T,T2>(
        fnPointer: (x: T) => string,
        nodify: (key:string, kids: Iterable<[string,T2]>, stack:Array<T|null>,pointer:string) => T2) : (xs:Iterable<T>) => T2;
    /**
 * Turns a list of elements, each pertaining to a JSON pointer, to a nested tree according to the nesting level of each pointer.
 * Usefull for rearranging trees.
 * 
 * 1. Create a list of objects with a pointers property or flatten an existing tree to a list of objets with a pointer property.
 * 2. Map the list to a list with different pointers or partially different pointers.
 * 3. Call this function to retrieve a rearranged tree
 * 
 * @param fnPointer A function called for each element if the list to get the JSON pointer in the format "foo/bar"
 * @param nodify Should return a new node corresponding to a given pointer. The children are served in `kids`.
 *               The `stack` argument serves the source elements for the pointer (or null if a pointer element does not
 *               have an entry in the list).
 * @param xs The list to process
 */
export function pointersToTree<T,T2>(
                fnPointer: (x: T) => string,
                nodify: (key:string, kids: Iterable<[string,T2]>, stack:Array<T|null>,pointer:string) => T2,
                xs?: Iterable<T> ) : ((xs:Iterable<T>) => T2 ) | T2 {

    // We will sort the list according to the pointers returned by `fnPointer`.
    function compare(a: T, b: T) {
        const pa = fnPointer(a);
        const pb = fnPointer(b);
        if (pa > pb) {
            return 1;
        } else if (pa < pb) {
            return -1;
        }
        return 0;
    }

    function inner(xs: Iterable<T>) : T2 {
        let sorted = [...xs].sort(compare); // To order elements such that siblings stick together

        // Don't ask me how i came up with this algorithm as it was a messy thought process
        function recur(stack:Array<T|null>, range:string[], index:number, depth:number ) : {index:number,elem:T2} {
            let kids : Array<[string,T2]> = [];
            var nextPtrStr:string;
            let rangeStr = range.join("/");
            while ( index < sorted.length && (nextPtrStr=fnPointer(sorted[index])).startsWith(rangeStr) ) { // Process a range
                let nextPtr = nextPtrStr.split("/");
                if ( nextPtr.length > depth ) {
                    let nextRn = nextPtr.slice(0,depth+1); // We have a new child range
                    let nextRange = nextRn.join("/");
                    let ret = recur([...stack, (nextRange==nextPtrStr) ? sorted[index] : null ], nextRn, index, depth+1);
                    kids.push([nextRn[nextRn.length-1],ret.elem]);
                    index = ret.index;
                }
                index++;
            }
            index--; // Well, we overstepped, so lets go back
            return { index:index, elem: nodify(range[range.length-1],kids,stack,rangeStr)}; // We have a complete node with all its children
        }
        let ret = recur([],[""],0,0);
        return ret.elem;
    }

    if (xs) {
       return inner(xs); // non-curried
    }
    return inner; // curried
}

/**
 * Sorts a list of elements such that any node that is dependent on some other nodes is sorted
 * after those nodes.
 * Usefull when processing elements in a list where an element might need a computed
 * result from some other element.
 * Does not handle circular dependencies.
 * 
 * @param fnId Each element must be able to produce an unique identifier
 * @param fnDependencies Should answer a list of dependent elements for a given element
 * @param xs The list to process
 */
export function sortDependencies<T>(fnId: (x: T) => string, fnDependencies: (x: T) => Iterable<T>, xs: Iterable<T>) {
    let sorted: { [key: string]: T } = {}
    let recur = (kid: T) => {
        let id = fnId(kid);
        if (sorted[id]) { // This path has been travelled before
            return;
        }
        let deps = fnDependencies(kid);
        for (let e of deps) {
            recur(e);
        }
        sorted[fnId(kid)] = kid;
    }
    for (let e of xs) {
        recur(e);
    }
    return Object.values(sorted);
}


export let flattenWithPointers = <E>( fnKey:(e:E)=>string, fnElementWithPointer:(e:E,pointer:string)=>E, getChildren: (node: E) => Iterable<E>, tree: E ): Iterable<E> => {
    return new IterableGenerator(
        function* () {
            function *recur(node:E,ptr:string[]) : Iterable<E> {
                let nextPtr = [...ptr,fnKey(node)];
                yield fnElementWithPointer(node,nextPtr.join("/"));
                let kids = getChildren(node);
                for (let kid of kids) {
                    yield *recur(kid,nextPtr);
                }
            }
            yield *recur(tree,[]);
        });
}

// function toArray(obj: { [key: string]: any }) {
//     var ret = [];
//     let keys = Object.keys(obj);
//     let max = 0;
//     for (let key of keys) {
//         console.log(key);
//         let index = parseInt(key);
//         max = Math.max(index + 1);
//     }
//     console.log(max);
//     for (var i = 0; i < max; i++) {
//         console.log(i);
//         ret.push(obj[i.toString()] ?? null)
//     }
//     console.log(ret);
//     return ret;
// }

export function fromPointer(data: JsonValue, pointer: string): JsonValue | null {
    if (pointer == "") {
        return data;
    }
    let recur = (e: any, pntr: string[], index: number): any =>
        (e === undefined) ? null : (index == pntr.length) ? e : recur(e[pntr[index]], pntr, ++index);
    return recur(data, pointer.split("/"), 1);
}