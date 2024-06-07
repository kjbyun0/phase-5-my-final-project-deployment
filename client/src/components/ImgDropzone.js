import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

function ImgDropzone({ onDrop }) {
  const onDropCallback = useCallback((acceptedFiles, rejectedFiles) => {
    console.log('In dropzone callback, acceptedFiles: ', acceptedFiles);
    onDrop(acceptedFiles);

    rejectedFiles.forEach(rejectedFile => {
      alert(`${rejectedFile.file.name} is rejected!\nReason: ${rejectedFile.errors[0].message}`);
    });
  }, [onDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropCallback,
    accept: {
      'image/*': []
    },
    maxSize: 1024 * 100,
    maxFiles: 1,
  });

  return (
    <div {...getRootProps({
        style: {border: '2px dashed #0087F7', borderRadius: '5px',
        padding: '20px', textAlign: 'center', cursor: 'pointer',}
      })}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the image here ...</p>
      ) : (
        <div>
          <p>Drag 'n' drop a product image here, or click to select a image</p>
          <div>The images in the product page will be shown in the same order as they are here.</div>
        </div>
      )}
    </div>
  );
};

export default ImgDropzone;

