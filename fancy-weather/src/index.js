import './style.scss';

const apiKeyWheather = 'fdc5de08c5fc4928a4473543202105';
const dop = document.querySelector('.weather-now-dop');
let searchUrlCurrent;
let searchUrlFut;
const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

function success(pos) {
  const crd = pos.coords;

  // console.log(`Ваше текущее метоположение широта: ${crd.latitude}`);
  // console.log(`Ваше текущее метоположение долгота: ${crd.longitude}`);
  // console.log(`Плюс-минус ${crd.accuracy} метров.`);
  document.querySelector('.lat').innerText = `Latitude: ${(crd.latitude).toFixed(2)}`; // текущая ширина
  document.querySelector('.lon').innerText = `Longitude: ${(crd.longitude).toFixed(2)}`; // текущая долгота

  searchUrlCurrent = () => `https://api.weatherapi.com/v1/forecast.json?key=${apiKeyWheather}&q=${(crd.latitude).toFixed(2)},${(crd.longitude).toFixed(2)}`; // Latitude and Longitude
  getCurWheather();

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
    console.log(icon);

    if (document.querySelector('.weather-now-icon')) {
      document.querySelector('.weather-now-icon').remove();
    }

    const img = createImage(`http:${icon}`, 'weather-now-icon');
    dop.before(img);
    document.querySelector('.geo-text').innerText = `${name},\n${country}`;
    document.querySelector('.weather-now-deg').innerText = `${Math.ceil(tempC)}°`;
    document.querySelector('.description').innerText = text;
    document.querySelector('.feelLike').innerText = `feel like ${Math.ceil(feelLikeС)}°C`;
    document.querySelector('.wind').innerText = `wind: ${((Math.ceil(wind) * 1000) / 3600).toFixed()} m\\s`;
    document.querySelector('.humidity').innerText = `humidity: ${humidity}%`;
    document.querySelector('.lat').innerText = `Latitude: ${lat}`;
    document.querySelector('.lon').innerText = `Longitude: ${lon}`;
  } catch (e) {
    console.log('getCurWheather: ', e);
  }
};

const getWheatherFuture = async (city) => {
  console.log(searchUrlFut(city));
  try {
    console.log(city);
    const response = await fetch(searchUrlFut(city));
    const {
      forecast: { forecastday },
    } = await response.json();
    console.log('forecastday', forecastday);
    forecastday.forEach((item, index) => {
      const { date, day: { avgtemp_c: avgtempC, avgtemp_f: avgtempF, condition: { icon } } } = item;
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

  searchUrlCurrent = (city) => `https://api.weatherapi.com/v1/forecast.json?key=${apiKeyWheather}&q=${city}`;
  searchUrlFut = (city) => `https://api.weatherapi.com/v1/forecast.json?key=${apiKeyWheather}&q=${city}&days=3`;
  await getCurWheather(request);
  await getWheatherFuture(request);
}

document.querySelector('.search').onsubmit = (event) => {
  event.preventDefault();

  submitForm();
};


function createImage(src, classname) {
  const newImage = document.createElement('img');
  newImage.src = src;
  newImage.classList.add(classname);

  newImage.onerror = () => {
    newImage.src = '';
    return newImage.src;
  };

  return newImage;
}

// TIMER
const timer = setInterval(() => {
  const dateCur = document.querySelector('.date');
  // const date = new Date();
  // dateCur.innerText = `${date.getMonth()}, ${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  dateCur.innerText = new Date();
}, 1000);
