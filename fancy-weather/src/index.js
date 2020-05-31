import './style.scss';
import getMap from './modules/map';
import stringCoord from './modules/stringCoord';
import createImage from './modules/creator';
import timer from './modules/timer';
import getBackground from './modules/background';
import changeUnit from './modules/unitsTemp';
import { translateTo, getTranslate } from './modules/translator';
import getSpeech from './modules/speaker';
import icons from './modules/icons';

const moment = require('moment-timezone');

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


const langSelect = document.querySelector('.lang');
let oldLang = document.querySelector('.lang').value;
langSelect.addEventListener('change', () => {
  const chooseLang = langSelect.value;
  translateTo(chooseLang);
  const city = document.querySelector('.geo-text').innerText;
  const description = document.querySelector('.description').innerText;
  getTranslate(city, oldLang, chooseLang, 'geo-text');
  getTranslate(description, oldLang, chooseLang, 'description');
  moment.lang(chooseLang);
  oldLang = chooseLang;
});

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
        condition: { text, code },
        feelslike_c: feelLikeС,
        feelslike_f: feelLikeF,
        humidity,
      },
    } = await response.json();

    const dateCur = document.querySelector('.date');
    clearInterval(timerId);
    timerId = timer(realTime, dateCur);

    if (document.querySelector('.weather-now-icon')) {
      document.querySelector('.weather-now-icon').remove();
    }

    const img = createImage(icons[code], 'weather-now-icon');
    dop.before(img);
    document.querySelector('.geo-text').innerText = `${name},\n${country}`;
    document.querySelector('.weather-now-deg .now-cels').innerText = `${Math.ceil(tempC)}°`;
    document.querySelector('.weather-now-deg .now-far').innerText = `${Math.ceil(tempF)}°`;
    document.querySelector('.description').innerText = text;
    document.querySelector('.feelLikeC').innerText = `${Math.ceil(feelLikeС)}°`;
    document.querySelector('.feelLikeF').innerText = `${Math.ceil(feelLikeF)}°`;
    document.querySelector('.wind').innerText = `${((Math.ceil(wind) * 1000) / 3600).toFixed()} m/s`;
    document.querySelector('.humidity').innerText = `${humidity}%`;

    const latS = stringCoord(lat);
    const lonS = stringCoord(lon);
    document.querySelector('.lat').innerText = `${latS}`;
    document.querySelector('.lon').innerText = `${lonS}`;

    getMap(lat, lon);
  } catch (e) {
    document.querySelector('.err').innerText = `Не удалось найти город "${city}"`;
  }
};

const getWheatherFuture = async (city) => {
  try {
    console.log('city: ', city);
    const response = await fetch(searchUrlFut(city));
    const {
      forecast: { forecastday },
    } = await response.json();

    forecastday.forEach((item, index) => {
      const { day: { avgtemp_c: avgtempC, avgtemp_f: avgtempF, condition: { code } } } = item;
      const date = moment().add(1 + index, 'days').format('dddd');
      document.querySelectorAll('.day')[index].innerText = date;
      document.querySelectorAll('.day')[index].dataset.i18n = date.toLocaleLowerCase();
      document.querySelectorAll('.degC')[index].innerText = `${Math.ceil(avgtempC)}°`;
      document.querySelectorAll('.degF')[index].innerText = `${Math.ceil(avgtempF)}°`;

      if (document.querySelectorAll('.weather-then-icon')[index]) {
        document.querySelectorAll('.weather-then-icon')[index].remove();
      }

      const iconF = createImage(icons[code], 'weather-then-icon');
      document.querySelectorAll('.then')[index].append(iconF);
    });
  } catch (e) {
    console.warn('getWheatherFuture', e);
  }
};

function success(pos) {
  const crd = pos.coords;
  const lat = crd.latitude.toFixed(2);
  const lon = crd.longitude.toFixed(2);

  searchUrlCurrent = () => `https://api.weatherapi.com/v1/forecast.json?key=${apiKeyWheather}&q=${lat},${lon}`; // Latitude and Longitude
  searchUrlFut = () => `https://api.weatherapi.com/v1/forecast.json?key=${apiKeyWheather}&q=${lat},${lon}&days=3`; // Latitude and Longitude
  getCurWheather();
  getWheatherFuture();
  getMap(lat, lon);
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
  searchUrlCurrent = (city) => `https://api.weatherapi.com/v1/forecast.json?key=${apiKeyWheather}&q=${city}`;
  searchUrlFut = (city) => `https://api.weatherapi.com/v1/forecast.json?key=${apiKeyWheather}&q=${city}&days=3`;
  getBackground();
  getCurWheather('Moscow');
  getWheatherFuture('Moscow');
}

navigator.geolocation.getCurrentPosition(success, error, options);

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
  if (buttonF.classList.contains('no-active')) {
    localStorage.setItem('temp', 'F');
    changeUnit();
  }
};

buttonC.onclick = () => {
  if (buttonC.classList.contains('no-active')) {
    localStorage.setItem('temp', 'C');
    changeUnit();
  }
};

if (unitTemp === 'F') {
  changeUnit();
}

const buttonMic = document.querySelector('.search-input-btn');
buttonMic.onclick = () => {
  getSpeech();
};
