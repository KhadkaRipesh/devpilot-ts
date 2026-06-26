import { describe, it } from 'node:test';
import { add, subtract, multiply, divide, factorial } from './math.js';
import assert from 'node:assert';

describe('Math Functions', () => {
  describe('add', () => {
    it('should return the sum of two numbers', () => {
      assert.strictEqual(add(1, 2), 3);
      assert.strictEqual(add(-1, 1), 0);
      assert.strictEqual(add(0, 0), 0);
    });
  })

  describe('subtract', () => {
    it('should return the difference of two numbers', () => {
      assert.strictEqual(subtract(5, 2), 3);
      assert.strictEqual(subtract(2, 5), -3);
      assert.strictEqual(subtract(0, 0), 0);
    });
  })

  describe('multiply', () => {
    it('should return the product of two numbers', () => {
      assert.strictEqual(multiply(2, 3), 6);
      assert.strictEqual(multiply(-2, 3), -6);
      assert.strictEqual(multiply(0, 5), 0);
    });
  })

  describe('divide', () => {
    it('should return the quotient of two numbers', () => {
      assert.strictEqual(divide(6, 2), 3);
      assert.strictEqual(divide(8, 2), 4);
      assert.strictEqual(divide(5, 2), 2.5);
    });

    it('should throw an error if dividing by zero', () => {
      return assert.throws(() => divide(1, 0), Error, "Cannot divide by zero");
    });
  })

  describe('factorial', () => {
    it('should return the factorial of a non-negative number', () => {
      assert.strictEqual(factorial(0), 1);
      assert.strictEqual(factorial(1), 1);
      assert.strictEqual(factorial(5), 120);
    });

    it('should throw an error if the input is a negative number', () => {
      return assert.throws(() => factorial(-1), Error, "Negative numbers not allowed");
    });
  })
});