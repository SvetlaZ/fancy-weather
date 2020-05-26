import stringCoord from './stringCoord';
import getMap from './map';
import createImage from './creator';

const apiKeyWheather = 'fdc5de08c5fc4928a4473543202105';
const searchByCoordinates = () => `https://api.weatherapi.com/v1/forecast.json?key=${apiKeyWheather}&q=${lat},${lon}`;
let searchUrlFut;
const dop = document.querySelector('.weather-now-dop');
const getCurWheather = async (city) => {
  try {
    if (city) {
      const response = await fetch(searchUrlCurrent(city));
    } else {
      const response = await fetch(searchByCoordinates());
    }
    console.dir(response);
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

    if (document.querySelector('.weather-now-icon')) {
      document.querySelector('.weather-now-icon').remove();
    }

    const img = createImage(`http:${icon}`, 'weather-now-icon');
    dop.before(img);
    document.querySelector('.geo-text').innerText = `${name}, ${country}`;
    document.querySelector('.weather-now-deg').innerText = `${Math.ceil(tempC)}°`;
    document.querySelector('.description').innerText = text;
    document.querySelector('.feelLike').innerText = `feel like ${Math.ceil(feelLikeС)}°C`;
    document.querySelector('.wind').innerText = `wind: ${((Math.ceil(wind) * 1000) / 3600).toFixed()} m/s`;
    document.querySelector('.humidity').innerText = `humidity: ${humidity}%`;

    const latS = stringCoord(lat);
    const lonS = stringCoord(lon);
    document.querySelector('.lat').innerText = `Latitude: ${latS}`;
    document.querySelector('.lon').innerText = `Longitude: ${lonS}`;

    getMap(lat, lon);
  } catch (e) {
    console.log('getCurWheather: ', e.message);
    console.dir(e);
    document.querySelector('.err').innerText = `Не удалось найти город "${city}"`;
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

export { getCurWheather, getWheatherFuture };
