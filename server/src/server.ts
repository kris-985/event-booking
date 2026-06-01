import { createApp } from './app';
import { connectDB } from './config/db';

const port = Number(process.env.PORT) || 5000;
const app = createApp(['/api']);

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error: Error) => {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  });
