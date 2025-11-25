

import { Controller,Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController{
  constructor(private readonly Appservice: AppService){}

  @Get()
  getHello(): string{
    return this.Appservice.getHello()
  }
}