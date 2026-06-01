import serverless from 'serverless-http';

import { createApp } from '../../server/src/app';
import { connectDB } from '../../server/src/config/db';

const app = createApp(['', '/api', '/.netlify/functions/api']);
const serverlessHandler = serverless(app);
let dbConnection: Promise<void> | undefined;
const healthPaths = new Set(['/health', '/api/health', '/.netlify/functions/api/health']);

type NetlifyEvent = {
  path: string;
};

type NetlifyContext = {
  callbackWaitsForEmptyEventLoop?: boolean;
};

export const handler: typeof serverlessHandler = async (event, context) => {
  const netlifyEvent = event as NetlifyEvent;
  const netlifyContext = context as NetlifyContext;

  netlifyContext.callbackWaitsForEmptyEventLoop = false;

  if (healthPaths.has(netlifyEvent.path)) {
    return serverlessHandler(event, context);
  }

  try {
    dbConnection ??= connectDB();
    await dbConnection;
  } catch (error) {
    dbConnection = undefined;

    return {
      statusCode: 500,
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        message: error instanceof Error ? error.message : 'Database connection failed'
      })
    };
  }

  return serverlessHandler(event, context);
};
