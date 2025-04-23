import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigModule } from '@nestjs/config';

async function bootstrap() {
  // Load environment variables
  await ConfigModule.forRoot({
    isGlobal: true,
  });

  const app = await NestFactory.create(AppModule);

  // Enable CORS with proper configuration
  app.enableCors({
    origin: true, // Allow all origins in development
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Listen on all network interfaces
  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: http://0.0.0.0:${port}`);
}
bootstrap();
