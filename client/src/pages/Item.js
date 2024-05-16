import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import { dispPrice, dispListPrice, } from '../components/common';
import { Divider, Table, TableBody, TableRow, TableCell, 
    Image, ButtonGroup, Button, Dropdown, Menu, } from 'semantic-ui-react';


function Item() {
    const { id } = useParams();
    const [ item, setItem ] = useState(null);
    const [ activeItemIdx, setActiveItemIdx ] = useState(null);
    const [ activeImageIdx, setActiveImageIdx ] = useState(null);
    const [ quantity, setQuantity ] = useState(1);

    const quantityOptions = [];
    for (let i = 1; i <= 30; i++)
        quantityOptions.push({
            key: i,
            text: `${i}`,
            value: i
        });

    useEffect(() => {
        fetch(`/items/${id}`)
        .then(r => {
            r.json().then(data => {
                if (r.ok) {
                    // console.log('In Istem, fetched item: ', data);
                    setItem(data);
                    setActiveItemIdx(data.default_item_idx);
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
                <div key={pack} className={`${i === activeItemIdx ? 'size-active-link' : 'size-link'} link`} 
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

    // console.log('item.discount_prices[item.default_item_idx]')
    console.log('quantity: ', quantity);

    return (
        <div style={{ padding: '15px', width: '100%', height: '100%', }}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', }} >
                {/* Images */}
                <div>
                    <div className='sticky'>
                        <div style={{display: 'grid', gridTemplateColumns: '10% 90%',
                            width: '100%', height: '100%', margin: '14px', }}>
                            <div style={{padding: '14px 0 0 0',}}>
                                {dispThumbnails()}
                            </div>
                            <div style={{padding: '0'}}>
                                <Image src={item.images[activeImageIdx]} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Item name and descriptions */}
                <div style={{padding: '15px 10px 10px 30px', }}>
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
                    <div style={{display: 'grid', gridTemplateColumns: 'auto 1fr', }}>
                        <div style={{margin: '20px 0 0 0', }}>
                            {/* Size options */}
                            <div>
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
                        </div>
                        <div style={{margin: '20px 0 0 20px',}}>
                            <ButtonGroup>
                                <Button style={{borderRadius: '20px 0 0 20px', width: '15px', margin: '5px 0 0 5px', 
                                    color: 'gray', border: '1px solid gray', 
                                    background: `${quantity <= 1 ? 'lightgray' : 'white'}`, }} 
                                    disabled={quantity <= 1} onClick={() => setQuantity(quantity - 1)} >-</Button>
                                <Dropdown style={{width: '135px', height: '37px', border: '1px solid grey', 
                                    borderRadius: '0', margin: '5px 0 0 0', background: 'white', }} 
                                    button scrolling compact text={`Quantity: ${quantity}`} 
                                    options={quantityOptions} value={quantity} 
                                    onChange={(e, d) => setQuantity(d.value)} />
                                <Button style={{borderRadius: '0 20px 20px 0', width: '15px', margin: '5px 5px 0 0', 
                                    color: 'gray', border: '1px solid gray', 
                                    background: `${quantity >= 30 ? 'lightgray' : 'white'}`, }} 
                                    disabled={quantity >= 30} onClick={() => setQuantity(quantity + 1)} >+</Button>
                            </ButtonGroup>
                            <Button color='yellow' size='medium' 
                                style={{display: 'block', borderRadius: '20px', width: '220px', margin: '5px', color: 'black', }}>Add to Cart</Button>
                            <Button color='orange' size='medium' 
                                style={{display: 'block', borderRadius: '20px', width: '220px', margin: '5px', color: 'black', }}>Buy Now</Button>
                        </div>
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
            </div>

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