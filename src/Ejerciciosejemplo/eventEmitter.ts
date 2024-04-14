import { EventEmitter } from "events";

export class MessageEventEmitterClient extends EventEmitter {
  static createServer(arg0: (connection: any) => void) {
    throw new Error("Method not implemented.");
  }
  constructor(connection: EventEmitter) {
    super();

    let wholeData = "";
    connection.on("data", (dataChunk) => {
      wholeData += dataChunk;

      let messageLimit = wholeData.indexOf("\n");
      while (messageLimit !== -1) {
        const message = wholeData.substring(0, messageLimit);
        wholeData = wholeData.substring(messageLimit + 1);
        this.emit("message", JSON.parse(message));
        messageLimit = wholeData.indexOf("\n");
      }
    });
  }
}
