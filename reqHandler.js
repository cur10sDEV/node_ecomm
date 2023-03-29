const { writeFile } = require("fs");

const reqHandler = (req, res) => {
  const url = req.url;
  const method = req.method;
  if (url === "/") {
    res.setHeader("Content-Type", "text/html");
    res.statusCode = 200;
    res.write(
      "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><meta http-equiv='X-UA-Compatible' content='IE=edge'><meta name='viewport' content='width=device-width, initial-scale=1.0'><title>Nodejs</title></head><body><form action='/message' method='POST'><input type='text' name='message' placeholder='Type your msg here'><button type='submit'>Submit</button></form></body></html>"
    );
    return res.end();
  }

  if (url === "/message" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });
    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split("=")[1];
      writeFile(
        "message.json",
        JSON.stringify({
          data: message.split("+").join(" "),
        }),
        () => {
          res.statusCode = 302;
          res.setHeader("Location", "/");
          return res.end();
        }
      );
    });
  }
};
module.exports = reqHandler;
