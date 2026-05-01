
export type Func = ((...args: any) => any);
export type Value = string | number | null | boolean | Func | Array<any>;
type Indexer = string | number;
export type KeyValueObject = { [key in Indexer]: any }
import { Lens, setter, getter, lens } from "./lenses.js"
/**
 * Allows you to have functional programs with the discoverability of object oriented
 * languages (i.e. methods on objects). 
 * 
 * A focused objects acts as a proxy for a part of a read only structure (named the "whole"). When you set a property
 * on the proxy, a new "whole" is created and a new proxy for the corresponding part of the new "whole" is returned.
 * 
 * The code only replaces a minimal amount of objects such that unaltered subtrees can be shared.
 */
export class FocusedObject<WHOLE extends KeyValueObject | Array<any>, SELF extends KeyValueObject> {

    private _self: SELF | undefined = undefined;
    public readonly pointer: Lens<WHOLE, SELF>;

    constructor(
        public readonly whole: WHOLE,
        pointer?: Lens<WHOLE, SELF>
    ) {
        this.pointer = pointer ?? lens<WHOLE>() as unknown as Lens<WHOLE, SELF>;
    }

    get self(): SELF {
        if (!this._self) {
            this._self = this.pointer[getter](this.whole);
        }
        return this._self;
    }

    // get self(): SELF {
    //     if (this._self) {
    //         return this._self;
    //     }
    //     let object = this.whole as any;
    //     let iter = this.pointer[Symbol.iterator]();
    //     let next = iter.next();
    //     while (!next.done) {
    //         object = object[next.value];
    //         next = iter.next();
    //     }
    //     this._self = object;
    //     return object;
    // }

    replace(object: any): FocusedObject<WHOLE, SELF> {
        let newRoot = this.pointer[setter](object)(this.whole);
        return new (this.constructor as any)(newRoot, this.pointer);
        // let newRoot: WHOLE;
        // if (Array.isArray(this.whole)) {
        //     newRoot = [...this.whole] as WHOLE;
        // } else {
        //     newRoot = { ...this.whole };
        // }
        // let object2: any = newRoot;
        // let iter = this.pointer[Symbol.iterator]();
        // let next = iter.next();
        // let lastKey: Indexer | null = null;
        // while (!next.done) {
        //     lastKey = next.value as Indexer;
        //     let nxtObj = object2[lastKey];
        //     next = iter.next();
        //     if (next.done) {
        //         object2[lastKey as any] = object;
        //         break;
        //     } else {
        //         if (Array.isArray(nxtObj)) {
        //             let copy = [...nxtObj];
        //             object2[lastKey as any] = copy;
        //             object2 = copy;
        //         } else {
        //             let copy = { ...nxtObj };
        //             object2[lastKey as any] = copy;
        //             object2 = copy;
        //         }
        //     }
        // }
        // let ret  = new (this.constructor as any)(newRoot, this.pointer);
        // ret._self = object;
        // return ret;
    }

    // get( path:Indexer[]) {
    //     let obj : any = this.self;
    //     for (const key of path) {
    //         obj = obj[key];
    //     }
    //     return obj;
    // }

    set<V, C extends this>(lens: Lens<WHOLE, V>, value: V): C {
        let newRoot = lens[setter](value)(this.whole);
        return new (this.constructor as any)(newRoot, this.pointer);
    }

    get<V>(lens: Lens<WHOLE, V>): V {
        return lens[getter](this.whole);
    }

    // set( path:Indexer[], value: any ): FocusedObject<WHOLE, SELF> {
    //     let newRoot: WHOLE;
    //     if (Array.isArray(this.whole)) {
    //         newRoot = [...this.whole] as WHOLE;
    //     } else {
    //         newRoot = { ...this.whole };
    //     }
    //     let i = 0;
    //     let object2: any = newRoot;
    //     let iter = ( (path) ? concat([this.pointer,path]) : this.pointer )[Symbol.iterator]();
    //     let next = iter.next();
    //     i++;
    //     let lastKey: Indexer | null = null;
    //     let selflen = this.pointer.length;
    //     let nextSelf;
    //     while (!next.done) {
    //         lastKey = next.value as Indexer;
    //         next = iter.next();
    //         if (next.done) {
    //             object2[lastKey] = value;
    //         }
    //         else {
    //             let nxtObj = object2[lastKey];
    //             if (Array.isArray(nxtObj)) {
    //                 let copy = [...nxtObj];
    //                 object2[lastKey as any] = copy;
    //                 object2 = copy;
    //             } else {
    //                 let copy = { ...nxtObj };
    //                 object2[lastKey as any] = copy;
    //                 object2 = copy;
    //             }    
    //             if (i == selflen) {
    //                 nextSelf = object2;
    //             }
    //             i++;
    //         }
    //     }
    //     let ret = new (this.constructor as any)(newRoot, this.pointer);
    //     ret._self = nextSelf;
    //     return ret;
    // }


    // update(setter: any): FocusedObject<WHOLE, SELF> {
    //     let newRoot: WHOLE;
    //     if (Array.isArray(this.whole)) {
    //         newRoot = [...this.whole] as WHOLE;
    //     } else {
    //         newRoot = { ...this.whole };
    //     }
    //     let object2: any = newRoot;
    //     let iter = this.pointer[Symbol.iterator]();
    //     let next = iter.next();
    //     let lastKey: Indexer | null = null;
    //     while (!next.done) {
    //         lastKey = next.value as Indexer;
    //         let nxtObj = object2[lastKey];
    //         if (Array.isArray(nxtObj)) {
    //             let copy = [...nxtObj];
    //             object2[lastKey as any] = copy;
    //             object2 = copy;
    //         } else {
    //             let copy = { ...nxtObj };
    //             object2[lastKey as any] = copy;
    //             object2 = copy;
    //         }
    //         next = iter.next();
    //         if (next.done) {
    //             break;
    //         }
    //     }

    //     let nextSelf = object2;

    //     let recur = (object2: any, setter: any) => {
    //         for (const key in setter) {
    //             if (typeof (setter[key]) !== typeof (object2[key])) {
    //                 throw `Type missmatch in setter and object for key ${key}`;
    //             }
    //             let nextObj = object2[key];
    //             if (typeof (nextObj) == "object" && nextObj !== null) {
    //                 let nextObj2 = { ...nextObj };
    //                 object2[key] = nextObj2;
    //                 let nextSetter = setter[key];
    //                 recur(nextObj2, nextSetter);
    //             } else {
    //                 object2[key] = setter[key];
    //             }
    //         }
    //     }
    //     recur(object2, setter);
    //     let ret = new (this.constructor as any)(newRoot, this.pointer);
    //     ret._self = nextSelf;
    //     return ret;
    // }
}
