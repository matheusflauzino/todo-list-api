import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { PrismaService } from '../prisma/prisma.service';
import { Todo } from '@prisma/client';

describe('TodoService', () => {
  let service: TodoService;
  let prismaService: PrismaService;

  const mockTodo: Todo = {
    id: 1,
    title: 'Test Todo',
    completed: false,
    createdAt: new Date(),
  };

  const prismaServiceMock = {
    todo: {
      create: jest.fn().mockResolvedValue(mockTodo),
      findMany: jest.fn().mockResolvedValue([mockTodo]),
      findUnique: jest.fn().mockResolvedValue(mockTodo),
      update: jest.fn().mockResolvedValue(mockTodo),
      delete: jest.fn().mockResolvedValue(mockTodo),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTodo', () => {
    it('should create a new todo', async () => {
      const todoData = { title: 'Test Todo' };
      const result = await service.createTodo(todoData);
      expect(result).toEqual(mockTodo);
      expect(prismaService.todo.create).toHaveBeenCalledWith({
        data: todoData,
      });
    });
  });

  describe('getTodos', () => {
    it('should return an array of todos', async () => {
      const result = await service.getTodos();
      expect(result).toEqual([mockTodo]);
      expect(prismaService.todo.findMany).toHaveBeenCalled();
    });
  });

  describe('getTodoById', () => {
    it('should return a single todo by id', async () => {
      const result = await service.getTodoById(1);
      expect(result).toEqual(mockTodo);
      expect(prismaService.todo.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('updateTodo', () => {
    it('should update a todo', async () => {
      const todoData = { title: 'Updated Test Todo', completed: true };
      const result = await service.updateTodo(1, todoData);
      expect(result).toEqual(mockTodo);
      expect(prismaService.todo.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: todoData,
      });
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo', async () => {
      const result = await service.deleteTodo(1);
      expect(result).toEqual(mockTodo);
      expect(prismaService.todo.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
