import './style.scss';
import getMap from './modules/map';
import stringCoord from './modules/stringCoord';
import createImage from './modules/creator';
import timer from './modules/timer';
import getBackground from './modules/background';
import { getdegF, getdegC } from './modules/unitsTemp';
// import translateTo from './modules/translator';
import translate from './modules/translations';
import getSpeech from './modules/speaker';

const moment = require('moment-timezone');

// import { getCurWheather, getWheatherFuture } from './modules/weather';

const apiKeyWheather = 'fdc5de08c5fc4928a4473543202105';
const dop = document.querySelector('.weather-now-dop');
const buttonF = document.querySelector('.button-f');
const buttonC = document.querySelector('.button-c');
const unitTemp = localStorage.getItem('temp') || localStorage.setItem('temp', 'C');

let searchUrlCurrent;
let searchUrlFut;
const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

let timerId = timer();

getBackground();

//  НЕ РАБОТАЕТ!!!!
// const langSelect = document.querySelector('.lang');
// langSelect.addEventListener('change', (e) => {
//   console.log('change: ', e.target.value);
//   const chooseLang = langSelect.value;
//   translateTo(chooseLang);
// });

function success(pos) {
  const crd = pos.coords;

  const lat = crd.latitude.toFixed(2);
  const lon = crd.longitude.toFixed(2);

  document.querySelector('.map-def').remove();

  searchUrlCurrent = () => `https://api.weatherapi.com/v1/forecast.json?key=${apiKeyWheather}&q=${lat},${lon}`; // Latitude and Longitude
  searchUrlFut = () => `https://api.weatherapi.com/v1/forecast.json?key=${apiKeyWheather}&q=${lat},${lon}&days=3`; // Latitude and Longitude
  getCurWheather();
  getWheatherFuture();
  getMap(lat, lon);
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

navigator.geolocation.getCurrentPosition(success, error, options);

const input = document.querySelector('.search-input');

const getCurWheather = async (city) => {
  try {
    const response = await fetch(searchUrlCurrent(city));
    const {
      location: {
        name,
        country,
        lat,
        lon,
        tz_id: realTime,
      },
      current: {
        temp_c: tempC,
        temp_f: tempF,
        wind_kph: wind,
        condition: { text, icon },
        feelslike_c: feelLikeС,
        feelslike_f: feelLikeF,
        humidity,
      },
    } = await response.json();
    console.log('timerId', timerId);
    console.log('realTime', realTime);

    const dateCur = document.querySelector('.date');
    clearInterval(timerId);
    timerId = timer(realTime, dateCur);

    if (document.querySelector('.weather-now-icon')) {
      document.querySelector('.weather-now-icon').remove();
    }

    const img = createImage(`http:${icon}`, 'weather-now-icon');
    dop.before(img);
    document.querySelector('.geo-text').innerText = `${name},\n${country}`; // перевед яндексом
    document.querySelector('.weather-now-deg .now-cels').innerText = `${Math.ceil(tempC)}°`;
    document.querySelector('.weather-now-deg .now-far').innerText = `${Math.ceil(tempF)}°`;
    document.querySelector('.description').innerText = text; // перевед яндексом
    const fLikeC = document.querySelector('.feelLikeC').innerText;
    document.querySelector('.feelLikeC').innerText = `${fLikeC}:  ${Math.ceil(feelLikeС)}°`;
    const fLikeF = document.querySelector('.feelLikeF').innerText;
    document.querySelector('.feelLikeF').innerText = `${fLikeF}:  ${Math.ceil(feelLikeF)}°`;
    const windSpeed = document.querySelector('.wind').innerText;
    document.querySelector('.wind').innerText = `${windSpeed}: ${((Math.ceil(wind) * 1000) / 3600).toFixed()} m/s`;
    const humid = document.querySelector('.humidity').innerText;
    document.querySelector('.humidity').innerText = `${humid}: ${humidity}%`;

    const latS = stringCoord(lat);
    const lonS = stringCoord(lon);
    const latitude = document.querySelector('.lat').innerText;
    document.querySelector('.lat').innerText = `${latitude} ${latS}`;
    const longitude = document.querySelector('.lon').innerText;
    document.querySelector('.lon').innerText = `${longitude} ${lonS}`;

    getMap(lat, lon);
  } catch (e) {
    console.log('getCurWheather: ', e);
    console.log('pererr: ', city);
    document.querySelector('.err').innerText = `Не удалось найти город "${city}"`;
  }
};

const getWheatherFuture = async (city) => {
  console.log(searchUrlFut(city));
  try {
    console.log('city: ', city);
    const response = await fetch(searchUrlFut(city));
    const {
      forecast: { forecastday },
    } = await response.json();
    console.log('forecastday', forecastday);
    forecastday.forEach((item, index) => {
      const { day: { avgtemp_c: avgtempC, avgtemp_f: avgtempF, condition: { icon } } } = item;
      const date = moment().add(1 + index, 'days').format('dddd');
      document.querySelectorAll('.day')[index].innerText = date; // перевод яндекс
      document.querySelectorAll('.degC')[index].innerText = `${Math.ceil(avgtempC)}°`;
      document.querySelectorAll('.degF')[index].innerText = `${Math.ceil(avgtempF)}°`;

      if (document.querySelectorAll('.weather-then-icon')[index]) {
        document.querySelectorAll('.weather-then-icon')[index].remove();
      }

      const iconF = createImage(`http:${icon}`, 'weather-then-icon');
      document.querySelectorAll('.then')[index].append(iconF);
    });
  } catch (e) {
    console.log('getWheatherFuture', e);
  }
};

async function submitForm() {
  const request = input.value;
  document.querySelector('.err').innerText = 'Хорошего дня =)';

  searchUrlCurrent = (city) => `https://api.weatherapi.com/v1/forecast.json?key=${apiKeyWheather}&q=${city}`;
  searchUrlFut = (city) => `https://api.weatherapi.com/v1/forecast.json?key=${apiKeyWheather}&q=${city}&days=3`;
  await getBackground();
  await getCurWheather(request);
  await getWheatherFuture(request);
}

document.querySelector('.search').onsubmit = (event) => {
  event.preventDefault();

  submitForm();
};

document.querySelector('.change-pic').onclick = () => {
  getBackground();
};

buttonF.onclick = () => {
  localStorage.setItem('temp', 'F');
  getdegF();
};

buttonC.onclick = () => {
  localStorage.setItem('temp', 'C');
  getdegC();
};

if (unitTemp === 'F') {
  getdegF();
}

const elementToTranslate = document.querySelectorAll('[data-i18n]');
console.log('elementToTranslate: ', elementToTranslate);
console.log('Translate: ', translate);
const langSelect = document.querySelector('.lang');
langSelect.addEventListener('change', (e) => {
  console.log('change: ', e.target.value);
  const lang = langSelect.value;

  for (let i = 0; i < elementToTranslate.length; i += 1) {
    const key = elementToTranslate[i].dataset.i18n;
    elementToTranslate[i].innerText = translate[lang][key];
  }
});


const recognizer = new webkitSpeechRecognition();
const buttonMic = document.querySelector('.search-input-btn');
buttonMic.onclick = () => {
  getSpeech();
  // recognizer.start();
};
