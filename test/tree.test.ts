import { describe, it, expect } from "vitest";
import { flatten, map } from "functional"

describe("The lazy tree functions", function () {

    describe("#flatten()", function () {


        it("should not be able to flatten a tree", () => {

            let tree = {
                n: 1,
                children: [
                    {
                        n: 2, children: [
                            { n: 3 },
                            { n: 4 }
                        ]
                    },
                    { n: 5 }
                ]
            }

            let list = flatten(
                (e: any) => e.children ?? [])
                (tree)
            let simplified = map((e: any) => e.n)(list);
            console.log([...simplified]);
            expect([...simplified]).toEqual([1, 2, 3, 4, 5]);
        });
    });
});