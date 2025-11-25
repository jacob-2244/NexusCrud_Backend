import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const isProduction = process.env.NODE_ENV === 'production';


  const localFrontend = 'http://localhost:3001';

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); 

      if (!isProduction) {
        // In dev, only allow local frontend
        if (origin === localFrontend) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      } else {
        // In production, allow any origin (your deployed frontend will work automatically)
        callback(null, true);
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = parseInt(process.env.PORT || '3000');
  await app.listen(port);
  console.log(`Backend running on port ${port}`);
}

bootstrap();
