import * as dotenv from 'dotenv'
dotenv.config()

import next from 'next'
import express from "express";
import cookieParser from 'cookie-parser';
import cors from "cors";
import morgan from "morgan";
//Router
import ToolsRoutes from './tools/tools.routes.config';

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const server: express.Application = express();
const toolsRouter = new ToolsRoutes("Ml5Routes").getRouter;

app.prepare().then(() => {

  if (dev) {
    server.use(morgan("dev"));
  }
  server.use(express.json({ limit: '500mb' }));
  server.use(express.urlencoded({ limit: '500mb', extended: true }));
  server.use(cors());
  server.use(cookieParser());

  server.use("/tools", toolsRouter);

  //Connects NextJS application
  server.all("*", (req: express.Request, res: express.Response) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    // our only exception to avoiding console.log(), because we
    // always want to know when the server is done starting up
    console.log(
      `> Server listening at http://localhost:${port} as ${dev ? 'development' : process.env.NODE_ENV
      }`
    )
  })
})
