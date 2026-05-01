import { describe, it, expect } from "vitest";
import { getKeys, getter, Lens, lens } from "../src/lenses.js";
import { FocusedObject } from "../src/optics.js"

describe("Testing functional optics (lenslike stuff)", () => {

    type PersonType = { firstName: string, lastName: string };
    class Person extends FocusedObject<any, PersonType> { };

    it("should allow to read values", () => {

        let family = {
            parents: [
                {
                    firstName: "Efraim",
                    lastName: "Långstrump"
                }
            ],
            children: [
                {
                    firstName: "Pippi",
                    lastName: "Långstrump"
                }
            ]
        }
        let lfamily = lens<typeof family>()

        let pippi = new Person(family, lfamily.children[0]);
        console.log(pippi.pointer[getKeys]());
        expect(pippi.self).toEqual({ firstName: "Pippi", lastName: "Långstrump" });
        expect(pippi.self).toEqual({ firstName: "Pippi", lastName: "Långstrump" });

        let pippi2 = pippi.set(pippi.pointer.lastName, "Longstocking");
        expect(pippi2.constructor.name).toEqual("Person");
        expect(pippi2.self).toEqual({ firstName: "Pippi", lastName: "Longstocking" });
        expect(pippi.self).toEqual({ firstName: "Pippi", lastName: "Långstrump" });
        expect(pippi.whole).toEqual({
            parents: [
                {
                    firstName: "Efraim",
                    lastName: "Långstrump"
                }
            ],
            children: [
                {
                    firstName: "Pippi",
                    lastName: "Långstrump"
                }
            ]
        });
        expect(pippi2.whole).toEqual({
            parents: [
                {
                    firstName: "Efraim",
                    lastName: "Långstrump"
                }
            ],
            children: [
                {
                    firstName: "Pippi",
                    lastName: "Longstocking"
                }
            ]
        });
    });

    it("should work deeply nested", () => {
        let whole = {
            earth: {
                europe: {
                    sweden: {
                        stockholm: {
                            vaxholm: {
                                resaro: {
                                    alviken: {
                                        westers: {
                                            boss: "Addie",
                                            vp: "Jack"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        let lwhole = lens<typeof whole>();

        let vaxholm = new FocusedObject(whole, lwhole.earth.europe.sweden.stockholm.vaxholm);
        let vaxholm2 = vaxholm.set(vaxholm.pointer.resaro.alviken.westers.vp, "Douglas");
        expect(vaxholm2.get(vaxholm.pointer.resaro.alviken.westers.vp)).toEqual("Douglas");
        expect(vaxholm.whole.earth.europe.sweden.stockholm.vaxholm.resaro.alviken.westers.boss).toEqual("Addie");
        expect(vaxholm.whole.earth.europe.sweden.stockholm.vaxholm.resaro.alviken.westers.vp).toEqual("Jack");
        expect(vaxholm2.whole.earth.europe.sweden.stockholm.vaxholm.resaro.alviken.westers.boss).toEqual("Addie");
        expect(vaxholm2.whole.earth.europe.sweden.stockholm.vaxholm.resaro.alviken.westers.vp).toEqual("Douglas");
        expect(vaxholm2.self.resaro.alviken.westers.vp).toEqual("Douglas");
    });

});


type Kingdom = {
    animals: Animal[],
    mountains: Mountain[]
}

type Animal = {
    type: string,
    name: string,
    gender: "male" | "female",
    weight: number
}

type Mountain = {
    name: string,
    height: number
}

class CMountain extends FocusedObject<Kingdom, Mountain> {
}

abstract class CAnimal extends FocusedObject<Kingdom, Animal> {
    abstract makeSound(): string;

    get name() {
        return this.get(this.pointer.name);
    }
}

class CDog extends CAnimal {

    makeSound(): string {
        return "barf";
    }
}


class CCat extends CAnimal {
    makeSound(): string {
        return "miau";
    }
}

function isAnimal(obj: any): obj is Animal {
    return obj.type !== undefined;
}

let LKingdom = lens<Kingdom>();

//type Obj = Animal | Mountain;

class CKingdom extends FocusedObject<Kingdom, Kingdom> {

    ref<V>(lens: Lens<Kingdom, V>): CAnimal | CMountain {
        let obj = this.get(lens);
        if (isAnimal(obj)) {
            if (obj.type == "cat") {
                return new CCat(this.whole, lens as any);
            } else if (obj.type == "dog") {
                return new CDog(this.whole, lens as any);
            }
        } else {
            return new CMountain(this.whole, lens as any);
        }
        throw `Illegal type ${obj.type}`;
    }
}

describe("Testing object functional classes", () => {
    it("should world", () => {

        let kingdom: Kingdom = {
            animals: [
                {
                    type: "dog",
                    name: "Pixie",
                    gender: "female",
                    weight: 40
                }
            ],
            mountains: [
                {
                    name: "Mount Everest",
                    height: 8849
                }
            ]
        }


        let world = new CKingdom(kingdom, LKingdom);
        let l = world.pointer.animals[0];
        let pixie = world.ref(l) as CDog;

        expect(pixie.constructor.name).toEqual("CDog");
        expect(pixie).toBeInstanceOf(CDog);
        expect(pixie.makeSound()).toEqual("barf");
        expect(pixie.get(pixie.pointer.name)).toEqual("Pixie");
        expect(pixie.name).toEqual("Pixie");

        let m = world.get(world.pointer.mountains[0]);
        expect(m.name).toEqual("Mount Everest");
        let m2 = world.ref(world.pointer.mountains[0]);
        expect(m2).toBeInstanceOf(CMountain);
        expect(m2.get(m2.pointer.name)).toEqual("Mount Everest");
        let pixie2 = pixie.set(pixie.pointer.weight, 50);
        let world2 = pixie2;
        expect(world2.whole).toEqual({
            animals: [
                {
                    type: "dog",
                    name: "Pixie",
                    gender: "female",
                    weight: 50
                }
            ],
            mountains: [
                {
                    name: "Mount Everest",
                    height: 8849
                }
            ]
        }
        );

        let p = pixie.pointer;
        let zita: Animal = {
            ...pixie.self,
            name: "Zita",
            weight: 60
        };
        let world3 = world2.set(pixie.pointer, zita);

        expect(world3.whole).toEqual({
            animals: [
                {
                    type: "dog",
                    name: "Zita",
                    gender: "female",
                    weight: 60
                }
            ],
            mountains: [
                {
                    name: "Mount Everest",
                    height: 8849
                }
            ]
        }
        );
    });
})
