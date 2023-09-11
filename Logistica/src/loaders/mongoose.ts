import mongoose from 'mongoose';
import {Db} from '../../node_modules/mongoose/node_modules/mongodb/mongodb';
import config from '../../config';

export default async (): Promise<Db> => {
  const connection = await mongoose.connect(config.databaseURL);
  return connection.connection.db;
};
