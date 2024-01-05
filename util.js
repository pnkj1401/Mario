/** @type {<T>(object: T, scope: (this: T extends {} ? T : never) => void) => void} */
export function using(object, scope) {
  if(object !== null && object instanceof Object) {
    scope.call(object);
  }
}