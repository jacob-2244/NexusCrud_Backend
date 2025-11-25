
import { Body, Controller, Get, Param, Post, Patch, Delete } from '@nestjs/common';
import { UserService } from './user.service';


@Controller('users')
export class UserController {
constructor(private userService:UserService){}


@Post()
create(@Body() body:{name:string, email:string}){
    return this.userService.create(body.name, body.email)
}

@Delete(":id")
remove(@Param("id") id:string ){
    return this.userService.remove(parseInt(id))
}


@Get()
findAll(){
    return this.userService.findAll()
}

@Get(":id")
findOne(@Param("id") id:string){
    return this.userService.findOne(parseInt(id))

}

@Patch(":id")
update(@Param("id") id:string, @Body() body ){
    return this.userService.update(parseInt(id), body)

}

}
