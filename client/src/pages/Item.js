import React, { useEffect, useState } from 'react';
import { useParams, useOutletContext, useNavigate, } from 'react-router-dom'; 
import { dispPrice, dispListPrice, handleCItemAdd, handleCItemChange, } from '../components/common';
import { Divider, Table, TableBody, TableRow, TableCell, 
    Image, ButtonGroup, Button, Dropdown,  } from 'semantic-ui-react';


function Item() {
    const { id } = useParams();
    const [ item, setItem ] = useState(null);
    const [ activeItemIdx, setActiveItemIdx ] = useState(null);
    const [ activeImageIdx, setActiveImageIdx ] = useState(null);
    const [ quantity, setQuantity ] = useState(1);
    const { user, cartItems, onSetCartItems, orders, onSetOrders, } = useOutletContext();
    const navigate = useNavigate()

    const quantityOptions = [];
    for (let i = 1; i <= 30; i++)
        quantityOptions.push({
            key: i,
            text: `${i}`,
            value: i
        });

    console.log('In Item, user: ', user, ', item: ', item, ', cartItems: ', cartItems, ', orders: ', orders);
    console.log('quantity: ', quantity);

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

    function handleAddToCart() {
        if (!item) return;

        // if user is not signed in or is a seller
        if (!user || !user.customer) {
            navigate('/signin');
        }

        const cItem = cartItems.find(cItem => 
            cItem.item_id === item.id && cItem.item_idx === activeItemIdx);
        
        if (cItem) {
            handleCItemChange({
                ...cItem,
                quantity: cItem.quantity + quantity,
            }, cartItems, onSetCartItems);
            // fetch(`/cartitems/${cItem.id}`, {
            //     method: 'PATCH',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({
            //         quantity: cItem.quantity + quantity,
            //     }),
            // })
            // .then(r => {
            //     r.json().then(data => {
            //         if (r.ok) {
            //             console.log('In handleAddToCart fetch(PATCH), cartItem: ', data);

            //             onSetCartItems(cartItems.map(cItems => 
            //                 cItems.item_id === data.item_id && cItems.item_idx === data.item_idx ? 
            //                 data : cItems));

            //             // navigate to my cart page later...
            //         } else {
            //             if (r.status === 401 || r.status === 403) {
            //                 console.log(data);
            //                 alert(data.message);
            //             } else {
            //                 console.log('Server Error - Updating an item in cart: ', data);
            //                 alert(`Server Error - Updating an item in cart: ${data.message}`);
            //             }
            //         }
            //     });
            // });
        } else {
            handleCItemAdd({
                checked: 1,
                quantity: quantity,
                item_idx: activeItemIdx,
                item_id: item.id,
                customer_id: user.customer.id,
            }, cartItems, onSetCartItems);
            // fetch('/cartitems', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({
            //         quantity: quantity,
            //         item_idx: activeItemIdx,
            //         item_id: item.id,
            //         customer_id: user.customer.id,
            //     }),
            // })
            // .then(r => {
            //     r.json().then(data => {
            //         if (r.ok) {
            //             console.log('In handleAddToCart fetch(POST), cartItem: ', data);

            //             onSetCartItems([
            //                 ...cartItems,
            //                 data
            //             ]);

            //             // navigate to my cart page later...
            //         } else {
            //             if (r.status === 401 || r.status === 403) {
            //                 console.log(data);
            //                 alert(data.message);
            //             } else {
            //                 console.log("Server Error - Can't add an item to cart: ", data);
            //                 alert(`Server Error - Can't add an item to cart: ${data.message}`);
            //             }
            //         }
            //     });
            // });
        }
    }


    function handlePlaceOrder() {
        if (!item) return;

        // if user is not signed in or is a seller
        if (!user || !user.customer) {
            navigate('/signin');
        }

        fetch('/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                street_1: user.street_1,
                street_2: user.street_2,
                city: user.city,
                state: user.state,
                zip_code: user.zip_code,
                customer_id: user.id,
            }),
        })
        .then(r => {
            r.json().then(data1 => {
                if (r.ok) {
                    console.log('in handlePlaceOrder new order: ', data1);
                    const orderTmp = data1;
                    fetch('/orderitems', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            quantity: quantity,
                            price: item.discount_prices[activeItemIdx],
                            item_idx: activeItemIdx, // ??? - what if this item is removed from db?
                            item_id: item.id,
                            order_id: orderTmp.id,
                        }),
                    })
                    .then(r => {
                        r.json().then(data2 => {
                            if (r.ok) {
                                console.log('in handlePlaceOrder new order item: ', data2);
                                const orderItemTmp = data2;
                                orderItemTmp.item = item;
                                orderTmp.order_items.push(orderItemTmp);
                                onSetOrders([
                                    ...orders,
                                    orderTmp
                                ]);
                            } else {
                                if (r.status === 401 || r.status === 403) {
                                    console.log(data2);
                                    alert(data2.message);
                                } else {
                                    console.log("Server Error - Can't add an order item: ", data2);
                                    alert(`Server Error - Can't add an order item: ${data2.message}`);

                                    // delete this order. Don't need to take care of promise.
                                    fetch(`/orders/${orderTmp.id}`, {
                                        method: 'DELETE',
                                    })
                                }
                            }
                        });
                    });
                } else {
                    if (r.status === 401 || r.status === 403) {
                        console.log(data1);
                        alert(data1.message);
                    } else {
                        console.log("Server Error - Can't place an order: ", data1);
                        alert(`Server Error - Can't place an order: ${data1.message}`);
                    }
                }
            });
        });
    }


    if (!item)
        return;

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
                                style={{display: 'block', borderRadius: '20px', width: '220px', margin: '5px', color: 'black', }}
                                onClick={handleAddToCart}>Add to Cart</Button>
                            <Button color='orange' size='medium' 
                                style={{display: 'block', borderRadius: '20px', width: '220px', margin: '5px', color: 'black', }}
                                onClick={handlePlaceOrder}>Buy Now</Button>
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