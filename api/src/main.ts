import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from "express-session"; 
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import  { PrismaClient } from '@prisma/client';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true
  });

  app.use(
    session({
      secret: process.env.API_COOKIE_SECRET!,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24* 60 * 60 * 1_000 //ms
      },
      store: new PrismaSessionStore(
        new PrismaClient(),
        {
          checkPeriod: 2 * 60 * 1000,  //ms
          dbRecordIdIsSessionId: true,
          dbRecordIdFunction: undefined,
        }
      )
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  
  try {
    const port = process.env.API_PORT || 3000;
    await app.listen(port);
    console.log(`Running on port ${port}`);
  }
  catch (error) {
    console.log(error);
  }
}
bootstrap();