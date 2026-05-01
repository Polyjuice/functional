
export type L<IN, OUT> = _L<IN, OUT> & ((arg: IN) => OUT)

class _L<IN, OUT> extends Function {

    b<FIN extends OUT, FOUT>(fn: (arg: FIN) => FOUT): L<IN, FOUT> {
        let composed = (a0: IN) => fn(this(a0));
        Object.setPrototypeOf(composed, _L.prototype);
        return composed as L<IN, FOUT>;
    }

    o<FIN extends OUT, FOUT>(fn: (arg: FIN) => FOUT): L<IN, FOUT> {
        let composed = (a0: IN) => fn(this(a0));
        Object.setPrototypeOf(composed, _L.prototype);
        return composed as L<IN, FOUT>;
    }

    d<FIN>(fn: (arg: FIN) => IN): L<FIN, OUT> {
        let composed = (a0: FIN): OUT => this(fn(a0));
        Object.setPrototypeOf(composed, _L.prototype);
        return composed as L<FIN, OUT>;
    }

}
/*
var out = ᐊ middle(takeret) .ᐊ take(in)
 */



export function b<FIN, FOUT>(fn: (arg: FIN) => FOUT): L<FIN, FOUT> {
    Object.setPrototypeOf(fn, _L.prototype);
    return fn as L<FIN, FOUT>;
}

// export let o = ᐅ; // for those finding the Unicode character `ᐊ` (%u140A) hard to type
export let d = b;
// export let I = ᐅ;

// export let b = ᐅ;
// export let d = ᐊ;

// Σ ᕯᘁᜭ  ᓬ ᐧ ᐩ ᕀ ⵙ ᐨ — (test) iↈi ⵌ ᐳ ᐸⵦᜭᜭᜭᝪⵦᝍᝍᦞᨖᯈᱻᱺ ᱹᱸᴧᴓↆⱇⰭⵂⴵⵆⴲⴱⴻⴼⵁⵀⴰⴾⵐⵓ〇ⵌⵋⵎⵦⵧⵯⵑ〸 ⵙⵝⵠⵡⵏ〼゜ㆍ㐃 ᕭ ᗕ ᐊᐅ  ᐅᐊ   ᗒ ဨᅳ ᐤ ᑕᑎ ᑌ  ᙦᑐ ᐨ ᐧ Ⲵ ⋯ ᜭ ᕮᕭ ᕬᕫᕯ ᗕᙍ ᙦ ᐊᯇᐅ ᜭᯇ ᴓ ℜ ↈ ↇ ↂ Ⱖ Ⱄ Ⲫ λⳫ Ⳮ ⳇ ⵂ ⴰ ⴵ Ⲷ Ⲽ ⵔ ⵓ ⵎ ⵑ ⵌ ⵋ ⵏ ⵙ ⵦ 〇 ⵐ 〡 〤 ⵘ 〼  
// ∀ λ 

// ⵙ (test) ↈ ⵌ ᐳ ᐸᜭᜭ ᕭ ᗕ ᐊᐅ  ᐅᐊ   ᗒ ဨᅳ ᐤ ᑕᑎ ᑌ  ᙦᑐ ᐨ ᐧ Ⲵ ⋯ ᜭ ᕮᕭ ᕬᕫᕯ ᗕᙍ ᙦ ᐊᯇᐅ ᜭᯇ ᴓ ℜ ↈ ↇ ↂ Ⱖ Ⱄ Ⲫ λⳫ Ⳮ ⳇ ⵂ ⴰ ⴵ Ⲷ Ⲽ ⵔ ⵓ ⵎ ⵑ ⵌ ⵋ ⵏ ⵙ ⵦ 〇 ⵐ 〡 〤 ⵘ 〼  


type Arr = readonly unknown[];


export function vpipe<A0, R0>
    (
        v0: A0
    ): A0
export function vpipe<A0, R0>
    (
        v0: A0,
        f0: (a: A0) => R0,
): R0
export function vpipe<A0, R0, R1>
    (
        v0: A0,
        f0: (a: A0) => R0,
        f1: (a: R0) => R1): R1;
export function vpipe<A0, R0, R1, R2>
    (
        v0: A0,
        f0: (a: A0) => R0,
        f1: (a: R0) => R1,
        f2: (a: R1) => R2): R2;
export function vpipe<A0, R0, R1, R2, R3>
    (
        v0: A0,
        f0: (a: A0) => R0,
        f1: (a: R0) => R1,
        f2: (a: R1) => R2,
        f3: (a: R2) => R3): R3;
export function vpipe<A0, R0, R1, R2, R3, R4>
    (
        v0: A0,
        f0: (a: A0) => R0,
        f1: (a: R0) => R1,
        f2: (a: R1) => R2,
        f3: (a: R2) => R3,
        f4: (a: R3) => R4): R4;
export function vpipe<A0, R0, R1, R2, R3, R4, R5>
    (
        v0: A0,
        f0: (a: A0) => R0,
        f1: (a: R0) => R1,
        f2: (a: R1) => R2,
        f3: (a: R2) => R3,
        f4: (a: R3) => R4,
        f5: (a: R4) => R5): R5;
export function vpipe<A0, R0, R1, R2, R3, R4, R5, R6>
    (
        v0: A0,
        f0: (a: A0) => R0,
        f1: (a: R0) => R1,
        f2: (a: R1) => R2,
        f3: (a: R2) => R3,
        f4: (a: R3) => R4,
        f5: (a: R4) => R5,
        f6: (a: R5) => R6): R6;
export function vpipe<A0, R0, R1, R2, R3, R4, R5, R6, R7>
    (
        v0: A0,
        f0: (a: A0) => R0,
        f1: (a: R0) => R1,
        f2: (a: R1) => R2,
        f3: (a: R2) => R3,
        f4: (a: R3) => R4,
        f5: (a: R4) => R5,
        f6: (a: R5) => R6,
        f7: (a: R6) => R7): R7;
// export function vpipe<A0,MIDDLE extends Arr,R>
//     (
//         v0: A0,
//         f0: (v0: A0) => any,
//         ...rest: [...MIDDLE, (a1: any) => R]): R {
//         if (rest.length == 0) {
//             return f0(v0);
//         }
//         return rest.reduce((acc: any, e: any) => e(acc), f0(v0)) as R;
// }
export function vpipe(v0: any, f0?: (v0: any) => any, ...rest: any[]): any {
    if (f0 == undefined) {
        return v0;
    }
    if (rest.length == 0) {
        return f0(v0);
    }
    return rest.reduce((acc: any, e: any) => e(acc), f0(v0));
}


export function pipe<A0 extends any[], R0>
    (
        f0: (...args: A0) => R0,
): (...args: A0) => R0
export function pipe<A0 extends any[], R0, R1>
    (f0: (...args: A0) => R0,
        f1: (a: R0) => R1): (...args: A0) => R1;
export function pipe<A0 extends any[], R0, R1, R2>
    (
        f0: (...args: A0) => R0,
        f1: (a: R0) => R1,
        f2: (a: R1) => R2): (...args: A0) => R2;
export function pipe<A0 extends any[], R0, R1, R2, R3>
    (
        f0: (...args: A0) => R0,
        f1: (a: R0) => R1,
        f2: (a: R1) => R2,
        f3: (a: R2) => R3): (...args: A0) => R3;
export function pipe<A0 extends any[], R0, R1, R2, R3, R4>
    (
        f0: (...args: A0) => R0,
        f1: (a: R0) => R1,
        f2: (a: R1) => R2,
        f3: (a: R2) => R3,
        f4: (a: R3) => R4): (...args: A0) => R4;
export function pipe<A0 extends any[], R0, R1, R2, R3, R4, R5>
    (
        f0: (...args: A0) => R0,
        f1: (a: R0) => R1,
        f2: (a: R1) => R2,
        f3: (a: R2) => R3,
        f4: (a: R3) => R4,
        f5: (a: R4) => R5): (...args: A0) => R5;
export function pipe<A0 extends any[], R0, R1, R2, R3, R4, R5, R6>
    (
        f0: (...args: A0) => R0,
        f1: (a: R0) => R1,
        f2: (a: R1) => R2,
        f3: (a: R2) => R3,
        f4: (a: R3) => R4,
        f5: (a: R4) => R5,
        f6: (a: R5) => R6): (...args: A0) => R6;
export function pipe<A0 extends any[], R0, R1, R2, R3, R4, R5, R6, R7>
    (
        f0: (...args: A0) => R0,
        f1: (a: R0) => R1,
        f2: (a: R1) => R2,
        f3: (a: R2) => R3,
        f4: (a: R3) => R4,
        f5: (a: R4) => R5,
        f6: (a: R5) => R6,
        f7: (a: R6) => R7): (...args: A0) => R7;
// export function vpipe<A0,MIDDLE extends Arr,R>
//     (
//         v0: A0,
//         f0: (v0: A0) => any,
//         ...rest: [...MIDDLE, (a1: any) => R]): R {
//         if (rest.length == 0) {
//             return f0(v0);
//         }
//         return rest.reduce((acc: any, e: any) => e(acc), f0(v0)) as R;
// }
export function pipe(f0: (...args: any[]) => any, ...rest: any[]): any {
    return (...args: any[]) => {
        return rest.reduce((acc: any, e: any) => e(acc), f0(...args));
    }
}



// export function pipe<A0 extends Arr, R0>
//     (
//         f0: (...a0: [...A0]) => R0,
// ): (...a0: [...A0]) => R0
// export function pipe<A0 extends Arr, R0,R1>
//     (
//         f0: (...a0: [...A0]) => R0,
//         f1: (a1: R0) => R1): (...a0: [...A0]) => R1;
// export function pipe<A0 extends Arr, R0,R1,R2>
//     (
//         f0: (...a0: [...A0]) => R0,
//         f1: (a1: R0) => R1,
//         f2: (a2: R1) => R2): (...a0: [...A0]) => R2;
// export function pipe<A0 extends Arr, R0,R1,R2,R3>
//     (
//         f0: (...a0: [...A0]) => R0,
//         f1: (a1: R0) => R1,
//         f2: (a2: R1) => R2,
//         f3: (a3: R2) => R3): (...a0: [...A0]) => R3;
// export function pipe<A0 extends Arr, R0,R1,R2,R3,R4>
//         (
//             f0: (...a0: [...A0]) => R0,
//             f1: (a1: R0) => R1,
//             f2: (a2: R1) => R2,
//             f3: (a3: R2) => R3,
//             f4: (a4: R3) => R4): (...a0: [...A0]) => R4;
// export function pipe<A0 extends Arr, MIDDLE extends Arr, R>
//     (
//         f0: (...a0: [...A0]) => any,
//         ...rest: [...MIDDLE, (a1: any) => R]): (...a0: [...A0]) => R {
//     return (...a0: [...A0]) => {
//         if (rest.length == 0) {
//             return f0(...a0);
//         }
//         return rest.reduce((acc: any, e: any) => e(acc), f0(...a0)) as R;
//     }
// }

