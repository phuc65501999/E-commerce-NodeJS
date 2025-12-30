
const app = require('./src/app');
const port = 3000;

const server =  app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

process.on('SIGINT', () => {
  console.log('Shutting down server...');

  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});