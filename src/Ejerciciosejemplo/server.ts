import net from "net";

const server = net.createServer((connection) => {
  console.log("A client has connected.");

  const firstData = '{"type": "change", "prevSize": 13';
  const secondData = ', "currSize": 27}\n';

  connection.write(firstData);

  const timer = setTimeout(() => {
    connection.write(secondData);
    connection.end();
  }, 500);

  connection.on("end", () => {
    clearTimeout(timer);
  });

  connection.on("close", () => {
    console.log("A client has disconnected");
  });
});

server.listen(60300, () => {
  console.log("Waiting for clients to connect.");
});
