import dns from 'node:dns';

import mongoose from 'mongoose';

const configureSrvDns = (mongoUri: string): void => {
  if (!mongoUri.startsWith('mongodb+srv://')) {
    return;
  }

  if (!process.env.MONGO_DNS_SERVERS) {
    return;
  }

  const dnsServers = process.env.MONGO_DNS_SERVERS
    .split(',')
    .map((server) => server.trim())
    .filter(Boolean);

  if (dnsServers.length > 0) {
    dns.setServers(dnsServers);
  }
};

export const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI is not defined');
  }

  configureSrvDns(mongoUri);

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000
  });
};
