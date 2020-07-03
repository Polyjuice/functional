
import {take, Cons, head,count, foldl, last,foldr, fold} from "functional"

describe("The eager list functions", function () {

     describe("#foldl()", function () {
        it("should concatenate strings", () => {
            var res = foldl( (a:string,b:number) => a+`(${b})` ) ("start-") ([1,2,3] ) //?
            expect(res).toBe("start-(1)(2)(3)");
         });
         it("should divide [100,2,5] to 10", () => {
            var res = foldl( (a:number,b:number) => a/b ) (100) ([2,5]) //?
            expect(res).toBe(10);
         });

         it("should be able to use cons as a function in a fold", () => {
            let cns = Cons as ((a:number,b:Iterable<number>) => Iterable<number>);
            expect( [...(foldr (cns) ([]) ([1,2,3,4] ))]).toEqual([1,2,3,4]);
        });

     });

     describe("#foldr()", function () {
         it("should concatenate strings", () => {
            var res = foldr( (a:number,b:string) => `(${a})`+b ) ("-end") ([1,2,3] )
            expect(res).toBe("(1)(2)(3)-end");
         });
         it("should divide [100,2,5] to 10", () => {
            var res = foldr( (a:number,b:number) => b/a ) (100) ([5,2]) //?
            expect(res).toBe(10);
         });
     });

     describe("#fold()", function () {
        it("should concatenate strings", () => {
           var res = fold( (a:string,b:string) => a+b ) (["a","b","c"] )
           expect(res).toBe("abc");
        });
    });

     //////////// head /////////////

     describe("#head()", function () {
        it("should get the first element from non-empty list", () => {
            const a = head([5, 6, 7, 8]); //?
            expect(a).toBe(5);
        });
        it("should not be able to take the first element from an empty list", () => {
//            const a = head([]); //?
            const a = head( [] );
            expect(a).toEqual(null);
        });
     });

//     //////////// count /////////////

     describe("#count()", function () {
        it("should count the elements in an empty array", () => {
            const a = count([]); //?
            expect(a).toBe(0);
        });
        it("should count the elements in a non-empty array", () => {
            const a = count([1,2,3]); //?
            expect(a).toBe(3);
        });
        it("should count the elements in an empty list", () => {
            const a = count(take(0,[1,2,3])); //?
            expect(a).toBe(0);
        });
        it("should count the elements in a non-empty list", () => {
            const a = count(take(2,[1,2,3])); //?
            expect(a).toBe(2);
        });
     });


     //////////// last /////////////

     describe("#last()", function () {
        it("should get the last element from non-empty list", () => {
            const a = last([5, 6, 7, 8]); //?
            expect(a).toBe(8);
        });
        it("should get a null reference from an empty list", () => {
            const a = last( [] );
            expect(a).toEqual(null);
        });
     });

});