import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable WebSockets (Socket.IO)
  app.useWebSocketAdapter(new IoAdapter(app));

  app.use(
  '/audio',
  express.static(join(__dirname, '..', 'uploads', 'audio'), {
    setHeaders: (res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
    },
  }),
);
  
  // This serves files from uploads/files at /files/ endpoint
  app.use('/files', express.static(join(__dirname, '..', 'uploads', 'files')));

  // Optional: Keep the general uploads endpoint for backward compatibility
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  // Allow CORS for frontend (adjust port if needed)
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  await app.listen(3001);
}
bootstrap();