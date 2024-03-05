import http from 'http';
import { Application } from 'express';

export interface IServer {
  getApp: () => Application;
  setServer: () => void;
  start: (port: string) => void;
  exit: () => void;
}

export interface ISocket {
  init: (server: http.Server, serverName: string, room: string) => void;
}