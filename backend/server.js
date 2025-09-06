import processHandler from './src/utils/error/processHandler.js';
import './src/config/dotenv.js';
import app from './app.js';
import dbConnection from './src/config/db.js';

const port = process.env.PORT || 3000;

dbConnection();

const server = app.listen(port, () =>
  console.log(`BookShelf is running at=>http://localhost:${port}`),
);

processHandler(server);
