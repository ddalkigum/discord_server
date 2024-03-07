const DEFAULT_PORT = '3000';
const DEFAULT_BASE_URL = 'localhost:3000';

const serverConfig = {
  port: process.env.PORT || DEFAULT_PORT,
  baseUrl: process.env.BASE_URL || DEFAULT_BASE_URL
}

export default serverConfig;