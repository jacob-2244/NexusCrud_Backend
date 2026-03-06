import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const isProduction = process.env.NODE_ENV === 'production';

  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://192.168.10.195:3001',  // Device IP for supervisor access
    'http://192.168.10.195:3000',  // Device IP alternate port
    'http://192.168.56.1:3000',    // VM / VirtualBox host network
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow tools like Postman / curl
      if (!origin) return callback(null, true);

      if (!isProduction) {
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error(`Not allowed by CORS: ${origin}`));
      }

      // Production: allow deployed frontend
      return callback(null, true);
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  const port = parseInt(process.env.PORT || '3000');
  await app.listen(port, '0.0.0.0');
  console.log(`Backend running on http://0.0.0.0:${port}`);
  console.log(`Available at: http://192.168.10.195:${port}`);
}

bootstrap();
