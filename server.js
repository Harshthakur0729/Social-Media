import app from "./src/app.js";
import connect from "./src/Db/db.js";
import config from "./src/config/config.js";
import http from "http";

const server = http.createServer(app);

server.listen(config.PORT, () => {
    connect();
    console.log(`Server is running on port ${config.PORT}`);
});
