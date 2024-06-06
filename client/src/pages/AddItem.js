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

    const pricesFn = {insert: null, remove: null, push: null};
    const discount_pricesFn = {insert: null, remove: null, push: null};
    const amountsFn = {insert: null, remove: null, push: null};
    const unitsFn = {insert: null, remove: null, push: null};
    const packsFn = {insert: null, remove: null, push: null};
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
            details_1: {},
            details_2: {},
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


    // function dispAllSizes() {
    //     // console.log('activeItemIdx: ', activeItemIdx);
    //     const packs = item.packs.map((pack, i) => {
    //         return (
    //             <div key={pack} className={`${i === activeItemIdx ? 'size-active-link' : 'size-link'} link`}
    //                 onClick={() => setActiveItemIdx(i)}>
    //                 {
    //                     `${item.amounts[i]} \
    //                     ${item.units[i].charAt(0).toUpperCase() + item.units[i].slice(1)} \
    //                     (Pack of ${pack})`
    //                 }
    //             </div>
    //         );
    //     });
    //     return packs;
    // }

    // function dispDetail_1() {
    //     return (
    //         <Table style={{border: '0'}}>
    //             <TableBody>
    //                 {
    //                     Object.keys(item.details_1).map(key =>
    //                         <TableRow key={key}>
    //                             <TableCell style={{width: '40%', fontWeight: 'bold', paddingLeft: '0', }}>{key}</TableCell>
    //                             <TableCell style={{width: '60%', paddingLeft: '0', }}>{item.details_1[key]}</TableCell>
    //                         </TableRow>
    //                     )
    //                 }
    //             </TableBody>
    //         </Table>
    //     );
    // }

    // function dispDetail_2() {
    //     return (
    //         <div style={{margin: '15px', fontSize: '1.1em'}}>
    //             {
    //                 Object.keys(item.details_2).map(key =>
    //                     <div key={key} style={{marginBottom: '8px', }}>
    //                         <span style={{fontWeight: 'bold', }}>{`${key} : `}</span>
    //                         <span>{item.details_2[key]}</span>
    //                     </div>
    //                 )
    //             }
    //         </div>
    //     );
    // }

    // function dispAboutItem() {
    //     return (
    //         <ul style={{marginLeft: '15px', }}>
    //             {item.about_item.map((info, i) =>
    //                 <li key={i}>{info}</li>
    //             )}
    //         </ul>
    //     );
    // }

    // function handleThumnailMouseEnter(idx) {
    //     console.log('handleThumnailMouseEnter, idx: ', idx);
    //     setActiveImageIdx(idx);
    // }

    // function dispThumbnails() {
    //     return item.thumbnails.map((thumbnail, i) =>
    //         <Image key={i} className='item-thumbnail'
    //             src={thumbnail}
    //             onMouseEnter={() => handleThumnailMouseEnter(i)}
    //         />
    //     );
    // }

    function addItemCats(faName, placeholder,func) {
        return (
            <FormikProvider value={formik}>
                <FieldArray name={faName}>
                    {({ insert, remove, push }) => {
                        func.insert = insert;
                        func.remove = remove;
                        func.push = push;

                        return (
                            <div>{
                                formik.values[faName].map((val, i) => (
                                    <div key={i}>
                                        <Input name={`${faName}.${i}`}
                                            style={{width: '100px', height: '30px', }} placeholder={placeholder}
                                            value={formik.values[faName][i]}
                                            onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                        {
                                            formik.errors[faName] && formik.errors[faName][i] &&
                                            formik.touched[faName] && formik.touched[faName][i] ?
                                            <div>{formik.errors[faName][i]}</div> :
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

    function addItemCatRadioBtns() {
        return (
            formik.values.prices.map((prices, i) => (
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

    function addItemCatInsertBtns() {
        return (
            formik.values.prices.map((price, i) => (
                <Icon
                    name='plus circle' size='large' color='blue'
                    style={{margin: '4.5px 0'}}
                    onClick={() => {
                        pricesFn.insert(i+1, '');
                        discount_pricesFn.insert(i+1, '');
                        amountsFn.insert(i+1, '');
                        unitsFn.insert(i+1, '');
                        packsFn.insert(i+1, '');
                    }} />
            ))
        );
    }

    function addItemCatRemoveBtns() {
        return (
            formik.values.prices.map((price, i) => (
                <Icon
                    name='minus circle' size='large' color='red' disabled={i === 0}
                    style={{margin: '4.5px 0'}}
                    onClick={() => {
                        pricesFn.remove(i);
                        discount_pricesFn.remove(i);
                        amountsFn.remove(i);
                        unitsFn.remove(i);
                        packsFn.remove(i);
                        if (formik.values.default_item_idx === i)
                            formik.setFieldValue('default_item_idx', i-1);
                    }} />
            ))
        );
    }

    function handleAddKVPair(oName) {
        const newKVPair = `new${oName}KV`;
        const key = formik.values[newKVPair]?.key;
        const value = formik.values[newKVPair]?.value;
        if (key && value) {
            formik.setFieldValue(`${oName}.${key}`, value);
            formik.setFieldValue(`${newKVPair}.key`, '');
            formik.setFieldValue(`${newKVPair}.value`, '');
        }
    }

    function handleRemoveKVPair(oName, key) {
        delete formik.values[oName][key];
        formik.setFieldValue(oName, formik.values[oName]);
    }


    function dispKVPair(oName) {
        return (
            Object.keys(formik.values[oName]).map(key =>
                <div key={key}
                    style={{display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr',
                    alignItems: 'center'}}>
                    <div style={{width: '210px', }}>{key}</div>
                    <div style={{width: '334.77px', }}>{formik.values[oName][key]}</div>
                    <Icon
                        name='minus circle' size='large' color='red'
                        style={{margin: '4.5px 0'}}
                        onClick={() => handleRemoveKVPair(oName, key)}
                    />
                </div>
            )
        );
    }

    function addKVPair(oName) {
        const newKVPair = `new${oName}KV`;

        return (
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr',
                alignItems: 'center'}}>
                <Input
                    id='key' name={`${newKVPair}.key`}
                    style={{width: '210px', height: '30px', }}
                    value={formik.values[newKVPair]?.key || ''}
                    onChange={formik.handleChange}
                />
                <Input
                    id='value' name={`${newKVPair}.value`}
                    style={{width: '334.77px', height: '30px', }}
                    value={formik.values[newKVPair]?.value || ''}
                    onChange={formik.handleChange}
                />
                <Icon
                    name='plus circle' size='large' color='blue'
                    style={{margin: '4.5px 0'}}
                    onClick={() => handleAddKVPair(oName)}
                />
            </div>
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
                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
                            alignItems: 'start', }}>
                            <div>{addItemCatRadioBtns()}</div>
                            <div>{addItemCats('prices', 'Price', pricesFn)}</div>
                            <div>{addItemCats('discount_prices', 'Dis. Price',discount_pricesFn)}</div>
                            <div>{addItemCats('amounts', 'Volume',amountsFn)}</div>
                            <div>{addItemCats('units', 'Vol. Unit',unitsFn)}</div>
                            <div>{addItemCats('packs', 'Unit Pack',packsFn)}</div>
                            <div>{addItemCatInsertBtns()}</div>
                            <div>{addItemCatRemoveBtns()}</div>
                        </div>
                        {/* Product details_1 */}
                        <div style={{marginTop: '20px', }}>
                            <div style={{marginBottom: '10px', fontSize: '1.2em', fontWeight: 'bold', }}>Product details 1:</div>
                            {dispKVPair('details_1')}
                            {addKVPair('details_1')}
                        </div>
                        <Divider />
                        <div style={{marginTop: '20px', }}>
                            {/* {dispAboutItem()} */}
                            <div style={{marginBottom: '10px', fontSize: '1.2em', fontWeight: 'bold', }}>About this item:</div>

                            <FormikProvider value={formik}>
                                <FieldArray name='about_item'>
                                    {({ insert, remove, push }) => {
                                        return (
                                            <div>{
                                                formik.values.about_item.map((val, i) => (
                                                    <div key={i}>
                                                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
                                                            alignItems: 'center', }}>
                                                            <Input name={`about_item.${i}`}
                                                                style={{width: '520px', height: '30px', }}
                                                                value={formik.values.about_item[i]}
                                                                onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                                            <Icon
                                                                name='plus circle' size='large' color='blue'
                                                                style={{margin: '4.5px 0'}}
                                                                onClick={() => insert(i+1, '')}
                                                            />
                                                            <Icon
                                                                name='minus circle' size='large' color='red' disabled={i === 0}
                                                                style={{margin: '4.5px 0'}}
                                                                onClick={() => remove(i)}
                                                            />
                                                        </div>
                                                        {
                                                            formik.errors.about_item && formik.errors.about_item[i] &&
                                                            formik.touched.about_item && formik.touched.about_item[i] ?
                                                            <div>{formik.errors.about_item[i]}</div> :
                                                            null
                                                        }
                                                    </div>
                                                ))
                                            }</div>
                                        );
                                    }}
                                </FieldArray>
                            </FormikProvider>
                        </div>
                    </div>
                </div>

                {/* Product details_2 */}
                <Divider />
                <div>
                    <div style={{fontSize: '1.8em', fontWeight: 'bold', marginTop: '20px', marginBottom: '10px',}}>Product details 2:</div>
                    {dispKVPair('details_2')}
                    {addKVPair('details_2')}
                </div>
                <Button type='submit' >Add this project</Button>
            </Form>
        </div>
    );
}

export default AddItem;