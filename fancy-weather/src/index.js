import './style.scss';

const apiKeyOpenWheather = '0694ec64f2b79d0b86b0629963726138';
let searchUrl;
const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

function success(pos) {
  const crd = pos.coords;

  console.log(`Ваше текущее метоположение широта: ${crd.latitude}`);
  console.log(`Ваше текущее метоположение долгота: ${crd.longitude}`);
  console.log(`Плюс-минус ${crd.accuracy} метров.`);
  document.querySelector('.lat').innerText = `Latitude: ${crd.latitude}`; // текущая ширина
  document.querySelector('.lon').innerText = `Longitude: ${crd.longitude}`; // текущая долгота

  searchUrl = () => `https://api.openweathermap.org/data/2.5/weather?lat=${crd.latitude}&lon=${crd.longitude}&lang=en&units=metric&appid=${apiKeyOpenWheather}`;
  getCurWheather();
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

navigator.geolocation.getCurrentPosition(success, error, options);

const input = document.querySelector('.search-input');

const getCurWheather = async (city) => {
  console.log(searchUrl(city));
  try {
    console.log(city);
    console.log(searchUrl());
    const response = await fetch(searchUrl(city));
    const {
      weather: [{ description, icon }],
      main: { temp, feels_like: feelLike, humidity },
      wind: { speed },
      coord: { lat, lon },
      name,
    } = await response.json();

    document.querySelector('.geo-text').innerText = name;
    document.querySelector('.weather-now-deg').innerText = `${Math.ceil(temp)}°C`;
    document.querySelector('.description').innerText = description;
    document.querySelector('.feelLike').innerText = `feel like ${Math.ceil(feelLike)}°C`;
    document.querySelector('.wind').innerText = `wind: ${Math.ceil(speed)} m\\s`;
    document.querySelector('.humidity').innerText = `humidity: ${humidity}%`;
    document.querySelector('.lat').innerText = `Latitude: ${lat}`;
    document.querySelector('.lon').innerText = `Longitude: ${lon}`;
  } catch (e) {
    console.log(e);
  }
};

async function submitForm() {
  const request = input.value;
  searchUrl = (city) => `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=en&units=metric&appid=${apiKeyOpenWheather}`;
  await getCurWheather(request);
}

document.querySelector('.search').onsubmit = (event) => {
  event.preventDefault();

  submitForm();
};

const date = new Date();
document.querySelector('.date').innerText = date;
