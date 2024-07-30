import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClient, Todo } from '@prisma/client';

describe('TodoController', () => {
  let todoController: TodoController;
  let todoService: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        TodoService,
        PrismaService,
        {
          provide: PrismaService,
          useValue: new PrismaClient(),
        },
      ],
    }).compile();

    todoService = module.get<TodoService>(TodoService);
    todoController = module.get<TodoController>(TodoController);
  });

  describe('createTodo', () => {
    it('should create a new todo', async () => {
      const newTodo: Todo = {
        id: 1,
        title: 'Test Todo',
        completed: false,
        createdAt: new Date(),
      };
      jest
        .spyOn(todoService, 'createTodo')
        .mockImplementation(async () => newTodo);

      expect(await todoController.createTodo({ title: 'Test Todo' })).toBe(
        newTodo,
      );
    });
  });

  describe('getTodos', () => {
    it('should return an array of todos', async () => {
      const result: Todo[] = [
        { id: 1, title: 'Test Todo', completed: false, createdAt: new Date() },
      ];
      jest
        .spyOn(todoService, 'getTodos')
        .mockImplementation(async () => result);

      expect(await todoController.getTodos()).toBe(result);
    });
  });

  describe('getTodoById', () => {
    it('should return a single todo by id', async () => {
      const result: Todo = {
        id: 1,
        title: 'Test Todo',
        completed: false,
        createdAt: new Date(),
      };
      jest
        .spyOn(todoService, 'getTodoById')
        .mockImplementation(async () => result);

      expect(await todoController.getTodoById('1')).toBe(result);
    });
  });

  describe('updateTodo', () => {
    it('should update a todo', async () => {
      const result: Todo = {
        id: 1,
        title: 'Updated Test Todo',
        completed: true,
        createdAt: new Date(),
      };
      jest
        .spyOn(todoService, 'updateTodo')
        .mockImplementation(async () => result);

      expect(
        await todoController.updateTodo('1', {
          title: 'Updated Test Todo',
          completed: true,
        }),
      ).toBe(result);
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo', async () => {
      const result: Todo = {
        id: 1,
        title: 'Test Todo',
        completed: false,
        createdAt: new Date(),
      };
      jest
        .spyOn(todoService, 'deleteTodo')
        .mockImplementation(async () => result);

      expect(await todoController.deleteTodo('1')).toBe(result);
    });
  });
});
