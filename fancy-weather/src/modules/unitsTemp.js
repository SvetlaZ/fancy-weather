function getdegF() {
  document.querySelector('.button-f').classList.remove('no-active');
  document.querySelector('.button-c').classList.add('no-active');
  document.querySelector('.weather-now-deg .now-cels').classList.add('hidden');
  document.querySelector('.weather-now-deg .now-far').classList.remove('hidden');
  document.querySelector('.feelLikeC').classList.add('hidden');
  document.querySelector('.feelLikeF').classList.remove('hidden');
  document.querySelectorAll('.degC').forEach((item) => {
    item.classList.add('hidden');
  });
  document.querySelectorAll('.degF').forEach((item) => {
    item.classList.remove('hidden');
  });
}

function getdegC() {
  document.querySelector('.button-c').classList.remove('no-active');
  document.querySelector('.button-f').classList.add('no-active');
  document.querySelector('.weather-now-deg .now-far').classList.add('hidden');
  document.querySelector('.weather-now-deg .now-cels').classList.remove('hidden');
  document.querySelector('.feelLikeF').classList.add('hidden');
  document.querySelector('.feelLikeC').classList.remove('hidden');
  document.querySelectorAll('.degF').forEach((item) => {
    item.classList.add('hidden');
  });
  document.querySelectorAll('.degC').forEach((item) => {
    item.classList.remove('hidden');
  });
}

export { getdegF, getdegC };
