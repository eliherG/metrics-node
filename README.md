# Metrics API – Práctica Técnica

API REST que calcula métricas sobre una lista fija de números y una página HTML que las muestra.

> **Nota sobre el stack:** el enunciado original plantea Java 17 + Spring Boot. Esta entrega está hecha en **NestJS (TypeScript)** manteniendo la misma arquitectura por capas (Controller → Service → DTO, manejo global de excepciones y pruebas unitarias). Ver sección "Equivalencias con Spring Boot".

## Requisitos

- Node.js 20 o superior (probado con v24)
- npm 10 o superior

## Instalación y ejecución

```bash
npm install
npm run start:dev
```

- API: http://localhost:3000/api/metrics
- Frontend: http://localhost:3000/

## Pruebas unitarias

```bash
npm test
```

## Endpoint

### `GET /api/metrics`

Respuesta `200 OK`:

| Campo | Descripción |
|---|---|
| `totalElementos` | Cantidad de elementos de la lista |
| `sumaTotal` | Suma de todos los elementos |
| `media` | Promedio (suma / total) |
| `sumaPares` | Suma de los elementos pares |
| `sumaImpares` | Suma de los elementos impares |
| `ordenAscendente` | Lista ordenada de menor a mayor |
| `ordenDescendente` | Lista ordenada de mayor a menor |
| `mediana` | Valor central de la lista ordenada (extra) |
| `sinDuplicados` | Lista sin repetidos, conservando el orden original (extra) |
| `top5Mayores` | Los 5 valores más grandes (extra) |

Errores: se devuelven en JSON con la forma `{ "error": "mensaje" }`.

## Estructura

```
src/
  main.ts                          # arranque, filtro global y archivos estáticos
  app.module.ts
  metrics/
    metrics.controller.ts          # GET /api/metrics
    metrics.service.ts             # lógica de cálculo
    metrics.service.spec.ts        # pruebas unitarias
    dto/metrics-response.dto.ts    # contrato de respuesta
  common/all-exceptions.filter.ts  # manejo de errores
public/index.html                  # frontend
```

## Decisiones técnicas

- **Sin base de datos:** los datos son una constante; no hay nada que persistir.
- **Sin librerías de estadística:** sumas, media y mediana se calculan con ciclos y aritmética simple.
- **Ordenamiento:** `sort((a, b) => a - b)` sobre una copia del arreglo. El comparador numérico es necesario porque `sort()` por defecto ordena como texto, y la copia evita mutar el original.
- **Duplicados:** `Set` conserva el orden de primera aparición.
- **Complejidad:** O(n) para las sumas y O(n log n) por el ordenamiento.
- **Errores:** un filtro global convierte cualquier excepción en una respuesta JSON consistente; una lista vacía responde `400`.

## Equivalencias con Spring Boot

| Spring Boot | NestJS |
|---|---|
| `@RestController` + `@GetMapping` | `@Controller('api')` + `@Get('metrics')` |
| `@Service` | `@Injectable()` |
| `record MetricsResponse` | `interface MetricsResponse` |
| `@RestControllerAdvice` | Exception Filter (`@Catch()`) |
| `static/index.html` | `public/index.html` |
| JUnit 5 | Jest |

## Uso de IA

El enunciado permite el uso de IA. Se utilizó un asistente de IA como apoyo para estructurar el proyecto y revisar el código. Las decisiones y su justificación están documentadas arriba.
