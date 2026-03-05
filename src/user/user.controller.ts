import { Body, Controller, Get, Param, Post, Patch, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRole } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Create a new user
  @Post()
  create(@Body() body: { name: string; email: string; role?: UserRole }) {
    return this.userService.create(body.name, body.email, body.role);
  }

  // Login with email
  @Post('login')
  login(@Body() body: { email: string }) {
    return this.userService.login(body.email);
  }

  // Get all users
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  // Get a single user by id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(parseInt(id));
  }

  // Update a user by id
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: Partial<{ name: string; email: string; role: UserRole }>) {
    return this.userService.update(parseInt(id), body);
  }

  // Delete a user by id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(parseInt(id));
  }
}