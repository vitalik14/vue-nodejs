const app = require("./modules/core.js");
const users = require("./modules/users.js");
const db = require("./db/db.js");

const EventEmitter = require("events");
const Stream = new EventEmitter();

require("./modules/auth.js")(app, db, users);
require("./modules/pages/posts.js")(app, db, users);
require("./modules/pages/timeeat.js")(app, db, users);
require("./modules/pages/profile.js")(app, db, users);
require("./modules/pages/childOptions.js")(app, db, users);