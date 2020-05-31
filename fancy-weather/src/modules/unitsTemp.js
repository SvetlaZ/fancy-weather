function changeUnit() {
  document.querySelector('.button-c').classList.toggle('no-active');
  document.querySelector('.button-f').classList.toggle('no-active');
  document.querySelector('.weather-now-deg .now-cels').classList.toggle('hidden');
  document.querySelector('.weather-now-deg .now-far').classList.toggle('hidden');

  const feelsList = document.querySelectorAll('.feels .degree');

  for (let i = 0; i < feelsList.length; i += 1) {
    feelsList[i].classList.toggle('hidden');
  }

  const thenDeg = document.querySelectorAll('.then .degree');

  for (let i = 0; i < thenDeg.length; i += 1) {
    thenDeg[i].classList.toggle('hidden');
  }
}

export default changeUnit;
