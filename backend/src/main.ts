import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors(); // You might want to configure this more restrictively in production

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
