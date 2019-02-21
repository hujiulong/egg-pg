import { Client, ClientConfig } from 'pg';


interface Cursor {
  read: (count:number) => Promise<any[]>,
  close: () => void,
}
interface ClientPlus extends Client {
  cursor: (sql:string, values:any[]) => Cursor,
}

declare module 'egg' {

  // extend app
  interface Application {
    pg: ClientPlus,
  }

  // extend agent
  interface Agent{
    pg: ClientPlus,
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

