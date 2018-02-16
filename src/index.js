import storage from './storage/storage';
import app from './app/app';
import config from './config/config';
import http from 'http';

const start = () =>
  storage.connect().then((db) => {
    app.start(db).then((exp) => {
      // start server
      const server = http.Server(exp);
      const port = config.SERVER_PORT || 5000;
      server.listen(config.SERVER_PORT);
      console.log('Server: Listener started on port:', port);
      console.log('Server: Server is ready.');
      // exit Handlers
      process.on('exit', () => {
        server.close();
        storage.quit();
        console.log('Gracefull exit.');
      });
      // catch ctrl+c event and exit normally
      process.on('SIGINT', () => {
        console.log('Ctrl-C...');
        server.close();
        storage.quit();
        process.exit(2);
      });
      // catch uncaught exceptions, trace, then exit normally
      process.on('uncaughtException', (e) => {
        console.log('Uncaught Exception...');
        console.log(e.stack);
        server.close();
        storage.quit();
        process.exit(99);
      });
    }).catch((ex) => {
      console.error('While starting application an exception occured:', ex.message || JSON.stringify(ex));
    });
  }).catch((ex) => {
    console.error('While connecting storage an exception occured:', ex.message || JSON.stringify(ex));
  });


start();
