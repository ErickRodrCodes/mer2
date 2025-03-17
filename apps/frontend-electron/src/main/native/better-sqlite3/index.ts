import type { Database } from 'better-sqlite3';
import * as BetterSqlite3 from 'better-sqlite3';
import { app } from 'electron';
import path from 'path';

export const dbConnector: Database = new BetterSqlite3.default(
  app.getPath('userData') + '/db.sqlite',
  {
    nativeBinding: path.resolve(__dirname, 'better-sqlite3.node'),
  }
);