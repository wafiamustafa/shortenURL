const { setKey, shorten, expand } = require('react-native-google-shortener');
setKey('AIzaSyCQVN4U0AU_Zt7KxMTsHJiDbEq332AG5TY');
shorten('https://mgufron.com', true).then(response => {
  // do your thing 
  console.log('shorten url', response.id);
  console.log('long url', response.longUrl);
});
expand('https://goo.gl/alskd', true).then(response => {
  console.log(response.id);
  console.log(response.longUrl);
  console.log(response);
});
