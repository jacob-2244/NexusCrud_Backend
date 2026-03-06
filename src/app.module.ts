import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || process.env.DB_PASS || 'postgres',
      database: process.env.DB_NAME || 'Crud_db',
      autoLoadEntities: true,
      synchronize: true,
      ssl: process.env.DB_HOST && !process.env.DB_HOST.includes('localhost')
        ? { rejectUnauthorized: false }
        : false,
      extra: {
        family: 4, // IMPORTANT: force IPv4
      },
    }),
    UserModule,
  ],
})
export class AppModule {}

