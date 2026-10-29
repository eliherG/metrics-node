# Evidencia de implementación – Práctica Técnica API de métricas

**Candidato:** Eliher · **Stack utilizado:** NestJS (Node.js / TypeScript) · **Entorno:** Node v24.18.0, npm 11.16.0, Windows

## 1. Resumen

Se construyó una API REST con el endpoint `GET /api/metrics` que calcula las métricas solicitadas sobre la lista de 30 números del enunciado, y una página HTML que consume el endpoint y las muestra. No se usó base de datos ni librerías de estadística.

El enunciado plantea Java 17 + Spring Boot. La entrega se realizó en NestJS conservando la misma arquitectura por capas (Controller, Service, DTO, manejo global de errores y pruebas unitarias), de modo que la lógica es directamente trasladable a Spring Boot. La aplicación no llegó a ejecutarse durante la entrevista en vivo; la causa del error y la verificación posterior están en las secciones 7 y 8.

## 2. Requerimientos y estado

| Requerimiento | Estado | Dónde |
| --- | --- | --- |
| `GET /api/metrics` | Implementado | `metrics.controller.ts` |
| totalElementos, sumaTotal, media | Implementado | `metrics.service.ts` |
| sumaPares, sumaImpares | Implementado | `metrics.service.ts` |
| ordenAscendente, ordenDescendente | Implementado | `metrics.service.ts` |
| Frontend HTML | Implementado | `public/index.html` |
| Sin base de datos | Cumplido | No hay dependencias ni configuración de BD |
| Sin librerías de estadística | Cumplido | Cálculo con ciclos y aritmética |
| Mediana (extra) | Implementado | `metrics.service.ts` |
| Eliminar duplicados (extra) | Implementado | `Set` en `metrics.service.ts` |
| Top 5 mayores (extra) | Implementado | `metrics.service.ts` |
| Manejo de errores (extra) | Implementado | `all-exceptions.filter.ts` |
| Pruebas unitarias (extra) | Implementado | `metrics.service.spec.ts` |

*Estado verificado después de la entrevista, no durante ella (ver sección 8).*

## 3. Arquitectura

- **Controller:** recibe la petición HTTP y delega.
- **Service:** contiene toda la lógica de cálculo.
- **DTO (`MetricsResponse`):** contrato de la respuesta.
- **Exception Filter:** convierte cualquier error en JSON `{ "error": "..." }`.
- **Frontend estático:** servido por la misma app desde `public/`, por lo que no requiere CORS.

## 4. Decisiones técnicas y justificación

| Decisión | Justificación |
| --- | --- |
| Un solo recorrido para suma, pares e impares | Complejidad O(n) y código simple de explicar |
| `sort((a, b) => a - b)` sobre una copia | `sort()` sin comparador ordena como texto; la copia evita mutar los datos originales |
| `Set` para duplicados | Elimina repetidos conservando el orden de primera aparición |
| Mediana sobre la lista ya ordenada | Reutiliza el orden; maneja cantidad par e impar |
| Lista vacía responde 400 | Evita división entre cero y entrega un error claro |
| Filtro global de excepciones | Respuestas de error consistentes, equivalente a `@RestControllerAdvice` |

Complejidad total: O(n) para las sumas y O(n log n) por el ordenamiento.

## 5. Valores esperados con el dataset original

| Métrica | Valor |
| --- | --- |
| totalElementos | 30 |
| sumaTotal | 182790 |
| media | 6093 |
| sumaPares | 49452 |
| sumaImpares | 133338 |
| mediana | 319 |
| top5Mayores | 99999, 45000, 9001, 8421, 6543 |
| sinDuplicados | 30 elementos (la lista no tiene repetidos) |

## 6. Cómo ejecutar

```
npm install
npm run start:dev
npm test
```

- API: http://localhost:3000/api/metrics
- Frontend: http://localhost:3000/

## 7. Incidencia durante la entrevista

La aplicación no se ejecutó en la sesión en vivo porque el compilador de TypeScript en modo watch reportó 7 errores `TS2307` ("Cannot find module") y no se resolvieron dentro del tiempo.

| Aspecto | Detalle |
| --- | --- |
| Síntoma | 7 errores `TS2307` en `app.module.ts`, `main.ts`, `metrics.controller.ts` y `metrics.service.ts`; el servidor no arrancaba |
| Corrección aplicada | Línea 3 de `src/metrics/metrics.controller.ts`: `import { MetricsResponse }` cambió a `import type { MetricsResponse }` |
| Causa probable | Con `isolatedModules` y `emitDecoratorMetadata` activos (valores por defecto en plantillas recientes de Nest), un tipo usado en la firma de un método decorado debe importarse con `import type`. `MetricsResponse` es una interfaz y no existe en tiempo de ejecución |
| Resultado | El proyecto compila y `GET /api/metrics` devuelve el JSON esperado (sección 8) |

La causa se identificó por la corrección que resolvió el error; no se aisló con una prueba aparte.

Lo que haría distinto en una prueba en vivo: compilar con `npm run build` después de crear cada archivo y probar el endpoint antes de escribir el frontend, para detectar el error al inicio y no al final.

## 8. Resultados de ejecución

Verificación realizada después de la entrevista, con el proyecto compilando y corriendo en local (Node v24.18.0, npm 11.16.0). La respuesta real de `GET /api/metrics` coincide con los valores esperados:

| Métrica | Esperado | Obtenido |
| --- | --- | --- |
| totalElementos | 30 | 30 |
| sumaTotal | 182790 | 182790 |
| media | 6093 | 6093 |
| sumaPares | 49452 | 49452 |
| sumaImpares | 133338 | 133338 |
| mediana | 319 | 319 |
| top5Mayores | 99999, 45000, 9001, 8421, 6543 | 99999, 45000, 9001, 8421, 6543 |
| ordenAscendente | de 7 a 99999 | de 7 a 99999 |
| ordenDescendente | de 99999 a 7 | de 99999 a 7 |
| sinDuplicados | 30 elementos | 30 elementos |

Por adjuntar (marcar al completar):

- [x] Captura del JSON en `http://localhost:3000/api/metrics`
- [x] Captura de `npm test` con las pruebas en verde
- [x] Enlace al repositorio de GitHub

## 9. Uso de IA

El enunciado permite expresamente el uso de IA y de documentación oficial. Se usó un asistente de IA (Claude) como apoyo para estructurar el proyecto, generar el código base y explicar las decisiones. Después de la entrevista, el código se ejecutó en local y se validó contra los valores esperados de la sección 5.

## 10. Limitaciones y mejoras posibles

- Los datos están fijos en el servicio; una mejora sería aceptar la lista por `POST /api/metrics`.
- Agregar validación de entrada con `class-validator` si se acepta una lista externa.
- Agregar pruebas e2e del endpoint con Supertest.
