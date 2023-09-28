import { Controller } from "@nestjs/common";
import { UsersService } from "./users.service";
import {
  UsersServiceController,
  CreateUserDto,
  UpdateUserDto,
  UsersServiceControllerMethods,
  FindOneUserDto,
  PaginationDto,
  User,
  Users,
} from "@app/common";
import { Observable } from "rxjs";

@Controller()
@UsersServiceControllerMethods()
export class UsersController implements UsersServiceController {
  constructor(private readonly usersService: UsersService) {}
  createUser(request: CreateUserDto): User | Promise<User> | Observable<User> {
    return this.usersService.create(request);
  }
  findAllUsers(): Users | Promise<Users> | Observable<Users> {
    return this.usersService.findAll();
  }
  findOneUser(
    request: FindOneUserDto,
  ): User | Promise<User> | Observable<User> {
    return this.usersService.findOne(request.id);
  }
  updateUser(request: UpdateUserDto): User | Promise<User> | Observable<User> {
    return this.usersService.update(request.id, request);
  }
  removeUser(request: FindOneUserDto) {
    return this.usersService.remove(request.id);
  }
  queryUsers(request: Observable<PaginationDto>): Observable<Users> {
    return this.usersService.queryUsers(request);
  }
}
