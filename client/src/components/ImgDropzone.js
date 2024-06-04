import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

function ImgDropzone({ onDrop }) {
  const onDropCallback = useCallback((acceptedFiles) => {
    console.log('In dropzone callback, acceptedFiles: ', acceptedFiles);
    onDrop(acceptedFiles);
  }, [onDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropCallback,
    accept: 'image/*',
  });

  return (
    <div {...getRootProps()} style={{border: '2px dashed #0087F7', borderRadius: '5px',
      padding: '20px', textAlign: 'center', cursor: 'pointer',
      }}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </div>
  );
};

export default ImgDropzone;

