import { IterableGenerator } from "./list.js";

export let Flatten = <E>( getChildren: (node: E) => Iterable<E>, tree: E ): Iterable<E> => {
    return new IterableGenerator(
        function* () {
            function *recur(node:E) : Iterable<E> {
                yield node;
                let kids = getChildren(node);
                for (let kid of kids) {
                    yield *recur(kid);
                }
            }
            yield *recur(tree);
        });
}

export let flatten = <E>( getChildren: (node:E) => Iterable<E>) => (tree:E) : Iterable<E> => Flatten(getChildren,tree)
