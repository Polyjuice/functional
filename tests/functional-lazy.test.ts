import { take, tail, init, union, Cons } from "functional"

describe("The lazy list functions", function () {

    //////////// tail /////////////

    describe("#tail()", function () {
        it("should not be able to take the tail from an empty listt", () => {
            const a = () => Array.from(
                tail( [] )
            );
            expect(a).toThrow();
        });
        it("should extract the tail from a non-empty list", () => {
            const a = tail([1, 2, 3, 4]); //?
            expect(Array.from(a)).toEqual([2, 3, 4]);
        });
    });

    //////////// take /////////////

    describe("#take()", () => {
        it("should take 3 from a bigger list", () => {
            const a = Array.from(take(3, [5, 6, 7, 8])); //?
            expect(a).toEqual([5, 6, 7]);
        });
        it("should take 10 from a smaller list", () => {
            const a = Array.from(take(10, [5, 6])); //?
            expect(a).toEqual([5, 6]);
        });
        it("should take 10 from an empty list", () => {
            const a = Array.from(take(10, [])); //?
            expect(a).toEqual([]);
        });
    });
    
        //////////// init /////////////

        describe("#init()", () => {
            it("should get an empty list from an empty list", () => {
                const a = Array.from(init([])); //?
                expect(a).toEqual([]);
            });
            it("should get an empty list from a list with one element", () => {
                const a = Array.from(init([5])); //?
                expect(a).toEqual([]);
            });
            it("should get a list void of the last element of another list", () => {
                const a = Array.from(init([1,2,3])); //?
                expect(a).toEqual([1,2]);
            });
        });


        //////////// cons /////////////

        describe("#cons()", () => {
            it("should get a single element list when consing a single element to an empty list", () => {
                const a = Array.from(Cons(1,[])); //?
                expect(a).toEqual([1]);
            });
            it("should be able to cons an element to a non empty list", () => {
                const a = Array.from(Cons(1,[2])); //?
                expect(a).toEqual([1,2]);
            });

        });

                //////////// union /////////////

                describe("#union()", () => {
                    it("should eliminate duplicates", () => {
                        let u1 = union ([1,2,3]) ([2,3,4])
                        let u2 = union ([1,1,1]) ([])
                        expect([...u1]).toEqual([1,2,3,4]);
                        expect([...u2]).toEqual([1]);
                    });
                });
});
