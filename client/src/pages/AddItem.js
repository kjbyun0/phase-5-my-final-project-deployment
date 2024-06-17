import { useEffect, useState, useContext } from 'react';
import { useOutletContext, useNavigate, useParams, } from 'react-router-dom';
import { useFormik, FormikProvider, FieldArray, } from 'formik';
import * as yup from 'yup';
import ImgDropzone from '../components/ImgDropzone';
import { ItemContext } from '../components/ItemProvider';
import { setUserInfo } from '../components/common';
import { Divider, Form, TextArea, Button, Icon, IconGroup, Radio, } from 'semantic-ui-react';


function AddItem() {
    const [ imgFiles, setImgFiles ] = useState([]);
    const { user,  onSetUser, onSetCartItems, onSetOrders, onSetReviews, onSetSellerItems } = useOutletContext();
    const navigate = useNavigate();
    const { id } = useParams();
    const { item, setItem } = useContext(ItemContext);

    // console.log('in AddItem, id: ', id, ', item: ', item);

    //RBAC
    useEffect(() => {
        if (!user || !user.seller) {
            navigate('/signin');
            return;
        }

        // Editing an existing item.
        if (id && item && parseInt(id) === item.id) {
            formik.setFieldValue('name', item.name);
            formik.setFieldValue('brand', item.brand);
            formik.setFieldValue('default_item_idx', item.default_item_idx);
            formik.setFieldValue('prices', item.prices);
            formik.setFieldValue('discount_prices', item.discount_prices);
            formik.setFieldValue('amounts', item.amounts);
            formik.setFieldValue('units', item.units);
            formik.setFieldValue('packs', item.packs);
            formik.setFieldValue('about_item', item.about_item);
            const details_1_key = [], details_1_val = [];
            item.details_1.forEach(dtl => {
                const pair = dtl.split(';-;');
                details_1_key.push(pair[0]);
                details_1_val.push(pair[1]);
            });
            formik.setFieldValue('details_1_key', details_1_key);
            formik.setFieldValue('details_1_val', details_1_val);

            const details_2_key = [], details_2_val = [];
            item.details_2.forEach(dtl => {
                const pair = dtl.split(';-;');
                details_2_key.push(pair[0]);
                details_2_val.push(pair[1]);
            });
            formik.setFieldValue('details_2_key', details_2_key);
            formik.setFieldValue('details_2_val', details_2_val);

            formik.setFieldValue('images', item.images);
            setImgFiles(item.images);
        }
    }, []);

    const formSchema = yup.object().shape({
        name: yup.string().required('Required')
            .max(200, 'Please, enter name upto 200 characters.'),
        prices: yup.array().of(
            yup.string().required('Required')
                .matches(/^[0-9]*([.]{1}[0-9]{2})?$/, 
                    'Please, enter a decimal number with two digits of fractional part. ')
        ),
        discount_prices: yup.array().of(
            yup.string().required('Required')
                .matches(/^[0-9]*([.]{1}[0-9]{2})?$/, 
                    'Please, enter a decimal number with two digits of fractional part. ')
        ),
        amounts: yup.array().of(
            yup.string().required('Required')
                .matches(/^([0-9]*)([.]{1}[0-9]{1,2})?$/, 
                    'Please, enter a decimal number with one or two digits of fractional part. ')
        ),
        units: yup.array().of(
            yup.string().required('Required')
        ),
        packs: yup.array().of(
            yup.string().required('Required')
                .matches(/^[1-9]+[0-9]*$/, 
                    'Plase, enter an integer.'
                )
        ),
        details_1_key: yup.array().of(
            yup.string().required('required')
        ),
        details_1_val: yup.array().of(
            yup.string().required('required')
        ),
        about_item: yup.array().of(
            yup.string().required('Required')
        ), 
        details_2_key: yup.array().of(
            yup.string().required('required')
        ),
        details_2_val: yup.array().of(
            yup.string().required('required')
        ),
        images: yup.array().min(1, 'At least one image must be uploaded.').max(10, 'Upto 10 images are allowed to upload.')
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            brand: '',
            default_item_idx: 0,
            prices: [''],
            discount_prices: [''],
            amounts: [''],
            units: [''],
            packs: [''],
            about_item: [''], // bullet points
            details_1_key: [''],
            details_1_val: [''],
            details_2_key: [''],
            details_2_val: [''],
            images: [],
            category_id: null,
            seller_id: null,
        },
        validationSchema: formSchema,
        onSubmit: async values => {
            // console.log('OnSubmit: formik.values: ', values);
            
            const uploadedImages = [];
            const cloudName = 'dfsqyivhu';
            for (const file of imgFiles) {
                if (typeof(file) === 'string') {
                    uploadedImages.push(file);
                } else {
                    const publicId = file.name.split('.').slice(0, -1).join('.');
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('upload_preset', 'flatiron_p5_pjt_imgs');
                    formData.append('public_id', publicId);

                    try {
                        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
                            method: 'POST',
                            body: formData,
                        });
                        const data = await response.json();
                        uploadedImages.push(data.secure_url);
                    } catch (error) {
                        console.log('Cloudinary Image Upload Error: ', error);
                    }
                }
            };
            values.images = uploadedImages;
            // console.log('values.images: ', values.images);


            if (values.prices[values.prices.length-1] === '')
                values.prices.pop();
            if (values.discount_prices[values.discount_prices.length-1] === '')
                values.discount_prices.pop();
            if (values.amounts[values.amounts.length-1] === '')
                values.amounts.pop();
            if (values.units[values.units.length-1] === '')
                values.units.pop();
            if (values.packs[values.packs.length-1] === '')
                values.packs.pop();
            if (values.about_item[values.about_item.length-1] === '')
                values.about_item.pop();
            if (values.details_1_key[values.details_1_key.length-1] === '')
                values.details_1_key.pop();
            if (values.details_1_val[values.details_1_val.length-1] === '')
                values.details_1_val.pop();
            if (values.details_2_key[values.details_2_key.length-1] === '')
                values.details_2_key.pop();
            if (values.details_2_val[values.details_2_val.length-1] === '')
                values.details_2_val.pop();

            // console.log('values: ', values);
            const details_1 = values.details_1_key.map((key, i) => key + ';-;' + values.details_1_val[i]);
            const details_2 = values.details_2_key.map((key, i) => key + ';-;' + values.details_2_val[i]);

            const postValues = {
                name: values.name,
                brand: values.brand,  // It is not needed because brand is already included in the name.
                default_item_idx: values.default_item_idx,
                prices: values.prices.map(price => parseFloat(price)),
                discount_prices: values.discount_prices.map(price => parseFloat(price)),
                amounts: values.amounts.map(amt => parseFloat(amt)),
                units: values.units,
                packs: values.packs.map(pack => parseFloat(pack)),
                about_item: values.about_item, // bullet points
                details_1: details_1,
                details_2: details_2,
                images: uploadedImages,
                category_id: null,
                seller_id: user.seller.id,
            };
            // console.log('postValues: ', postValues);

            // console.log('***** before item POST fetch, values: ', values);

            const url = id && item && parseInt(id) === item.id ? `/items/${id}` : '/items'
            await fetch(url, {
                method: id && item && parseInt(id) === item.id ? 'PATCH' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postValues),
            })
            .then(async r1 => {
                await r1.json().then(async data => {
                    if (r1.ok) {
                        // console.log('Item is sucessfully updated: ', data);
                        setItem(data);

                        await fetch('/authenticate')
                        .then(async r2 => 
                            await r2.json().then(userData => {
                                if (r2.ok) {
                                    // console.log('Updated full user data: ', userData);
                                    setUserInfo(userData, onSetUser, onSetCartItems, onSetOrders, onSetReviews, onSetSellerItems);
                                } else {
                                    console.log('In App, error: ', data.message);
                                }
                            })
                        )

                        alert('Item is sucessfully updated.');
                        navigate(`/items/${data.id}`);
                    } else {
                        if (r1.status === 401 || r1.status === 403) {
                            console.log(data);
                            alert(data.message);
                        } else {
                            console.log("Server Error - Can't post this item: ", data);
                            alert(`Server Error - Can't post this item: ${data.message}`);
                        }
                    }
                })
            });
        },
    });

    const pricesFA = {field: 'prices', placeholder: 'Price', insert: null, remove: null, push: null, width: '1fr', };
    const discount_pricesFA = {field: 'discount_prices', placeholder: 'Dis. Price', insert: null, remove: null, push: null, width: '1fr', };
    const amountsFA = {field: 'amounts', placeholder: 'Volume', insert: null, remove: null, push: null, width: '1fr', };
    const unitsFA = {field: 'units', placeholder: 'Vol. Unit', insert: null, remove: null, push: null, width: '1fr', };
    const packsFA = {field: 'packs', placeholder: 'Unit Pack', insert: null, remove: null, push: null, width: '1fr', };
    const priceSizeFAs = [pricesFA, discount_pricesFA, amountsFA, unitsFA, packsFA];

    const aboutThisItemFAs = [{field: 'about_item', placeholder: '', insert: null, remove: null, push: null, width: '1fr', }];

    const details_1_FAs = [
        {field: 'details_1_key', placeholder: 'Key', insert: null, remove: null, push: null, width: '1fr', },
        {field: 'details_1_val', placeholder: 'Value', insert: null, remove: null, push: null, width: '1.6fr', }
    ];

    const details_2_FAs = [
        {field: 'details_2_key', placeholder: 'Key', insert: null, remove: null, push: null, width: '1fr', },
        {field: 'details_2_val', placeholder: 'Value', insert: null, remove: null, push: null, width: '1.6fr', }
    ];



    function handleImgDrop(acceptedFiles) {
        // console.log('in handleImgDrop, acceptedFiles: ', acceptedFiles);

        const imgFilesDict = {};
        imgFiles.forEach(file => {
            if (typeof(file) === 'string') {
                const urlStrs = file.split('/');
                imgFilesDict[urlStrs[urlStrs.length-1]] = file;
            } else
                imgFilesDict[file.name] = file;
        });

        const imgFilesTmp = [...imgFiles];
        acceptedFiles.forEach(file => {
            if (!(file.name in imgFilesDict)) {
                imgFilesDict[file.name] = file;
                imgFilesTmp.push(Object.assign(file, {preview: URL.createObjectURL(file)}));
            }
        });
        // console.log('in handleImgDrop, imgFilesDict: ', imgFilesDict, ', imgFilesTmp: ', imgFilesTmp);
        formik.setFieldValue('images', imgFilesTmp);
        setImgFiles(imgFilesTmp);
    };

    function removeImgFile(imgFile) {
        const imgFilesTmp = typeof(imgFile) === 'string' ? 
            imgFiles.filter(file => typeof(file) !== 'string' || file !== imgFile) : 
            imgFiles.filter(file => typeof(file) === 'string' || file.name !== imgFile.name);
        formik.setFieldValue('images', imgFilesTmp);
        setImgFiles(files => imgFilesTmp);
    }

    // console.log('imgFiles: ', imgFiles);
    // console.log('in AddItem, formik values: ', formik.values);


    function getFirstErrorInFieldArrays(fieldArrays) {
        for (const fa of fieldArrays) {
            if (isErrorFieldArray(fa)) {
                for (let i = 0; i < formik.values[fa.field].length; i++) {
                    if (formik.errors[fa.field][i] && formik.touched[fa.field][i]) {
                        return (
                            <div className='formik-warning'>
                                <Icon name='warning circle' />
                                {
                                    fa.placeholder ? 
                                    `${fa.placeholder}: ${formik.errors[fa.field][i]}` : 
                                    `${formik.errors[fa.field][i]}`
                                }
                            </div>
                        );
                    }
                }
            } else
                continue;
        }

        return null;
    }

    function addFieldArrays(fieldArrays, bUpdateRadioBtn) {
        const gridColumns = [];
        if (bUpdateRadioBtn)
            gridColumns.push('17px');
        fieldArrays.forEach(fa => gridColumns.push(fa.width));
        // For insert buttons
        gridColumns.push('28.27px');
        // For remove buttons
        gridColumns.push('28.27px');
        const gridColumnsStr = gridColumns.join(' ');
        // console.log('in addFieldArrays, gridColumnsStr: ', gridColumnsStr);

        return (
            <div>
                <div style={{display: 'grid', gridTemplateColumns: gridColumnsStr, alignItems: 'center', }}>
                    {bUpdateRadioBtn ? addRadioBtns(fieldArrays[0]) : null}
                    {
                        fieldArrays.map(fa => (
                            <div key={fa.field}>{addFieldArray(fa)}</div>
                        ))
                    }
                    {addInsertBtns(fieldArrays)}
                    {addRemoveBtns(fieldArrays, bUpdateRadioBtn)}
                </div>
                {getFirstErrorInFieldArrays(fieldArrays)}
            </div>
        );
    }

    function addRadioBtns(fieldArray) {
        return (
            <div>
                <div>
                    {fieldArray.placeholder ? <div style={{height: '19.99px', }}> </div> : null}
                </div>
                {
                    formik.values[fieldArray.field].map((val, i) => (
                        <Radio
                            key={i}
                            name='default_item_idx'
                            style={{margin: '7.5px 5px 5.8px 0', }}
                            value={i}
                            checked={formik.values.default_item_idx === i}
                            onChange={(e, d) => formik.setFieldValue('default_item_idx', d.value)}
                        />
                    ))
                }
            </div>
        );
    }

    function isErrorFieldArray(fieldArray) {
        // console.log('***** ', 'field: ', fieldArray.field, ' *****');
        // console.log('formik errors: ', formik.errors[fieldArray.field], ', touched: ', formik.touched[fieldArray.field]);
        return formik.errors[fieldArray.field] && formik.touched[fieldArray.field];
    }

    function isErrorFieldArrayVal(fieldArray, index) {
        // console.log('***** ', 'index: ', index, ' *****');

        return isErrorFieldArray(fieldArray) && formik.errors[fieldArray.field][index] && 
            formik.touched[fieldArray.field][index];
    }

    function addFieldArray(fieldArray) {
        return (
            <FormikProvider value={formik}>
                <FieldArray name={fieldArray.field}>
                    {({ insert, remove, push }) => {
                        fieldArray.insert = insert;
                        fieldArray.remove = remove;
                        fieldArray.push = push;

                        // backgroundColor: IsErrorFieldArrayVal(fieldArray, i) ? '#ffecec' : '#ffffff', 
                        return (
                            <div>
                                <div style={{paddingLeft: '15px', fontWeight: 'bold', }}>
                                    {fieldArray.placeholder ? fieldArray.placeholder : null}
                                </div>
                                {
                                    formik.values[fieldArray.field].map((val, i) => {
                                        // console.log('IsErrorFieldArrayVal: ', isErrorFieldArrayVal(fieldArray, i), 
                                        //     ', field: ', fieldArray.field, ', index: ', i);
                                        
                                        return (
                                            <div key={`${fieldArray.field}-${i}`}>
                                                <input name={`${fieldArray.field}.${i}`}
                                                    style={{width: '100%', height: '30px', marginBottom: '3px',
                                                        borderColor: isErrorFieldArrayVal(fieldArray, i) ? '#ff8080' : '#e0e0e0',
                                                    }}
                                                    placeholder={fieldArray.placeholder}
                                                    value={formik.values[fieldArray.field][i]}
                                                    onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                                {/* {
                                                    formik.errors[fieldArray.field] && formik.errors[fieldArray.field][i] &&
                                                    formik.touched[fieldArray.field] && formik.touched[fieldArray.field][i] ?
                                                    <div>{formik.errors[fieldArray.field][i]}</div> :
                                                    null
                                                } */}
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        );
                    }}
                </FieldArray>
            </FormikProvider>
        );
    }

    function addInsertBtns(fieldArrays) {
        return (
            <div>
                <div>
                    {fieldArrays[0].placeholder ? <div style={{height: '19.99px', }}> </div> : null}
                </div>
                {
                    formik.values[fieldArrays[0].field].map((val, i) => (
                        <Icon className='link' 
                            name='plus circle' size='large' color='blue'
                            style={{margin: '4.5px 0 7.5px 0'}}
                            onClick={() => {
                                fieldArrays.forEach(fa => {
                                    fa.insert(i+1, '');
                                });
                            }} />
                    ))
                }
            </div>
        );
    }

    function addRemoveBtns(fieldArrays, bUpdateRadioBtn) {
        return (
            <div>
                <div>
                    {fieldArrays[0].placeholder ? <div style={{height: '19.99px', }}> </div> : null}
                </div>
                {
                    formik.values[fieldArrays[0].field].map((val, i) => (
                        <Icon className='link' 
                            name='minus circle' size='large' color='red' disabled={i === 0}
                            style={{margin: '4.5px 0 7.5px 0'}}
                            onClick={() => {
                                fieldArrays.forEach(fa => {
                                    fa.remove(i);
                                });

                                if (bUpdateRadioBtn && formik.values.default_item_idx === i)
                                    formik.setFieldValue('default_item_idx', i-1);
                            }} />
                    ))
                }
            </div>
        );
    }

    return (
        <div style={{ minWidth: '815px', padding: '15px', }}>
            <Form onSubmit={formik.handleSubmit}>
                <div style={{display: 'grid', gridTemplateColumns: '1fr max-content', alignItems: 'center'}}>
                    <div />
                    <Button type='submit' color='yellow' size='large' 
                        style={{color: 'black', borderRadius: '10px', width: '250px', marginBottom: '20px', }}>
                        Add this product</Button>
                </div>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 2fr', }} >

                    {/* Images */}
                    <div>
                        <div style={{display: 'flex', flexWrap: 'wrap', marginTop: '20px', }}>
                            {
                                imgFiles.map((imgFile, i) => {
                                    return (
                                        <div key={i} style={{margin: 'auto', }} >
                                            <IconGroup size='big'>
                                                {
                                                    typeof(imgFile) === 'string' ? 
                                                    <img src={imgFile} alt='product image'
                                                        style={{width: '200px', height: '200px', objectFit: 'cover',}} /> : 
                                                    <img src={imgFile.preview} alt='product image'
                                                        style={{width: '200px', height: '200px', objectFit: 'cover',}} />
                                                }
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
                        {formik.errors.images && 
                            <div className='formik-warning'>
                                <Icon name='warning circle' />
                                {formik.errors.images}
                            </div>
                        }
                    </div>

                    {/* Item name and descriptions */}
                    <div style={{padding: '15px 0 10px 30px', }}>
                        {/* name */}
                        <div style={{fontSize: '2.0em', }}>Name:</div>
                        <TextArea id='name' name='name' rows={3}
                            style={{width: '100%', padding: '5px', marginTop: '10px', }}
                            value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                        {formik.errors.name && formik.touched.name && 
                            <div className='formik-warning'>
                                <Icon name='warning circle' />
                                {formik.errors.name}
                            </div>
                        }
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
                <div style={{display: 'grid', gridTemplateColumns: '1fr max-content', alignItems: 'center'}}>
                    <div />
                    <Button type='submit' color='yellow' size='large' 
                        style={{color: 'black', borderRadius: '10px', width: '250px', marginTop: '20px', }}>
                        Add this product</Button>
                </div>
            </Form>
        </div>
    );
}

export default AddItem;