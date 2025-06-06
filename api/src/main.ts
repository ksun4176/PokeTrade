import 'reflect-metadata';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from "express-session"; 
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import  { PrismaClient } from '@prisma/client';
import passport from 'passport';
import { MyLoggerService } from './mylogger/mylogger.service';
import { HttpExceptionFilter } from './httpexceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(MyLoggerService));
  
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpExceptionFilter(httpAdapter));

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: [process.env.APP_URL!],
    credentials: true
  });

  app.use(
    session({
      secret: process.env.API_COOKIE_SECRET!,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1_000 //ms
      },
      store: new PrismaSessionStore(
        new PrismaClient(),
        {
          checkPeriod: 12 * 60 * 60 * 1_000,  //ms
          dbRecordIdIsSessionId: true,
          dbRecordIdFunction: undefined,
        }
      )
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  
  try {
    const port = process.env.API_PORT || 9000;
    await app.listen(port);
    console.log(`Running on port ${port}`);
  }
  catch (error) {
    console.error(error);
  }
}
bootstrap();