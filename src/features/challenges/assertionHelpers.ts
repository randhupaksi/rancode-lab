// Type assertions stay in the compiler worker and never execute in the app.
export const assertionHelpers = `
type __UnderCodeAssert<T extends true> = T;
type __UnderCodeShape<T> = { [K in keyof T]: T[K] };
type __UnderCodeEqual<A, B> =
  0 extends (1 & A) ? false :
  0 extends (1 & B) ? false :
  (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2)
    ? (<T>() => T extends B ? 1 : 2) extends (<T>() => T extends A ? 1 : 2) ? true : false
    : false;
`
