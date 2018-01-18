'use strict';

const mongoose = require('mongoose');

require('./url_data')(mongoose);


// config.dev.yml

//let connectionString = process.env.mongodb ||  'mongodb://qariiteam:qariiteam@ds247007.mlab.com:47007/dupwork?poolSize=100&connectTimeoutMS=600000&socketTimeoutMS=600000';
let connectionString = 'connectionstring';
/**
 * Loads a model
 * @param collectionName The name to load
 * @param connect if true then a new connection to db is initiatited
 * @return Promise
 */
function load(collectionName) {
  console.info("Loading DB Model: ", collectionName);
  return new Promise((resolve, reject)=> {
    console.info("Connection String", connectionString);
    let connection = mongoose.connection;
    let loader = ()=> {
      mongoose.Promise = global.Promise;
      mongoose.connect(connectionString, { useMongoClient: true });
      connection.on('error', function(err) {
        console.log('Unable to connect to DB');
        console.error(JSON.stringify(err));
        reject(err);
      });
      connection.once('open', function() {
        console.info("Connection to DB is OPEN");
        var model = mongoose.model(collectionName);
        resolve(model);
      });
    };

    // Test if there is a connection existing already.
    // if there is ( use it ) .. otherwise, connect
    //
    // Output - 0 = disconnected, 1 = connected, 2 = connecting, 3 =
    // disconnecting (soucre) My credentials were invalid, it was giving 4,
    // which I can't find in officials docs or anywhere else
    if (connection.readyState != 1) { // TODO: Test other statuses
      // Execute loader if there is a connection already.
      // Connect if disconnected and execute loader if there is a no connection.
      return loader();
    }
    return resolve(mongoose.model(collectionName));

  });
}

module.exports = {
  load: load,
  disconnect: mongoose.disconnect,
  mongoose: mongoose
};
