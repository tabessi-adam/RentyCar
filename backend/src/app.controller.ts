import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Endpoint for the frontend to call
  @Get('api/data') // Matches the path used in the Angular service
  getApiData(): { message: string } {
    console.log('GET /api/data called');
    return { message: 'Hello from NestJS Backend!' };
  }
}
