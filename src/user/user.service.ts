import { Injectable } from '@nestjs/common';
import { Users } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private repo: Repository<Users>,
  ) {}

  async create(name: string, email: string) {
    const user = await this.repo.create({ name, email });
    return await this.repo.save(user);
  }

  async remove(id: number) {
    return await this.repo.delete(id);
  }

   async findAll() {
    return await this.repo.find();
  }
  async findOne(id: number) {
    return await this.repo.findOneBy({ id });
  }

  async update(id: number, data: Partial<Users>) {
    await this.repo.update(id, data);
    return await this.findOne(id);
  }
}
