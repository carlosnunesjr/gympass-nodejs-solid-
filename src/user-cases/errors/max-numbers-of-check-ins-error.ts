export class MaxNumbersOfCheckInsError extends Error {
  constructor() {
    super("Max numbers od check-ins reached.");
  }
}
