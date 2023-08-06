import React, { useState, useCallback } from 'react';
import '../styles/components/Cropping.css';
import Cropper from 'react-easy-crop';
import Button from './subcomponents/Button';

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues on CodeSandbox
    image.src = url;
  });

async function getCroppedImg(
  imageSrc,
  pixelCrop,
  flip = { horizontal: false, vertical: false }
) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  // Set the canvas size to 100x100 px
  canvas.width = 100;
  canvas.height = 100;

  // Flip the image if required
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);

  // Draw the cropped image onto the canvas, applying the scale factor
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    100,
    100
  );

  // As Base64 string
  // return canvas.toDataURL('image/jpeg');

  // As a blob
  return new Promise((resolve, reject) => {
    canvas.toBlob((file) => {
      resolve(URL.createObjectURL(file));
    }, 'image/jpeg');
  });
}

export default function Cropping({
  uploadedPhoto,
  setCroppedImage,
  onCanclePhotoCrop,
  setShowCrop,
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    // console.log(croppedArea, croppedAreaPixels);
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        uploadedPhoto,
        croppedAreaPixels
      );

      await setCroppedImage(croppedImage);
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, setCroppedImage, uploadedPhoto]);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    getCroppedImage();
    setShowCrop(false);
  };
  return (
    <div className="cropContainer">
      <div className="cropBox">
        <div className="AppCropper">
          <div className="crop-container">
            <Cropper
              image={uploadedPhoto}
              crop={crop}
              zoom={zoom}
              aspect={1 / 1}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <form className="controls" onSubmit={handleOnSubmit}>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => {
                setZoom(e.target.value);
              }}
              className="zoom-range"
            />
            <Button type="submit">Submit</Button>
          </form>
        </div>
        <div className="backDrop"></div>
        <div className="backDropCancel" onClick={onCanclePhotoCrop}></div>
      </div>
    </div>
  );
}
