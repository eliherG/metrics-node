/* eslint-disable @typescript-eslint/no-floating-promises */
import { BadRequestException } from '@nestjs/common';
import { strict as assert } from 'node:assert';
import { MetricsService } from './metrics.service';
import { describe, it } from 'node:test';

describe('MetricsService', () => {
  const service = new MetricsService();

  it('calcula las métricas del dataset original', () => {
    const r = service.calculate();
    expect(r.totalElementos).toBe(30);
    expect(r.sumaTotal).toBe(182790);
    expect(r.media).toBe(6093);
    expect(r.sumaPares).toBe(49452);
    expect(r.sumaImpares).toBe(133338);
    expect(r.mediana).toBe(319);
    expect(r.top5Mayores).toEqual([99999, 45000, 9001, 8421, 6543]);
  });

  it('mediana con cantidad impar', () => {
    expect(service.calculate([5, 1, 3]).mediana).toBe(3);
  });

  it('elimina duplicados', () => {
    expect(service.calculate([1, 2, 2, 3, 1]).sinDuplicados).toEqual([1, 2, 3]);
  });

  it('lista vacía lanza excepción', () => {
    expect(() => service.calculate([])).toThrow(BadRequestException);
  });
});
function expect(actual: unknown) {
  return {
    toBe(expected: unknown) {
      assert.strictEqual(actual, expected);
    },
    toEqual(expected: unknown) {
      assert.deepStrictEqual(actual, expected);
    },
    toThrow(expected?: new (...args: any[]) => Error) {
      if (typeof actual !== 'function') {
        throw new TypeError('Expected a function');
      }
      if (expected === undefined) {
        assert.throws(actual as () => unknown);
      } else {
        assert.throws(
          actual as () => unknown,
          (error: unknown) => error instanceof expected,
        );
      }
    },
  };
}
