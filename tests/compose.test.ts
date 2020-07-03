import { map, filter } from "functional";
import { ᐅ, ᐊ } from "functional";

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
        var test = ᐊ(map(double)).ᐊ(filter(even))
        var result = test([1, 2, 3, 4]);
        expect([...result]).toEqual([4, 8]);
    });
    it("should compose forward", () => {
        let join = (array: any[]) => array.join("")
        let toArray = <T>(xs: Iterable<T>): T[] => Array.from(xs);
        let enlist = <T>(x: T): T[] => [x]

        let comp2 =
            ᐅ(map((x: number) => x * 2)).
                ᐅ(toArray).
                ᐅ(join).
                ᐅ(parseInt).
                ᐅ(enlist).
                ᐅ(Σ);

        let answer2 = comp2([1, 2, 3, 4]);
        expect(answer2).toEqual(2468);
    });

});

describe("#ᐊ Pipe backwards composition", function () {
    it("should compose filter and map", () => {
        let double = (x: number) => x * 2;
        let even = (n: number) => n === 0 || !!(n && !(n % 2));
        let test = ᐊ(map(double)).ᐊ(filter(even))
        let result = test([1, 2, 3, 4]);
        expect([...result]).toEqual([4, 8]);
    });
});