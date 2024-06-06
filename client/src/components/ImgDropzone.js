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
  });

  return (
    <div {...getRootProps({
        style: {border: '2px dashed #0087F7', borderRadius: '5px',
        padding: '20px', textAlign: 'center', cursor: 'pointer',}
      })}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the images here ...</p>
      ) : (
        <p>Drag 'n' drop product images here, or click to select images</p>
      )}
    </div>
  );
};

export default ImgDropzone;

