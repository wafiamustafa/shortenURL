const {
    setKey,
    shorten,
    expand
} = require('react-native-google-shortener');
setKey('AIzaSyCQVN4U0AU_Zt7KxMTsHJiDbEq332AG5TY');

export const shortURL = (longUrl) => {
    return shorten(longUrl, true).then(response => {
        // do your thing
        console.log('shorten url', response.id);
        console.log('long url', response.longUrl);
        response = {
            longURL: response.longUrl,
            shortURL: response.id,
            shortClicks: response.analytics.allTime.shortUrlClicks,
            longClicks: response.analytics.allTime.longUrlClicks
        };
        return response;
    }).catch((err) => {
        console.log(err);
        return err;
    });
};

export const longUrl = (shortURL) => {
    return expand(shortURL, true).then(response => {
        console.log(response.id);
        console.log(response.longUrl);
        console.log(response.status);
        response = {
            longURL: response.longUrl,
            shortURL: response.id,
            shortClicks: response.analytics.allTime.shortUrlClicks,
            longClicks: response.analytics.allTime.longUrlClicks
        };
        return response;
    }).catch((err) => {
        return err;
    });
};