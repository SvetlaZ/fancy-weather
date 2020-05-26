import './style.scss';
import getMap from './modules/map';
import stringCoord from './modules/stringCoord';
import createImage from './modules/creator';
import timer from './modules/timer';
import getBackground from './modules/background';

const moment = require('moment-timezone');

// import { getCurWheather, getWheatherFuture } from './modules/weather';

const apiKeyWheather = 'fdc5de08c5fc4928a4473543202105';
const dop = document.querySelector('.weather-now-dop');

let searchUrlCurrent;
let searchUrlFut;
const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};


let timerId = timer();

getBackground();

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
        wind_kph: wind,
        condition: { text, icon },
        feelslike_c: feelLikeС,
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
    document.querySelector('.geo-text').innerText = `${name}, ${country}`;
    document.querySelector('.weather-now-deg').innerText = `${Math.ceil(tempC)}°`;
    document.querySelector('.description').innerText = text;
    document.querySelector('.feelLike').innerText = `feel like ${Math.ceil(feelLikeС)}°`;
    document.querySelector('.wind').innerText = `wind: ${((Math.ceil(wind) * 1000) / 3600).toFixed()} m/s`;
    document.querySelector('.humidity').innerText = `humidity: ${humidity}%`;

    const latS = stringCoord(lat);
    const lonS = stringCoord(lon);
    document.querySelector('.lat').innerText = `Latitude: ${latS}`;
    document.querySelector('.lon').innerText = `Longitude: ${lonS}`;

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
      const { day: { avgtemp_c: avgtempC, condition: { icon } } } = item;
      const date = moment().add(1 + index, 'days').format('dddd');
      document.querySelectorAll('.day')[index].innerText = date;
      document.querySelectorAll('.deg')[index].innerText = `${Math.ceil(avgtempC)}°`;

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
  await getCurWheather(request);
  await getWheatherFuture(request);
}

document.querySelector('.search').onsubmit = (event) => {
  event.preventDefault();

  submitForm();
};
