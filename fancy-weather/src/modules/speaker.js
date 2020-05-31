function getSpeech() {
  const SpeechRecognition = window.webkitSpeechRecognition;
  const recognizer = new SpeechRecognition();

  recognizer.interimResults = true;
  recognizer.lang = 'ru-Ru' || 'en-US' || 'be';
  recognizer.onresult = (event) => {
    const result = event.results[event.resultIndex];
    if (result.isFinal) {
      document.querySelector('.search-input').value = result[0].transcript;
      document.querySelector('.search-btn').click();
    }
  };
  recognizer.start();
}

export default getSpeech;
