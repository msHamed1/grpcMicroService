import { Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";

import { User } from "@app/common";
import {
  CreateUserDto,
  PaginationDto,
  UpdateUserDto,
  Users,
} from "../../../../libs/common/src/types/auth";
import { randomUUID } from "crypto";
import { Observable, Subject } from "rxjs";

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly users: User[] = [];

  onModuleInit() {
    for (let i = 0; i <= 100; i++) {
      this.create({ username: randomUUID(), password: randomUUID(), age: 0 });
    }
  }
  create(createUserDto: CreateUserDto) {
    const user: User = {
      ...createUserDto,
      subscribed: false,
      socialMedia: {},
      id: randomUUID(),
    };
    this.users.push(user);
    return user;
  }

  findAll(): Users {
    return { users: this.users };
  }

  findOne(id: string) {
    return this.users.find((user) => user.id === id);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex !== -1) {
      this.users[userIndex] = {
        ...this.users[userIndex],
        ...updateUserDto,
      };
      return this.users[userIndex];
    }

    throw new NotFoundException("User notfound ");
  }

  remove(id: string) {
    const userIndex = this.users.findIndex((user) => user.id === id);

    if (userIndex !== -1) {
      return this.users.splice(userIndex)[0];
    }
    throw new NotFoundException("User notfound ");
  }

  queryUsers(paginationStream: Observable<PaginationDto>): Observable<Users> {
    const subject = new Subject<Users>();
    const onNext = (paginationDto: PaginationDto) => {
      const start = paginationDto.page * paginationDto.skip;
      subject.next({
        users: this.users.slice(start, start + paginationDto.skip),
      });
    };

    const onCompleate = () => subject.complete();
    paginationStream.subscribe({
      next: onNext,
      complete: onCompleate,
    });

    return subject.asObservable();
  }
}
