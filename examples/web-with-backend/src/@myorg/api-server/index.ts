import { Message } from '@myorg/api-types';
import express from 'express';
import { createServer, Server } from 'http';

interface ServerParams {
  port: number;
}

export const serverStart = ({ port }: ServerParams) =>
  new Promise<Server>((resolve) => {
    const app = express();

    app.get('/hello', (req, res) => {
      setTimeout(() => {
        res.json({
          message: 'Hello World!',
        } as Message);
      }, 2000);
    });

    const server = createServer(app).listen(port);

    server.once('listening', () => resolve(server));
  });
