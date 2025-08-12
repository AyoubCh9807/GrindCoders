declare module "phoenix" {
  export class Socket {
    constructor(endpoint: string, opts?: any);
    connect(): void;
    disconnect(): void;
    channel(topic: string, params?: any): Channel;
  }

  interface Channel {
    join(): any;
    push(event: string, payload: any): any;
    on(event: string, callback: (payload: any) => void): void;
    leave(): any;
  }
}
