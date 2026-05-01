// JSON stringify/parse without those pesky quotes when they're not needed.
// Used for debugging and copying/pasting with Javascript code.
// MIT Licensed
//
// **** 2020-08-14, Joachim Wester, Polyjuice AB. Ported to ESM and Typescript.
// **** Removed prototype hacking.
// **** json2-mod.js
// **** 2013-12-22, Martin Drapeau
// **** Modified json2 to add a 4th parameter dropQuotesOnKeys on
// **** stringify to drop quotes around keys. Defaults to false.
// **** Creates a global object JSON2_mod.
// **** 2017-10-07, Abimbola Idowu
// **** Added quoteType option.
// json2.js
// 2013-05-26 Douglas Crockford
// Public Domain.
// NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
// See http://www.JSON.org/js.html

function f(n: number) {
    // Format integers to have at least two digits.
    return n < 10 ? '0' + n : n;
}

function Date_toJSON(This: Date) {
    return isFinite(This.valueOf())
        ? This.getUTCFullYear() + '-' +
        f(This.getUTCMonth() + 1) + '-' +
        f(This.getUTCDate()) + 'T' +
        f(This.getUTCHours()) + ':' +
        f(This.getUTCMinutes()) + ':' +
        f(This.getUTCSeconds()) + 'Z'
        : null;
};

function String_toJSON(This: string) {
    return This.valueOf();
}

function Number_toJSON(This: number) {
    return This.valueOf();
}

function Boolean_toJSON(This: boolean) {
    return This.valueOf();
}

var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    keyable = /^[a-zA-Z_$][0-9a-zA-Z_$]*$/,
    gap: any,
    indent: any,
    meta: any = {    // table of character substitutions
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"': '\\"',
        "'": "\\'",
        '\\': '\\\\'
    },
    rep: any;


function quote(string: string, quoteType: "single" | "double") {

    // If the string contains no control characters, no quote characters, and no
    // backslash characters, then we can safely slap some quotes around it.
    // Otherwise we must also replace the offending characters with safe escape
    // sequences.

    escapable.lastIndex = 0;

    var surroundingQuote = '"';
    if (quoteType === 'single') {
        surroundingQuote = "'";
    }

    return escapable.test(string) ? surroundingQuote + string.replace(escapable, function (a) {
        var c = meta[a];
        return typeof c === 'string'
            ? c
            : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
    }) + surroundingQuote : surroundingQuote + string + surroundingQuote;
}

// Conditionally quote a key if it cannot be a JavaScript variable
function condQuoteKey(string: string, quoteType: "single" | "double") {
    return keyable.test(string) ? string : quote(string, quoteType);
}


function str(key: any, holder: any, dropQuotesOnKeys: any, quoteType: "single" | "double"): any {

    // Produce a string from holder[key].

    var i,          // The loop counter.
        k,          // The member key.
        v,          // The member value.
        length,
        mind = gap,
        partial,
        value = holder[key];

    // If the value has a toJSON method, call it to obtain a replacement value.

    if (value && typeof value === 'object' &&
        typeof value.toJSON === 'function') {
        value = value.toJSON(key);
    }

    // If we were called with a replacer function, then call the replacer to
    // obtain a replacement value.

    if (typeof rep === 'function') {
        value = rep.call(holder, key, value);
    }

    // What happens next depends on the value's type.

    switch (typeof value) {
        case 'string':
            return quote(value, quoteType);

        case 'number':

            // JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':

            // If the value is a boolean or null, convert it to a string. Note:
            // typeof null does not produce 'null'. The case is included here in
            // the remote chance that this gets fixed someday.

            return String(value);

        // If the type is 'object', we might be dealing with an object or an array or
        // null.

        case 'object':

            // Due to a specification blunder in ECMAScript, typeof null is 'object',
            // so watch out for that case.

            if (!value) {
                return 'null';
            }

            // Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

            // Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

                // The value is an array. Stringify every element. Use null as a placeholder
                // for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value, dropQuotesOnKeys, quoteType) || 'null';
                }

                // Join all of the elements together, separated with commas, and wrap them in
                // brackets.

                v = partial.length === 0
                    ? '[]'
                    : gap
                        ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                        : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

            // If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value, dropQuotesOnKeys, quoteType);
                        if (v) {
                            partial.push((dropQuotesOnKeys ? condQuoteKey(k, quoteType) : quote(k, quoteType)) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

                // Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value, dropQuotesOnKeys, quoteType);
                        if (v) {
                            partial.push((dropQuotesOnKeys ? condQuoteKey(k, quoteType) : quote(k, quoteType)) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

            // Join all of the member texts together, separated with commas,
            // and wrap them in braces.

            v = partial.length === 0
                ? '{}'
                : gap
                    ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                    : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
    }
}

export function JSON_stringify(value: any, replacer?: any, space?: number, dropQuotesOnKeys : boolean = true, quoteType: "single" | "double" = "double") {

    // The stringify method takes a value and an optional replacer, and an optional
    // space parameter, and returns a JSON text. The replacer can be a function
    // that can replace values, or an array of strings that will select the keys.
    // A default replacer method can be provided. Use of the space parameter can
    // produce text that is more easily readable.

    var i;
    gap = '';
    indent = '';

    // If the space parameter is a number, make an indent string containing that
    // many spaces.

    if (typeof space === 'number') {
        for (i = 0; i < space; i += 1) {
            indent += ' ';
        }

        // If the space parameter is a string, it will be used as the indent string.

    } else if (typeof space === 'string') {
        indent = space;
    }

    // If there is a replacer, it must be a function or an array.
    // Otherwise, throw an error.

    rep = replacer;
    if (replacer && typeof replacer !== 'function' &&
        (typeof replacer !== 'object' ||
            typeof replacer.length !== 'number')) {
        throw new Error('JSON.stringify');
    }

    // Make a fake root object containing our value under the key of ''.
    // Return the result of stringifying the value.

    return str('', { '': value }, dropQuotesOnKeys, quoteType);
};

// If the JSON object does not yet have a parse method, give it one.

export function JSON_parse(text:string, reviver:any) {

        // The parse method takes a text and an optional reviver function, and returns
        // a JavaScript value if the text is a valid JSON text.

        var j;

        function walk(holder:any, key:any) {

            // The walk method is used to recursively walk the resulting structure so
            // that modifications can be made.

            var k, v, value = holder[key];
            if (value && typeof value === 'object') {
                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = walk(value, k);
                        if (v !== undefined) {
                            value[k] = v;
                        } else {
                            delete value[k];
                        }
                    }
                }
            }
            return reviver.call(holder, key, value);
        }


        // Parsing happens in four stages. In the first stage, we replace certain
        // Unicode characters with escape sequences. JavaScript handles many characters
        // incorrectly, either silently deleting them, or treating them as line endings.

        text = String(text);
        cx.lastIndex = 0;
        if (cx.test(text)) {
            text = text.replace(cx, function (a) {
                return '\\u' +
                    ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            });
        }

        // In the second stage, we run the text against regular expressions that look
        // for non-JSON patterns. We are especially concerned with '()' and 'new'
        // because they can cause invocation, and '=' because it can cause mutation.
        // But just to be safe, we want to reject all unexpected forms.

        // We split the second stage into 4 regexp operations in order to work around
        // crippling inefficiencies in IE's and Safari's regexp engines. First we
        // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
        // replace all simple value tokens with ']' characters. Third, we delete all
        // open brackets that follow a colon or comma or that begin the text. Finally,
        // we look to see that the remaining characters are only whitespace or ']' or
        // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

        if (/^[\],:{}\s]*$/
            .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

            // In the third stage we use the eval function to compile the text into a
            // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
            // in JavaScript: it can begin a block or an object literal. We wrap the text
            // in parens to eliminate the ambiguity.

            j = eval('(' + text + ')');

            // In the optional fourth stage, we recursively walk the new structure, passing
            // each name/value pair to a reviver function for possible transformation.

            return typeof reviver === 'function'
                ? walk({ '': j }, '')
                : j;
        }

        // If the text is not JSON parseable, then a SyntaxError is thrown.

        throw new SyntaxError('JSON.parse');
    };

