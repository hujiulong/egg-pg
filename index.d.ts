import { Client, ClientConfig } from 'pg';

declare module 'egg' {

  // extend app
  interface Application {
    pg: Client,
  }

  // extend agent
  interface Agent{
    pg: Client,
  }

  // extend context
  interface Context {
  }

  // extend your config
  interface EggAppConfig {
    pg: {
        client?: ClientConfig,
        clients?: {
            [key: string]: ClientConfig,
        },
        app?: Boolean,
        agent?: Boolean,
        pool?: Boolean,
    },
  }

}
