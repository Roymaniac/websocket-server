import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { Message } from '../interfaces/message';

const HEARTBEAT_INTERVAL = 5000;

@WebSocketGateway()
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('EventsGateway');

  private heartbeatInterval: NodeJS.Timeout;

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: Message,
    @ConnectedSocket() client: Socket,
  ): void {
    this.logger.log(`Received message from ${client.id}: ${data}`);
    this.server.emit('message', data);
  }

  handleConnection(client: Socket): void {
    this.logger.log(`Client connected: ${client.id}`);
    this.heartbeatInterval = setInterval(() => {
      client.emit('heartbeat', 'heartbeat');
    }, HEARTBEAT_INTERVAL);
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client.id}`);
    clearInterval(this.heartbeatInterval);
  }

  handleError(client: Socket, error: Error): void {
    this.logger.error(`Client error: ${error}`);
    clearInterval(this.heartbeatInterval);
  }
}
