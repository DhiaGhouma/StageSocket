import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join-chat')
  handleJoinChat(
    @MessageBody()
    chatId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(chatId);
    console.log(`Client ${client.id} joined chat ${chatId}`);
  }

  @SubscribeMessage('send-message')
  handleSendMessage(
    @MessageBody() messageData: any,
    @ConnectedSocket()
    client: Socket,
  ) {
    client.to(messageData.chatId).emit('receive-message', messageData);
    client.emit('message-sent', messageData);
  }
}
