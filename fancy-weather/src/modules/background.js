const moment = require('moment-timezone');

const apiKeyPic = 'pigQDjaBlkcZ2JFX4O3-fRy3oVcqSqaPXyrxI3hc8NY';
const hours = moment().format('HH');
let dayTime = 'day';

const searchUrlPic = `https://api.unsplash.com/photos/random?orientation=landscape&per_page=1&query=spring,nature,${dayTime}&client_id=${apiKeyPic}`;

const getBackground = async () => {
  try {
    if (hours > 20 || hours < 6) {
      dayTime = 'night';
    }
    const responce = await fetch(searchUrlPic);
    const {
      urls: { regular },
    } = await responce.json();
    document.querySelector('.background').style.backgroundImage = `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.4) ), url('${regular}')`;
  } catch (e) {
    console.log('getBackground: ', e);
  }
};

export default getBackground;
