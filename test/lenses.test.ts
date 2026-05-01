import { describe, it, expect } from "vitest";
import { getKeys, lens, setter, getter } from "../src/lenses.js"

describe("Testing functional lenses", () => {

    it("should allow to read values", () => {

        let family = {
            parents: [
                {
                    firstName: "Efraim",
                    lastName: "Långstrump",
                    owns: {
                        goldcoins: 100
                    }
                }
            ],
            children: [
                {
                    firstName: "Pippi",
                    lastName: "Långstrump",
                    owns: {
                        goldcoins: 20000
                    }
                }
            ]
        }

        let person = lens<typeof family>();

        let family2 = person.children[0].lastName[setter]("Longstocking")(family);
        let l = person.children[0];
        expect(person.children[0].owns.goldcoins[getKeys]()).toEqual(["children", "0", "owns", "goldcoins"]);
        //        console.log(Object.getPrototypeOf(l).constructor.name);
        expect(person.children[0].lastName[getter](family)).toEqual("Långstrump");
        expect(person.children[0].lastName[getter](family2)).toEqual("Longstocking");

    });

});