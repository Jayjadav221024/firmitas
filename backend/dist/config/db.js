"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const DEFAULT_URI = 'mongodb://127.0.0.1:27017/Firmitas';
/**
 * The admin console is only ever allowed to talk to this project's own
 * database. Other projects share the cluster but have their own databases, so
 * a URI that resolves to anything else is a configuration error, not a
 * fallback we should quietly accept.
 */
const EXPECTED_DB_NAME = 'Firmitas';
function databaseNameFrom(uri) {
    // Strip query string, then take the path segment after the host.
    const withoutQuery = uri.split('?')[0];
    const afterScheme = withoutQuery.replace(/^mongodb(\+srv)?:\/\//, '');
    const slash = afterScheme.indexOf('/');
    return slash === -1 ? '' : afterScheme.slice(slash + 1);
}
async function connectDB() {
    const uri = process.env.MONGODB_URI || DEFAULT_URI;
    const dbName = databaseNameFrom(uri);
    if (!dbName) {
        throw new Error(`[Database] MONGODB_URI has no database name. It must end in "/${EXPECTED_DB_NAME}".`);
    }
    if (dbName.toLowerCase() !== EXPECTED_DB_NAME.toLowerCase()) {
        throw new Error(`[Database] Refusing to connect: MONGODB_URI points at database "${dbName}", ` +
            `but this backend owns "${EXPECTED_DB_NAME}". Reading another project's data ` +
            `is never correct — fix MONGODB_URI in your environment.`);
    }
    // Connection failures used to be swallowed, which let the API come up and
    // answer every read with an empty list. Fail loudly instead.
    await mongoose_1.default.connect(uri);
    console.log(`[Database] MongoDB connected — database "${mongoose_1.default.connection.name}"`);
}
