
export type λ<IN, OUT> = _λ<IN, OUT> & ( (arg:IN) => OUT )

class _λ<IN, OUT> extends Function {

    ᐅ<FIN extends OUT, FOUT>(fn: (arg:FIN) => FOUT ): λ<IN, FOUT> {
        let composed = (a0: IN) => fn( this(a0) );
        Object.setPrototypeOf(composed, _λ.prototype);
        return composed as λ<IN, FOUT>;
    }

    o<FIN extends OUT, FOUT>(fn: (arg:FIN) => FOUT ): λ<IN, FOUT> {
        let composed = (a0: IN) => fn( this(a0) );
        Object.setPrototypeOf(composed, _λ.prototype);
        return composed as λ<IN, FOUT>;
    }

    ᐊ<FIN>(fn: (arg:FIN) => IN ): λ<FIN, OUT> {
        let composed = (a0: FIN) : OUT => this( fn(a0) );
        Object.setPrototypeOf(composed, _λ.prototype);
        return composed as λ<FIN, OUT>;
    }

}
/*
var out = ᐊ middle(takeret) .ᐊ take(in)
 */



export function ᐅ<FIN, FOUT>(fn: (arg:FIN) => FOUT): λ<FIN, FOUT> {
    Object.setPrototypeOf(fn, _λ.prototype);
    return fn as λ<FIN, FOUT>;
}

export let o = ᐅ; // for those finding the Unicode character `ᐊ` (%u140A) hard to type
export let ᐊ = ᐅ;
export let I = ᐅ;

// Σ ᕯᘁᜭ  ᓬ ᐧ ᐩ ᕀ ⵙ ᐨ — (test) iↈi ⵌ ᐳ ᐸⵦᜭᜭᜭᝪⵦᝍᝍᦞᨖᯈᱻᱺ ᱹᱸᴧᴓↆⱇⰭⵂⴵⵆⴲⴱⴻⴼⵁⵀⴰⴾⵐⵓ〇ⵌⵋⵎⵦⵧⵯⵑ〸 ⵙⵝⵠⵡⵏ〼゜ㆍ㐃 ᕭ ᗕ ᐊᐅ  ᐅᐊ   ᗒ ဨᅳ ᐤ ᑕᑎ ᑌ  ᙦᑐ ᐨ ᐧ Ⲵ ⋯ ᜭ ᕮᕭ ᕬᕫᕯ ᗕᙍ ᙦ ᐊᯇᐅ ᜭᯇ ᴓ ℜ ↈ ↇ ↂ Ⱖ Ⱄ Ⲫ λⳫ Ⳮ ⳇ ⵂ ⴰ ⴵ Ⲷ Ⲽ ⵔ ⵓ ⵎ ⵑ ⵌ ⵋ ⵏ ⵙ ⵦ 〇 ⵐ 〡 〤 ⵘ 〼  
// ∀ λ 

// ⵙ (test) ↈ ⵌ ᐳ ᐸᜭᜭ ᕭ ᗕ ᐊᐅ  ᐅᐊ   ᗒ ဨᅳ ᐤ ᑕᑎ ᑌ  ᙦᑐ ᐨ ᐧ Ⲵ ⋯ ᜭ ᕮᕭ ᕬᕫᕯ ᗕᙍ ᙦ ᐊᯇᐅ ᜭᯇ ᴓ ℜ ↈ ↇ ↂ Ⱖ Ⱄ Ⲫ λⳫ Ⳮ ⳇ ⵂ ⴰ ⴵ Ⲷ Ⲽ ⵔ ⵓ ⵎ ⵑ ⵌ ⵋ ⵏ ⵙ ⵦ 〇 ⵐ 〡 〤 ⵘ 〼  


