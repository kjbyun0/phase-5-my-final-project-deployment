import { useEffect, useState } from 'react';
import { useOutletContext, useNavigate, } from 'react-router-dom';
import { dispPrice, dispListPrice, handleCItemAdd, handleCItemChange,
    formatDate, convertUTCDate, } from '../components/common';
import { useFormik, FormikProvider, FieldArray, } from 'formik';
import * as yup from 'yup';
import ImgDropzone from '../components/ImgDropzone';
import { Divider, Form, TextArea, Input, Button, Icon, IconGroup, Radio, FormField, } from 'semantic-ui-react';


function AddItem() {

    const [ activeItemIdx, setActiveItemIdx ] = useState(null);
    const [ activeImageIdx, setActiveImageIdx ] = useState(null);
    const [ imgFiles, setImgFiles ] = useState([]);
    const { user, cartItems, onSetCartItems, orders, onSetOrders, } = useOutletContext();
    const navigate = useNavigate();

    const formSchema = yup.object().shape({
        // need to be tested and the apply to similar oens, too.
        prices: yup.array().of(
            yup.string().required('Required')
          )
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            brand: '',  // It is not needed because brand is already included in the name.
            default_item_idx: 0,
            prices: [''],
            discount_prices: [''],
            amounts: [''],
            units: [''],
            packs: [''],
            about_item: [''], // bullet points
            // details_1: {},
            details_1_key: [''],
            details_1_val: [''],
            // details_2: {},
            details_2_key: [''],
            details_2_val: [''],
            card_thumbnail: '',
            thumbnails: [],
            images: [],
            category_id: null,
            seller_id: null,
        },
        validationSchema: formSchema,
        onSubmit: async values => {

            console.log('OnSubmit: formik.values: ', values);
            console.log('OnSubmit: imgFiles: ', imgFiles);

            // if (imgFiles.length) {
            //     const formData = new FormData();
            //     imgFiles.forEach(file => formData.append('file', file));
            //     formData.append('upload_preset', 'flatiron_p5_pjt_imgs');
            //     console.log('formData: ', formData);

            //     const cloudName = 'dfsqyivhu';
            //     const data = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
            //         method: 'POST',
            //         body: formData,
            //     }).then(res => res.json());

            //     console.log(data);
            // }

            const cloudName = 'dfsqyivhu';
            imgFiles.forEach(async file => {
                const publicId = file.name.split('.').slice(0, -1).join('.');
                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', 'flatiron_p5_pjt_imgs');
                formData.append('public_id', publicId);

                const data = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
                    method: 'POST',
                    body: formData,
                }).then(res => res.json());

                console.log(data);
            });


            // await fetch('/items', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(values),
            // })
            // .then(async r => {
            //     if (r.ok) {
            //         console.log('New item is sucessfully posted.');
            //     } else {
            //         await r.json().then(data => {
            //             if (r.status === 401 || r.status === 403) {
            //                 console.log(data);
            //                 alert(data.message);
            //             } else {
            //                 console.log("Server Error - Can't post this item: ", data);
            //                 alert(`Server Error - Can't post this item: ${data.message}`);
            //             }
            //         })
            //     }
            // });
        },
    });

    const pricesFA = {value: 'prices', placeholder: 'Price', insert: null, remove: null, push: null, width: '100px', };
    const discount_pricesFA = {value: 'discount_prices', placeholder: 'Dis. Price', insert: null, remove: null, push: null, width: '100px', };
    const amountsFA = {value: 'amounts', placeholder: 'Volume', insert: null, remove: null, push: null, width: '100px', };
    const unitsFA = {value: 'units', placeholder: 'Vol. Unit', insert: null, remove: null, push: null, width: '100px', };
    const packsFA = {value: 'packs', placeholder: 'Unit Pack', insert: null, remove: null, push: null, width: '100px', };
    const priceSizeFAs = [pricesFA, discount_pricesFA, amountsFA, unitsFA, packsFA];

    const aboutThisItemFAs = [{value: 'about_item', placeholder: '', insert: null, remove: null, push: null, width: '520px', }];

    const details_1_FAs = [
        {value: 'details_1_key', placeholder: '', insert: null, remove: null, push: null, width: '210px', },
        {value: 'details_1_val', placeholder: '', insert: null, remove: null, push: null, width: '334.77px', }
    ];

    const details_2_FAs = [
        {value: 'details_2_key', placeholder: '', insert: null, remove: null, push: null, width: '210px', },
        {value: 'details_2_val', placeholder: '', insert: null, remove: null, push: null, width: '334.77px', }
    ];



    function handleImgDrop(acceptedFiles) {
        const imgFilesDict = {};
        imgFiles.forEach(file => imgFilesDict[file.name] = file);

        const imgFilesTmp = [...imgFiles];
        // console.log('in handleImgDrop, imgFilesDict: ', imgFilesDict, ', imgFilesTmp: ', imgFilesTmp);
        acceptedFiles.forEach(file => {
            if (!(file.name in imgFilesDict)) {
                imgFilesDict[file.name] = file;
                imgFilesTmp.push(Object.assign(file, {preview: URL.createObjectURL(file)}));
            }
        });
        setImgFiles(imgFilesTmp);
    };

    function removeImgFile(imgFile) {
        setImgFiles(files => files.filter(file => file.name !== imgFile.name));
    }

    console.log('imgFiles: ', imgFiles);
    console.log('in AddItem, formik values: ', formik.values);
    // console.log('In Item, user: ', user, ', cartItems: ', cartItems, ', orders: ', orders);


    function addFieldArrays(fieldArrays, bUpdateRadioBtn) {
        const gridColumnsRadio = fieldArrays.map(fa => '1fr');
        // For insert buttons
        gridColumnsRadio.push('1fr');
        // For remove buttons
        gridColumnsRadio.push('1fr');
        if (bUpdateRadioBtn)
            gridColumnsRadio.push('1fr');
        const gridColumnsRadioStr = gridColumnsRadio.join(' ');
        // console.log('in addFieldArrays, gridColumnsRadioStr: ', gridColumnsRadioStr);
        
        return (

            <div style={{display: 'grid', gridTemplateColumns: gridColumnsRadioStr, alignItems: 'center', }}>
                {bUpdateRadioBtn ?<div>{addRadioBtns(fieldArrays[0])}</div> : null}
                {
                    fieldArrays.map(fa => (
                        <div>{addFieldArray(fa)}</div>
                    ))
                }
                <div>{addInsertBtns(fieldArrays)}</div>
                <div>{addRemoveBtns(fieldArrays, bUpdateRadioBtn)}</div>
            </div>
        );
    }

    function addRadioBtns(fieldArray) {
        return (
            formik.values[fieldArray.value].map((val, i) => (
                <Radio
                    key={i}
                    style={{margin: '7.5px 5px 2.8px 0', }}
                    name='default_item_idx'
                    value={i}
                    checked={formik.values.default_item_idx === i}
                    onChange={(e, d) => formik.setFieldValue('default_item_idx', d.value)}
                />
            ))
        );
    }

    function addFieldArray(fieldArray) {
        return (
            <FormikProvider value={formik}>
                <FieldArray name={fieldArray.value}>
                    {({ insert, remove, push }) => {
                        fieldArray.insert = insert;
                        fieldArray.remove = remove;
                        fieldArray.push = push;

                        return (
                            <div>{
                                formik.values[fieldArray.value].map((val, i) => (
                                    <div key={i}>
                                        <Input name={`${fieldArray.value}.${i}`}
                                            style={{width: fieldArray.width, height: '30px', }} 
                                            placeholder={fieldArray.placeholder}
                                            value={formik.values[fieldArray.value][i]}
                                            onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                        {
                                            formik.errors[fieldArray.value] && formik.errors[fieldArray.value][i] &&
                                            formik.touched[fieldArray.value] && formik.touched[fieldArray.value][i] ?
                                            <div>{formik.errors[fieldArray.value][i]}</div> :
                                            null
                                        }
                                    </div>
                                ))
                            }</div>
                        );
                    }}
                </FieldArray>
            </FormikProvider>
        );
    }

    function addInsertBtns(fieldArrays) {
        return (
            formik.values[fieldArrays[0].value].map((val, i) => (
                <Icon
                    name='plus circle' size='large' color='blue'
                    style={{margin: '4.5px 0'}}
                    onClick={() => {
                        fieldArrays.forEach(fa => {
                            fa.insert(i+1, '');
                        });
                    }} />
            ))
        );
    }

    function addRemoveBtns(fieldArrays, bUpdateRadioBtn) {
        return (
            formik.values[fieldArrays[0].value].map((val, i) => (
                <Icon
                    name='minus circle' size='large' color='red' disabled={i === 0}
                    style={{margin: '4.5px 0'}}
                    onClick={() => {
                        fieldArrays.forEach(fa => {
                            fa.remove(i);
                        });

                        if (bUpdateRadioBtn && formik.values.default_item_idx === i)
                            formik.setFieldValue('default_item_idx', i-1);
                    }} />
            ))
        );
    }

    return (
        <div style={{ padding: '15px', width: '100%', height: '100%', }}>
            <Form onSubmit={formik.handleSubmit}>
                <Button type='submit' >Add this project</Button>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', }} >

                    {/* Images */}
                    <div>
                        <div style={{display: 'flex', flexWrap: 'wrap', marginTop: '20px',}}>
                            {
                                imgFiles.map((imgFile, i) => {
                                    return (
                                        <div key={i} style={{margin: '10px', }} >
                                            <IconGroup size='big'>
                                                <img src={imgFile.preview} alt={imgFile.name}
                                                    style={{width: '200px', height: '200px', objectFit: 'cover',}} />
                                                <Icon name='delete' color='red' circular corner='top right' fitted
                                                    className='link'
                                                    onClick={() => removeImgFile(imgFile)}/>
                                            </IconGroup>
                                        </div>
                                    );
                                })
                            }
                        </div>
                        <ImgDropzone onDrop={handleImgDrop} />

                        {/* <div className='sticky'>
                            <div style={{display: 'grid', gridTemplateColumns: '10% 90%',
                                width: '100%', height: '100%', margin: '14px', }}>
                                <div style={{padding: '14px 0 0 0',}}>
                                    {dispThumbnails()}
                                </div>
                                <div style={{padding: '0'}}>
                                    <Image src={item.images[activeImageIdx]} />
                                </div>
                            </div>
                        </div> */}
                    </div>

                    {/* Item name and descriptions */}
                    <div style={{padding: '15px 10px 10px 30px', }}>
                        {/* name */}
                        <div style={{fontSize: '2.0em', }}>Name:</div>
                        <TextArea id='name' name='name' rows={3}
                            style={{width: '100%', padding: '5px', marginTop: '10px', }}
                            value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                        <Divider />
                        {/* Prices & Sizes*/}
                        <div style={{marginBottom: '10px', fontSize: '1.2em', fontWeight: 'bold', }}>Prices & Sizes:</div>
                        {addFieldArrays(priceSizeFAs, true)}
                        {/* Product details_1 */}
                        <div style={{marginTop: '20px', }}>
                            <div style={{marginBottom: '10px', fontSize: '1.2em', fontWeight: 'bold', }}>Product details 1:</div>
                            {addFieldArrays(details_1_FAs, false)}
                        </div>
                        <Divider />
                        <div style={{marginTop: '20px', }}>
                            {/* {dispAboutItem()} */}
                            <div style={{marginBottom: '10px', fontSize: '1.2em', fontWeight: 'bold', }}>About this item:</div>
                            {addFieldArrays(aboutThisItemFAs, false)}
                        </div>
                    </div>
                </div>

                {/* Product details_2 */}
                <Divider />
                <div>
                    <div style={{fontSize: '1.8em', fontWeight: 'bold', marginTop: '20px', marginBottom: '10px',}}>Product details 2:</div>
                    {addFieldArrays(details_2_FAs, false)}
                </div>
                <Button type='submit' >Add this project</Button>
            </Form>
        </div>
    );
}

export default AddItem;