import { existsSync } from 'node:fs';
import { MongoClient, ServerApiVersion } from 'mongodb';

export const databaseName = 'cine-db';

function createClient() {
  try {
    if (existsSync('.env')) {
      process.loadEnvFile();
    }

    return new MongoClient(process.env.MONGODB_URI ?? '', {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      serverSelectionTimeoutMS: 8000,
    });
  } catch {
    console.error('Error al configurar MongoDB. Reviso MONGODB_URI en .env.');
    process.exit(1);
  }
}

export const client = createClient();

export async function connect() {
  await client.connect();
  await client.db('admin').command({ ping: 1 });
}
