'use strict';

const models = require('models');
const helpers = require('helpers');

/** 
@params data is object contains long URL
**/
module.exports.saveLongURL = (data) => {
    // Save url data in db
    return mongoose.load('url_data').then((Model) => {
        return Model.findOne({
            originalUrl: data.url
        }).then((urlData) => {
            if (!urlData) {
                return helpers.urlApi.shortURL(data.url).then((response) => {
                    let urlQuery = {
                        originalUrl: data.url,
                        shortUrl: response.id,
                        shortClickCount: response.shortClicks,
                        longClickCount: response.longClicks
                    };
                    return new Model(urlQuery).save();
                });
            }
        });
    });
};

/**
@params data object contains short url
**/
module.exports.saveShortURL = (data) => {
    // Get long url and google analytics data
    return helpers.urlApi.longURL(data.url).then((response) => {
        let urlQuery = {
            originalUrl: data.url,
            shortUrl: response.id,
            shortClickCount: response.shortClicks,
            longClickCount: response.longClicks
        };
        // Save url data in db
        return mongoose.load('url_data').then((Model) => {
            return new Model(urlQuery).save();
        });
    });
};