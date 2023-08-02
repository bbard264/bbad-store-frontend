const logImageRequest = (imageElement) => {
  imageElement.addEventListener('load', () => {
    console.log('Image loaded:', imageElement.src);
  });

  imageElement.addEventListener('error', () => {
    console.log('Error loading image:', imageElement.src);
  });
};

const OriginalImage = Image;
window.Image = function () {
  const imageElement = new OriginalImage();
  logImageRequest(imageElement);
  return imageElement;
};
