

// function Home() {

//     return <h2>I'm at Home.</h2>
// }

// export default Home;


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// import React from 'react';
// import { useFormik, FieldArray, FormikProvider } from 'formik';
// import * as Yup from 'yup';

// const initialValues = {
//   emails: [''],
//   name: 'test',
// };

// const validationSchema = Yup.object({
//   emails: Yup.array().of(
//     Yup.string().email('Invalid email address').required('Required')
//   )
// });

// const MyForm = () => {
//   const formik = useFormik({
//     initialValues: initialValues,
//     validationSchema: validationSchema,
//     onSubmit: (values) => {
//       console.log(values);
//     },
//   });

//   return (
//     <form onSubmit={formik.handleSubmit}>
//         <FormikProvider value={formik}>
//             <FieldArray name="emails">
//             {({ insert, remove, push }) => (
//                 <div>
//                 {formik.values.emails.length > 0 &&
//                     formik.values.emails.map((email, index) => (
//                     <div key={index}>
//                         <input
//                         name={`emails.${index}`}
//                         type="email"
//                         placeholder="Enter email"
//                         onChange={formik.handleChange}
//                         onBlur={formik.handleBlur}
//                         value={formik.values.emails[index]}
//                         />
//                         {formik.errors.emails && formik.errors.emails[index] && formik.touched.emails && formik.touched.emails[index] ? (
//                         <div className="error">{formik.errors.emails[index]}</div>
//                         ) : null}
//                         <button
//                         type="button"
//                         onClick={() => remove(index)}
//                         >
//                         -
//                         </button>
//                         <button
//                         type="button"
//                         onClick={() => insert(index + 1, '')}
//                         >
//                         +
//                         </button>
//                     </div>
//                     ))}
//                 <button
//                     type="button"
//                     onClick={() => push('')}
//                 >
//                     Add Email
//                 </button>
//                 </div>
//             )}
//             </FieldArray>
//             <button type="submit">Submit</button>
//         </FormikProvider>
//     </form>

//   );
// };

// export default MyForm;


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// import React from 'react';
// import { useFormik } from 'formik';

// const MyForm = () => {
//   const formik = useFormik({
//     initialValues: {
//       myObject: {}  // initial empty object
//     },
//     onSubmit: values => {
//       console.log('Form data:', values);
//     },
//   });

//   const handleAddKeyValue = (e) => {
//     e.preventDefault();
//     const { key, value } = formik.values.newKeyValue;
//     if (key && value) {
//       formik.setFieldValue(`myObject.${key}`, value);
//       formik.setFieldValue('newKeyValue.key', '');
//       formik.setFieldValue('newKeyValue.value', '');
//     }
//   };

//   return (
//     <form onSubmit={formik.handleSubmit}>
//       <div>
//         <label htmlFor="key">Key</label>
//         <input
//           id="key"
//           name="newKeyValue.key"
//           type="text"
//           onChange={formik.handleChange}
//           value={formik.values.newKeyValue?.key || ''}
//         />
//       </div>
//       <div>
//         <label htmlFor="value">Value</label>
//         <input
//           id="value"
//           name="newKeyValue.value"
//           type="text"
//           onChange={formik.handleChange}
//           value={formik.values.newKeyValue?.value || ''}
//         />
//       </div>
//       <button type="button" onClick={handleAddKeyValue}>Add Key/Value</button>
//       <button type="submit">Submit</button>
//       <pre>{JSON.stringify(formik.values, null, 2)}</pre>
//     </form>
//   );
// };

// export default MyForm;


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


import React, { useState } from 'react';
import ImgDropzone from '../components/ImgDropzone';

const App = () => {
  const [imgFiles, setImgFiles] = useState({});

  console.log('imgFiles: ', imgFiles);

  function handleImgDrop(acceptedFiles) {
    const imgFilesTmp = {...imgFiles};
    acceptedFiles.forEach(file => imgFilesTmp[file.path] = {
        ...file,
        preview: URL.createObjectURL(file),
    });
    setImgFiles(imgFilesTmp);
  };

  return (
    <div>
      <h1>Image Upload</h1>
      <ImgDropzone onDrop={handleImgDrop} /> 
      <div style={{display: 'flex', flexWrap: 'wrap', marginTop: '20px',}}>
        {
            Object.keys(imgFiles).map((key, i) => {
                return (
                    <div key={i} style={{margin: '10px', }} >
                        <img src={imgFiles[key].preview} alt={imgFiles[key].name} 
                            style={{width: '100px', height: '100px', objectFit: 'cover',}} />
                    </div>
                );
            })
        }
      </div>
    </div>
  );
};

export default App;
