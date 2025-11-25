import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseCheckService implements OnApplicationBootstrap {
  constructor(private dataSource: DataSource) {}

  async onApplicationBootstrap() {
    try {
      await this.dataSource.query('SELECT 1');
      console.log('✅ PostgreSQL Connected Successfully!');
    } catch (err) {
      console.log('❌ PostgreSQL Connection Failed!');
      console.error(err);
    }
  }
}
