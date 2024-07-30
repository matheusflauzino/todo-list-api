import { Injectable } from '@nestjs/common';
import { Prisma, Todo } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  async createTodo(data: Prisma.TodoCreateInput): Promise<Todo> {
    return this.prisma.todo.create({ data });
  }

  async getTodos(): Promise<Todo[]> {
    return this.prisma.todo.findMany();
  }

  async getTodoById(id: number): Promise<Todo> {
    return this.prisma.todo.findUnique({ where: { id } });
  }

  async updateTodo(id: number, data: Prisma.TodoUpdateInput): Promise<Todo> {
    return this.prisma.todo.update({ where: { id }, data });
  }

  async deleteTodo(id: number): Promise<Todo> {
    return this.prisma.todo.delete({ where: { id } });
  }
}
