const http = require("http");
const reqHandler = require("./reqHandler.js");
const server = http.createServer(reqHandler);

server.listen(3000, () => console.log(`Server started successfully`));
