import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TodoModule } from './todo.module';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClient } from '@prisma/client';

describe('TodoModule (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TodoModule],
      providers: [
        {
          provide: PrismaService,
          useValue: new PrismaClient(), // Use um mock ou um PrismaClient real configurado para testes
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prismaService = moduleFixture.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await app.close();
  });

  it('/todos (POST)', async () => {
    const createTodoDto = { title: 'Test Todo' };
    return request(app.getHttpServer())
      .post('/todos')
      .send(createTodoDto)
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('title', createTodoDto.title);
        expect(response.body).toHaveProperty('completed', false);
      });
  });

  it('/todos (GET)', async () => {
    return request(app.getHttpServer())
      .get('/todos')
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body)).toBe(true);
      });
  });

  it('/todos/:id (GET)', async () => {
    const todo = await prismaService.todo.create({
      data: { title: 'Test Todo' },
    });
    return request(app.getHttpServer())
      .get(`/todos/${todo.id}`)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('id', todo.id);
        expect(response.body).toHaveProperty('title', todo.title);
      });
  });

  it('/todos/:id (PATCH)', async () => {
    const todo = await prismaService.todo.create({
      data: { title: 'Test Todo' },
    });
    const updateTodoDto = { title: 'Updated Todo', completed: true };
    return request(app.getHttpServer())
      .patch(`/todos/${todo.id}`)
      .send(updateTodoDto)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('id', todo.id);
        expect(response.body).toHaveProperty('title', updateTodoDto.title);
        expect(response.body).toHaveProperty(
          'completed',
          updateTodoDto.completed,
        );
      });
  });

  it('/todos/:id (DELETE)', async () => {
    const todo = await prismaService.todo.create({
      data: { title: 'Test Todo' },
    });
    return request(app.getHttpServer())
      .delete(`/todos/${todo.id}`)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('id', todo.id);
      });
  });
});
