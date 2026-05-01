import { describe, it, expect } from "vitest";
import { JSON_stringify } from "../src/json2.js"
import { sortDependencies, pointersToTree, map } from "functional";
import { flattenWithPointers } from "../src/utils.js";

describe("Utilities", function () {
    it("Stringify Javascript objects without all those quotes", () => {
        let test = {
            "hello":
                "should not be quoted",
            "foo/bar": "should be quoted"
        }
        let str = JSON_stringify(test, null, 0, true, "double");
        expect(str).toEqual('{hello:"should not be quoted","foo/bar":"should be quoted"}');
    });

    it("#sortDependencies should work", () => {
        type TestNode = { id: string, parents: string[] };
        let list: { [key: string]: TestNode } = {
            lilleman: { id: "lillen", parents: ["tim"] },
            tim: { id: "tim", parents: ["jocke"] },
            charlie: { id: "charlie", parents: ["addie", "jocke"] },
            addie: { id: "addie", parents: ["helene", "goran"] },
            gi: { id: "gi", parents: [] },
            douglas: { id: "douglas", parents: ["addie", "jocke"] },
            fred: { id: "fred", parents: ["addie", "jocke"] },
            jocke: { id: "jocke", parents: ["gi", "christer"] },
            christer: { id: "christer", parents: [] },
            goran: { id: "jocke", parents: [] },
            helene: { id: "helene", parents: [] },
        }

        let list2 = sortDependencies(
            (a: TestNode) => a.id,
            (e: TestNode) => map(str => list[str], e.parents),
            Object.values(list)
        );

        expect(map(e => e.id, [...list2])).toEqual([
            'gi',
            'christer',
            'jocke',
            'tim',
            'lillen',
            'helene',
            'addie',
            'charlie',
            'douglas',
            'fred']);
    });

    it("#pointersToTree (list of pointers to tree) should work", () => {

        type TestNode = { id: string, data: string };
        let list: TestNode[] = [
            { id: "foo/abrakadabra/happy-camper/storm", data: "stormy" },
            { id: "foo/bar/0", data: "elem0" },
            { id: "foo/bar", data: "array" },
            { id: "hello/world", data: "classic" },
            { id: "foo/abrakadabra", data: "harry" },
            { id: "foo/bar/1", data: "elem1" }
        ]

        function createNode(key: string, kids: Iterable<[string, TestNode]>, stack: Array<TestNode | null>, pointer: string) {
            let real = stack[stack.length - 1];
            let kidobj = Object.fromEntries(kids);
            return (real) ? { ...real, ...kidobj } : { id: pointer, data: "extra", ...kidobj };
        }

        let tree: any = pointersToTree(e => e.id, createNode, list);
        //        console.log(JSON_stringify(tree, null, 3, true))
        expect(tree).toEqual({
            id: "",
            data: "extra",
            foo: {
                id: "foo",
                data: "extra",
                abrakadabra: {
                    id: "foo/abrakadabra",
                    data: "harry",
                    "happy-camper": {
                        id: "foo/abrakadabra/happy-camper",
                        data: "extra",
                        storm: {
                            id: "foo/abrakadabra/happy-camper/storm",
                            data: "stormy"
                        }
                    }
                },
                bar: {
                    id: "foo/bar",
                    data: "array",
                    "0": {
                        id: "foo/bar/0",
                        data: "elem0"
                    },
                    "1": {
                        id: "foo/bar/1",
                        data: "elem1"
                    }
                }
            },
            hello: {
                id: "hello",
                data: "extra",
                world: {
                    id: "hello/world",
                    data: "classic"
                }
            }
        })
    });

    it("should not be able to flatten a tree with pointers", () => {
        type Tree = { id: string, data: string, kids?: { [key: string]: Tree } }
        let tree: Tree = {
            id: "foo",
            data: "somefoo",
            kids: {
                bar: {
                    id: "bar",
                    data: "somebar",
                    kids: {
                        "0": {
                            id: "0",
                            data: "elem0",
                        },
                        "1": {
                            id: "1",
                            data: "elem1",
                            kids: {
                                test: {
                                    id: "test",
                                    data: "testy"
                                }
                            },

                        }
                    }
                }
            }
        }

        let list = flattenWithPointers(e => e.id, (e, path) => ({ id: e.id, data: e.data, path }), e => Object.values(e.kids ? e.kids : {}), tree);
        console.log(JSON_stringify([...list], null, 3, true));
    });

});

