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

export default createImage;
