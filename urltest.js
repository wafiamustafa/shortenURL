// const { setKey, shorten, expand } = require('react-native-google-shortener');
// setKey('AIzaSyCQVN4U0AU_Zt7KxMTsHJiDbEq332AG5TY');
// shorten('https://mgufron.com', true).then(response => {
//   // do your thing 
//   console.log('shorten url', response.id);
//   console.log('long url', response.longUrl);
// });
// expand('https://goo.gl/alskd', true).then(response => {
//   console.log(response.id);
//   console.log(response.longUrl);
//   console.log(response);
// });

'use strict';
 
var shortener = require('shorteners');
 
// define string 
let my_url = 'http://www.lazada.co.th/maybelline-1-maybellinefashion-brow-ultra-fluffy-brown1-7906309.html';
// call hash make shorter string 
let url_shorter = shortener.shortener(my_url);
 
console.log(url_shorter);
// 1XpN4z 