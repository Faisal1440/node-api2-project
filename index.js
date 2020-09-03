const server = require("./api/server.js");

const port = 8000;

server.listen(port, () => console.log(`\n {API IS ALIVE AND WELL ON PORT: ${port}!! (Thank G0D)} \n`));