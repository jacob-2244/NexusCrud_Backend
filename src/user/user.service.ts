import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Users, UserRole } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private repo: Repository<Users>,
  ) { }

  async create(name: string, email: string, role: UserRole = UserRole.MANAGER) {

    try {
  const user = this.repo.create({ name, email, role });
  return await this.repo.save(user);
} catch (err) {
  if (err.code === '23505') { // PostgreSQL unique violation
    throw new ConflictException('Email already exists');
  }
  throw err;
}
  }

  async login(email: string) {
    const user = await this.repo.findOneBy({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
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
