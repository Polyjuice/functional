import { describe, it, expect } from "vitest";
import { map, filter, vpipe, b, d, pipe } from "functional";

export function Σ<T>(list: Iterable<T>): T {
    let sum = null;
    for (let e of list) {
        if (sum == null) {
            sum = e;
        }
        else {
            (sum as any) += e;
        }
    }
    return sum as T;
}

describe("#ᐅ Pipe forwards composition test", function () {
    it("should compose forward", () => {
        let double = (x: number) => x * 2;
        var even = (n: number) => n === 0 || !!(n && !(n % 2));
        var test = d(map(double)).d(filter(even))
        var result = test([1, 2, 3, 4]);
        expect([...result]).toEqual([4, 8]);
    });
    it("should compose forward", () => {
        let join = (array: any[]) => array.join("")
        let toArray = <T>(xs: Iterable<T>): T[] => [...xs];
        let enlist = <T>(x: T): T[] => [x]

        let comp2 =
            b(map((x: number) => x * 2)).
                b(toArray).
                b(join).
                b(parseInt).
                b(enlist).
                b(Σ);

        let answer2 = comp2([1, 2, 3, 4]);
        expect(answer2).toEqual(2468);
    });

});

describe("#ᐊ Pipe backwards composition", function () {
    it("should compose filter and map", () => {
        let double = (x: number) => x * 2;
        let even = (n: number) => n === 0 || !!(n && !(n % 2));
        let test = d(map(double)).d(filter(even))
        let result = test([1, 2, 3, 4]);
        expect([...result]).toEqual([4, 8]);
    });
});

describe("#vpipe", () => {

    it("should work", () => {


        let vres1 = vpipe(
            true,
            e => e ? "Foo" : "Not Foo",
        )
        expect(vres1).toEqual("Foo");

        class Bar {
        }
        class Foo extends Bar {
            constructor(public a = 1) {
                super();
            }
        }

        let vres2 = vpipe(
            new Foo(),
            e => e.a,
            e => e == 1
       )
        expect(vres2).toEqual(true);
       
        let vres3 = vpipe(
            10,
            e => e == 10,
            e => e ? "yes" : "no",
            e => (e == "yes") ? "hell yeah" : "hell no"
        )
        expect(vres3).toEqual("hell yeah")

        let vres4 = vpipe(
            [1,2,3,4],
            e => e.map( x => x*x ),
            e => e.join(","),
            e => e.split(","),
            e => e.join("-")
        )
        expect(vres4).toEqual("1-4-9-16")
    });
});
// describe("#pipe", () => {

//     it("should work", () => {


//         let res1 = pipe(
//             (e:boolean) => e ? "Foo" : "Not Foo",
//         )
//         expect(res1(true)).toEqual("Foo");

//         class Bar {
//         }
//         class Foo extends Bar {
//             constructor(public a = 1) {
//                 super();
//             }
//         }

//         let res2 = pipe(
//             (e:Foo) => e.a,
//             e => e == 1
//        )
//         expect(res2(new Foo())).toEqual(true);
       
//         let res3 = pipe(
//             (e:number) => e == 10,
//             e => e ? "yes" : "no",
//             e => (e == "yes") ? "hell yeah" : "hell no"
//         )
//         expect(res3(10)).toEqual("hell yeah")

//         let res4 = pipe(
//             (e:number[]) => e.map( x => x*x ),
//             e => e.join(","),
//             e => e.split(","),
//             e => e.join("-")
//         )
//         expect(res4([1,2,3,4])).toEqual("1-4-9-16")
//     });
// });
