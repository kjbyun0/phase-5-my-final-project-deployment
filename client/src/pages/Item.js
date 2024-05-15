import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import { dispPrice, dispListPrice, } from '../components/common';
import { Divider, Table, TableBody, TableRow, TableCell, 
    Sticky, Image, Grid, GridRow, GridColumn, Rail, } from 'semantic-ui-react';


function Item() {
    const { id } = useParams();
    const [ item, setItem ] = useState(null);
    const [ activeItemIdx, setActiveItemIdx ] = useState(null);
    const [ activeImageIdx, setActiveImageIdx ] = useState(null);

    useEffect(() => {
        fetch(`/items/${id}`)
        .then(r => {
            r.json().then(data => {
                if (r.ok) {
                    // console.log('In Istem, fetched item: ', data);
                    setItem(data);
                    setActiveItemIdx(data.default_item);
                    if (data.thumbnails.length)
                        setActiveImageIdx(0);
                } else {
                    console.log('Error: ', data.message);
                }
            });
        })
    }, []);

    function dispAllSizes() {
        // console.log('activeItemIdx: ', activeItemIdx);
        const packs = item.packs.map((pack, i) => {
            return (
                <div key={pack} className={i === activeItemIdx ? 'size-active-link' : 'size-link'} 
                    onClick={() => setActiveItemIdx(i)}>
                    {
                        `${item.amounts[i]} \
                        ${item.units[i].charAt(0).toUpperCase() + item.units[i].slice(1)} \
                        (Pack of ${pack})`
                    }
                </div>
            );
        });
        return packs;
    }

    function dispDetail_1() {
        return (
            <Table style={{border: '0'}}>
                <TableBody>
                    {
                        Object.keys(item.details_1).map(key => 
                            <TableRow key={key}>
                                <TableCell style={{width: '40%', fontWeight: 'bold', paddingLeft: '0', }}>{key}</TableCell>
                                <TableCell style={{width: '60%', paddingLeft: '0', }}>{item.details_1[key]}</TableCell>
                            </TableRow>
                        )
                    }
                </TableBody>
            </Table>
        );
    }

    function dispDetail_2() {
        return (
            <div style={{margin: '15px', fontSize: '1.1em'}}>
                {
                    Object.keys(item.details_2).map(key => 
                        <div key={key} style={{marginBottom: '8px', }}>
                            <span style={{fontWeight: 'bold', }}>{`${key} : `}</span>
                            <span>{item.details_2[key]}</span>
                        </div>
                    )
                }
            </div>
        );
    }

    function dispAboutItem() {
        return (
            <ul style={{marginLeft: '15px', }}>
                {item.about_item.map((info, i) =>
                    <li key={i}>{info}</li>
                )}
            </ul>
        );
    }

    function handleThumnailMouseEnter(idx) {
        console.log('handleThumnailMouseEnter, idx: ', idx);
        setActiveImageIdx(idx);
    }

    function dispThumbnails() {
        return item.thumbnails.map((thumbnail, i) => 
            <Image key={i} className='item-thumbnail' 
                src={thumbnail}
                onMouseEnter={() => handleThumnailMouseEnter(i)}
            />
        );
    }

    if (!item)
        return;

    // console.log('item.discount_prices[item.default_item]')
    return (
        <div style={{ padding: '15px', width: '100%', height: '100%', }}>
            <Grid columns={2} >
                {/* Images */}
                <GridColumn >
                    <div className='sticky'>
                        <Grid columns={2} style={{width: '100%', height: '100%', margin: '14px', }}>
                            <GridColumn style={{width: '10%', padding: '14px 0 0 0',}}>
                                {dispThumbnails()}
                            </GridColumn>
                            <GridColumn style={{width: '90%', padding: '0'}}>
                                <Image src={item.images[activeImageIdx]} />
                            </GridColumn>
                        </Grid>
                        {/* <Image src={item.images[0]} /> */}
                    </div>
                </GridColumn>

                {/* Item name and descriptions */}
                <GridColumn>
                    <div style={{padding: '10px', }}>
                        <h1 style={{fontWeight: 'normal',}}>{item.name}</h1>
                        <Divider />
                        {/* Price */}
                        <div style={{marginTop: '20px', }}>
                            {
                                item.prices[activeItemIdx] !== item.discount_prices[activeItemIdx] ?
                                <span style={{fontSize: '2em', color: 'red', marginRight: '10px', }}>
                                    -{Math.round((1-item.discount_prices[activeItemIdx] / 
                                        item.prices[activeItemIdx])*100)}%
                                </span> :
                                null
                            }
                            {dispPrice(item, activeItemIdx)}
                        </div>
                        <div>
                            {
                                item.prices[activeItemIdx] !== item.discount_prices[activeItemIdx] ?
                                <>
                                    <span style={{marginRight: '5px', }}>List Price:</span>
                                    {dispListPrice(item, activeItemIdx)}
                                </> :
                                null
                            }
                        </div>
                        {/* Size options */}
                        <div style={{margin: '20px 0 0 0', }}>
                            <span style={{fontSize: '1.2em', marginRight: '10px', }}>Size:</span>
                            <span style={{fontSize: '1.2em',  fontWeight: 'bold', }}>
                                {
                                    `${item.amounts[activeItemIdx]} \
                                    ${item.units[activeItemIdx].charAt(0).toUpperCase() + item.units[activeItemIdx].slice(1)} \
                                    (Pack of ${item.packs[activeItemIdx]})`
                                }
                            </span>
                        </div>
                        <div>
                            {dispAllSizes()}
                        </div>
                        {/* Product details_1 */}
                        <div style={{marginTop: '20px', }}>
                            {dispDetail_1()}                
                        </div>
                        <Divider />
                        <div style={{marginTop: '20px', }}>
                            <div style={{marginBottom: '10px', fontSize: '1.2em', fontWeight: 'bold', }}>About this item</div>
                            {dispAboutItem()}
                        </div>
                    </div>
                </GridColumn>
            </Grid>

            {/* Product details_2 */}
            <Divider />
            <div style={{fontSize: '1.8em', fontWeight: 'bold', marginTop: '20px'}}>Product details</div>
            {dispDetail_2()}

            {/* Customer Reviews */}
            <Divider />

        </div>
    );
}

export default Item;