import express from 'express';
import path from 'path';
import bodyParser from "body-parser";

import trackerRoutes from './controllers.js';
import { dbConnect } from "./services/dbConnect.js";
import { resolveFromPublic } from "./middlewares.js";

const app = express();
app.use(resolveFromPublic('index.html'));
app.listen(8000);

const trackerApp = express();
await dbConnect();
trackerApp.use(bodyParser.urlencoded({ extended: true }));
trackerApp.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return next();
});
trackerApp.use(trackerRoutes);
trackerApp.use(resolveFromPublic('tracker.js'));
trackerApp.listen(8001);