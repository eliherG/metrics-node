import { Controller, Get } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import type { MetricsResponse } from './dto/metrics-response.dto';

@Controller('api')
export class MetricsController {
  constructor(private readonly service: MetricsService) {}

  @Get('metrics')
  getMetrics(): MetricsResponse {
    return this.service.calculate();
  }
}
