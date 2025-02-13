import { addBigInt, formatFeePercentage, formatBalance, applyFee } from '../utils';

describe('Utility Functions', () => {
  test('addBigInt should correctly add two bigints', () => {
    expect(addBigInt(1n, 2n)).toBe(3n);
    expect(addBigInt(undefined, 2n)).toBe(2n);
    expect(addBigInt(1n, undefined)).toBe(1n);
    expect(addBigInt(undefined, undefined)).toBeUndefined();
  });

  test('formatFeePercentage should format fee percentage correctly', () => {
    expect(formatFeePercentage(1000000000000000000n, 18)).toBe('100%');
    expect(formatFeePercentage(undefined, 18)).toBe('0%');
  });

  test('formatBalance should format balance correctly', () => {
    expect(formatBalance('123.456789')).toBe('123.4568');
    expect(formatBalance(undefined)).toBe('0');
  });

  test('applyFee should apply fee correctly', () => {
    expect(applyFee(1000000000000000000n, 100000000000000000n)).toBe(900000000000000000n);
    expect(applyFee(undefined, 100000000000000000n)).toBeUndefined();
    expect(applyFee(1000000000000000000n, undefined)).toBeUndefined();
  });
});