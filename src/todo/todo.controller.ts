import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo } from '@prisma/client';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  async createTodo(@Body() todoData: { title: string }): Promise<Todo> {
    return this.todoService.createTodo({
      title: todoData.title,
    });
  }

  @Get()
  async getTodos(): Promise<Todo[]> {
    return this.todoService.getTodos();
  }

  @Get(':id')
  async getTodoById(@Param('id') id: string): Promise<Todo> {
    return this.todoService.getTodoById(Number(id));
  }

  @Patch(':id')
  async updateTodo(
    @Param('id') id: string,
    @Body() todoData: { title?: string; completed?: boolean },
  ): Promise<Todo> {
    return this.todoService.updateTodo(Number(id), todoData);
  }

  @Delete(':id')
  async deleteTodo(@Param('id') id: string): Promise<Todo> {
    return this.todoService.deleteTodo(Number(id));
  }
}
