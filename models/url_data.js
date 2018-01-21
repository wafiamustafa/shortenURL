'use strict';

module.exports = function(mongoose) {
  let Schema = mongoose.Schema;

  let schema = new Schema({
    originalUrl: String,
    short: String,
    clickCount: {
      type: Number, 
      default: 0
    },
  }, {
    timestamps: true
  });
  // To be able to run 'autotest' ( npm run autotest )
  // without errors
  try {
    mongoose.model('url_data');
  } catch(e) {
    mongoose.model('url_data', schema);
  }
};
