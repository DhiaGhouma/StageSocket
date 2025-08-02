import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable WebSockets (Socket.IO)
  app.useWebSocketAdapter(new IoAdapter(app));

  // Serve static files from /uploads
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  // Allow CORS for frontend (adjust port if needed)
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  await app.listen(3001);
}
bootstrap();
