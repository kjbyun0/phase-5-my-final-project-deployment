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
    multiple: false,
  });

  return (
    <div {...getRootProps({
        style: {border: '2px dashed dodgerblue', borderRadius: '5px',
        padding: '0', textAlign: 'center', cursor: 'pointer',}
      })}>
      <input {...getInputProps()} />
      <div style={{width: '100%', height: '150px', 
                backgroundImage: 'url("/img_dropzone.png")',     // image change from card_thumbnail
                backgroundSize: 'contain', backgroundRepeat: 'no-repeat', 
                backgroundPosition: 'center',
                display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
      <div style={{color: 'dodgerblue', }}>
          {isDragActive ? 
            "Drop the image here ..." : 
            "Drag & drop a product image here, or click to select one.\n"}
      </div>
    </div>
  );
};

export default ImgDropzone;

