// Lens library for typescript.
// Inspired by lens.ts at https://github.com/utatti/lens.ts (Copyright 2017 Hyunje Jun)
// Copyright 2020 Polyjuice AB.

export const getter = Symbol("getter");
export const setter = Symbol("setter");
export const base = Symbol("base");
export const key = Symbol("key");
export const getKeys = Symbol("keys");
export const dig = Symbol("dig");
export const compose = Symbol("compose");
export const mod = Symbol("mod");

export type Lens<WHOLE, OBJ> = LensBody<WHOLE, OBJ> & { readonly [KEY in keyof OBJ]: Lens<WHOLE, OBJ[KEY]> };

export class LensBody<WHOLE, VALUE> {

    [base]:Lens<WHOLE,VALUE> | null;
    [key]:string|null;
    [getter]:Getter<WHOLE,VALUE>;
    [setter]: (value: VALUE) => Setter<WHOLE>

    constructor(
        _base : Lens<WHOLE,VALUE> | null,
        _key : string | null,
        _getter: Getter<WHOLE, VALUE>,
        _setter: (value: VALUE) => Setter<WHOLE>
    ) {
        this[base] = _base;
        this[key] = _key;
        this[getter] = _getter;
        this[setter] = _setter;
    }

    public [getKeys]() : Array<any> {
        return (this[base]?.[getKeys]() ?? []).concat((this[key] !== null)? [this[key]] : []);
    } 

    public [dig]<KEY extends keyof VALUE>(_key: KEY): Lens<WHOLE, VALUE[KEY]> {
        return this[compose](lens(
            this,
            _key as any,
            obj => obj[_key],
            value => obj => {
                if (Array.isArray(obj)) {
                    let arr = [...obj] as any;
                    arr[_key] = value;
                    return arr;
                } else if (obj && typeof obj === 'object') {
                    return { ...obj, [_key]:value }
                } else {
                    throw "error";
                }
            }
        ));
    }

    public [compose]<VALUE2>(other: Lens<VALUE, VALUE2>): Lens<WHOLE, VALUE2> {
        return lens(
            this,
            other[key],
            whole => other[getter](this[getter](whole)),
            value => whole => this[setter](other[setter](value)(this[getter](whole)))(whole)
        );
    }

    public [mod](modifier: Setter<VALUE>) {
        return (whole: WHOLE) => this[setter](modifier(this[getter](whole)))(whole);
    }

}

export type Getter<WHOLE, VALUE> = ( whole: WHOLE ) => VALUE;
export type Setter<WHOLE> = ( whole: WHOLE ) => WHOLE;

export function lens<WHOLE>(): Lens<WHOLE, WHOLE>;
export function lens<WHOLE, VALUE>(base:any,key: string | null, _get: Getter<WHOLE, VALUE>, _set: (value: VALUE) => Setter<WHOLE>): Lens<WHOLE, VALUE>;
export function lens( _base?:any, _key?:any, _getter?:any, _setter?:any) {
    if (_getter || _setter) {
        return makeComposer(new LensBody(_base,_key, _getter, _setter));
    } else {
        return lens( null, null, whole => whole, newWhole => oldWhole => newWhole );
    }
}

function makeComposer<WHOLE, VALUE>( body: LensBody<WHOLE, VALUE>): Lens<WHOLE, VALUE> {
    return new Proxy (body, {
        get(object:any, key:string) {
            let type = typeof(object)[key]
            switch (type) {
                case "undefined":
                    return object[dig](key);
                default:
                    return object[key];
            }
        }
    }) as Lens<WHOLE,VALUE>;
}

export function createLens<T>( ptr:string[] ) {
    let l : any = lens<T>();
    for (const key of ptr) {
        l = l[dig](key as any);
    }
    return l;
}