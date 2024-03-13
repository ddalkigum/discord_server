export const TYPES = {
  // Infrastructure
  ExpressServer: Symbol.for('ExpressServer'),
  WinstonLogger: Symbol.for('WinstonLogger'),
  MongoClient: Symbol.for('MongoClient'),
  Middleware: Symbol.for('Middleware'),
  SocketServer: Symbol.for('SocketServer'),
  RedisClient: Symbol.for('RedisClient'),

  // Common
  ApiResponse: Symbol.for('ApiResponse'),

  // Domain
  AuthRouter: Symbol.for('AuthRouter'),
  AuthService: Symbol.for('AuthService'),

  ChannelRouter: Symbol.for('ChannelRouter'),
  ChannelService: Symbol.for('ChannelService'),

  ChatRouter: Symbol.for('ChatRouter'),
  ChatService: Symbol.for('ChatService'),

  ServerRouter: Symbol.for('ServerRouter'),
  ServerService: Symbol.for('ServerService'),

  UserRouter: Symbol.for('UserRouter'),
  UserService: Symbol.for('UserService'),
}