import translate from './translations';

const elementToTranslate = document.querySelectorAll('[data-i18n]');
console.log('elementToTranslate: ', elementToTranslate);
console.log('Translate: ', translate);
function translateTo(lang) {
  for (let i = 0; i < elementToTranslate.length; i += 1) {
    const key = elementToTranslate[i].dataset.i18n;
    elementToTranslate[i].innerText = translate[lang][key];
  }
}

// export default translateTo();
