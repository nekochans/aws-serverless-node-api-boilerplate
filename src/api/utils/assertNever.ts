/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/ban-ts-comment */
// @ts-ignore
const assertNever = (x: never): never => {
  throw new Error('Unexpected value. Should have been never.');
};
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/ban-ts-comment */

export default assertNever;
