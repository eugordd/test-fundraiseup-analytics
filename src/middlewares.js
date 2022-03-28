import path from "path";
import { __dirname } from "./helpers/pathHelpers.js";

export const resolveFromPublic = file => (req, res, next) => {
    if (req.method !== 'GET') return next();
    if (req.xhr) return next();
    res.sendFile(path.join(__dirname, '../', '../', 'public/', file));
};