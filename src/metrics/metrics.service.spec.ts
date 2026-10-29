import { BadRequestException } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { describe, it, expect } from '@jest/globals';

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
