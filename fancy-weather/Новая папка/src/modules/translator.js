import translate from './translations';

function translateTo(lang) {
  const elementToTranslate = document.querySelectorAll('[data-i18n]');

  for (let i = 0; i < elementToTranslate.length; i += 1) {
    const key = elementToTranslate[i].dataset.i18n;
    elementToTranslate[i].innerText = translate[lang][key];
  }
}

const yandexTranslateKey = 'trnsl.1.1.20200509T065852Z.8635de9c4dce3366.47623063bd42b2a26fdd2ccec306d80f47d3ad12';

async function getTranslate(word, fromLang, toLang, className) {
  const url = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${yandexTranslateKey}&text=${word}&lang=${fromLang}-${toLang}`;

  const res = await fetch(url);
  const {
    text: [wordT],
  } = await res.json();
  document.querySelector(`.${className}`).innerText = wordT;
  return wordT;
}

export { translateTo, getTranslate };
