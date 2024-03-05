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
  ChannelRepository: Symbol.for('ChannelRepository')
}