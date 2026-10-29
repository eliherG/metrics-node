import { BadRequestException, Injectable } from '@nestjs/common';
import { MetricsResponse } from './dto/metrics-response.dto';

const DATA: number[] = [
  17, 204, 55, 81, 902, 33, 710, 12, 6543, 88, 19, 456, 72, 9001, 123, 76, 4555,
  997, 31, 600, 248, 1111, 45000, 7, 390, 8421, 678, 99999, 2345, 16,
];

@Injectable()
export class MetricsService {
  calculate(data: number[] = DATA): MetricsResponse {
    if (!data || data.length === 0) {
      throw new BadRequestException('La lista de datos no puede estar vacía');
    }

    let suma = 0;
    let pares = 0;
    let impares = 0;
    for (const n of data) {
      suma += n;
      if (n % 2 === 0) pares += n;
      else impares += n;
    }

    // [...data] copia el arreglo; sort() sin comparador ordena como texto
    const asc = [...data].sort((a, b) => a - b);
    const desc = [...asc].reverse();

    return {
      totalElementos: data.length,
      sumaTotal: suma,
      media: suma / data.length,
      sumaPares: pares,
      sumaImpares: impares,
      ordenAscendente: asc,
      ordenDescendente: desc,
      mediana: this.mediana(asc),
      sinDuplicados: [...new Set(data)],
      top5Mayores: desc.slice(0, 5),
    };
  }

  private mediana(sorted: number[]): number {
    const n = sorted.length;
    const mid = Math.floor(n / 2);
    return n % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }
}
