import { injectable } from 'inversify';
import { IServerService, ServerType } from './interface';

@injectable()
export default class ServerService implements IServerService {
  public getParticipateServer = async (userId: string) => {

  };

  public participateServer = async (userId: string, serverId: string) => {

  };

  public createServer = async (userId: string, name: string, type: ServerType) => {

  };

  public deleteServer = async (userId: string, serverId: string) => {

  };


}