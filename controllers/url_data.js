'use strict';

const models = require('models');
const helpers = require('helpers');
var shortener = require('shorteners');
/** 
@params data is object contains long URL
**/
module.exports.saveURL = (data) => {
    // Save url data in db
    return mongoose.load('url_data').then((Model) => {
        let url_shorter = shortener.shortener(data.url);
        return Model.findOne({
            originalUrl: data.url,
            shortUrl: url_shorter
        }).then((urlData) => {
            // if url not exist in db then save
            if (!urlData) {
                let urlQuery = {
                    originalUrl: data.url,
                    shortUrl: url_shorter,
                    clickCount: 1,
                };
                return new Model(urlQuery).save();
            }else{
                // if exist increment clickCount 1
                var clickNum = urlData.clickCount + 1;
                return Model.findOneAndUpdate({_id: urlData._id}, {
                    $set: {clickCount: clickNum}
                 }, {
                    new: true
                });
            }
        });
    });
};
