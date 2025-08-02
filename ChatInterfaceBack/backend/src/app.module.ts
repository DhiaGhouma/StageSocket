import { Module } from '@nestjs/common';
import { ChatGateway } from './Chat/chat.gateway';
import { ChatController } from './chat/chatcontroller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/',
    }),
  ],
  controllers: [ChatController],
  providers: [ChatGateway],
})
export class AppModule {}