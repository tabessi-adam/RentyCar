import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigModule } from '@nestjs/config';

async function bootstrap() {
  // Load environment variables
  await ConfigModule.forRoot({
    isGlobal: true,
  });

  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors(); // You might want to configure this more restrictively in production

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
