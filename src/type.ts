export const TYPES = {
  // Infrastructure
  Server: Symbol.for('Server'),
  WinstonLogger: Symbol.for('WinstonLogger'),
  MongoClient: Symbol.for("MongoClient"),

  // Common
  ApiResponse: Symbol.for('ApiResponse'),

  // Domain
  ChannelRouter: Symbol.for('ChannelRouter'),
  ChannelService: Symbol.for('ChannelService'),

  ChatRouter: Symbol.for('ChatRouter'),
  ChatService: Symbol.for('ChatService'),

  ServerRouter: Symbol.for('ServerRouter'),
  ServerService: Symbol.for('ServerService'),

  UserRouter: Symbol.for('UserRouter'),
  UserService: Symbol.for('UserService'),
}