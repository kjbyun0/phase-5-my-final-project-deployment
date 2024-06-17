import { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom'; 
import { handleCItemDelete, handleCItemChange } from '../components/common';
import { Button, Divider, Checkbox, Dropdown, Input, } from 'semantic-ui-react';

function Cart() {
    const { user, cartItems, onSetCartItems, orders, onSetOrders } = useOutletContext();
    //0: Nothing is selected, 1: Not all items selected, 2: all items selected
    const [ selectStatus, setSelectStatus ] = useState(2);
    const navigate = useNavigate();

    const [ qInputs, setQInputs ] = useState({});

    useEffect(() => {
        // RBAC
        if (!user || !user.customer) {
            navigate('/signin');
            return;
        }

        const tmpDict = {};
        cartItems.forEach(cItem => tmpDict[cItem.id] = 
            [cItem.quantity >= 10 ? true : false, cItem.quantity.toString()]);
        setQInputs(tmpDict);

        const selectNum = cartItems.reduce((accum, cItem) => {
            if (cItem.checked)
                return accum + 1;
            else
                return accum;
        }, 0);
        if (selectNum === cartItems.length)
            setSelectStatus(2);
        else if (selectNum === 0)
            setSelectStatus(0);
        else
            setSelectStatus(1);
    }, [cartItems]);

    const quantityOptions = [
        {key: 0, text: '0 (Delete)', value: 0},
        {key: 1, text: '1', value: 1},
        {key: 2, text: '2', value: 2},
        {key: 3, text: '3', value: 3},
        {key: 4, text: '4', value: 4},
        {key: 5, text: '5', value: 5},
        {key: 6, text: '6', value: 6},
        {key: 7, text: '7', value: 7},
        {key: 8, text: '8', value: 8},
        {key: 9, text: '9', value: 9},
        {key: 10, text: '10+', value: 10},
    ];

    // console.log('In Cart, user: ', user, ', cartItems: ', cartItems, ', orders: ', orders);
    // console.log('In Cart, qInputs: ', qInputs);

    function handleNavigateItem(itemId) {
        navigate(`/items/${itemId}`);
    }

    function handleCItemMassQuantityChange(e, d, cItem) {
        // console.log('in handleDropdown, e: ', e, ', d: ', d, ', cItem: ', cItem);

        if (/^([1-9]{1}[0-9]{0,2})|([0]{0,1})$/.test(d.value)) {
            const qInput = qInputs[cItem.id];
            qInput[1] = d.value;
            setQInputs({...qInputs, [cItem.id]: qInput,});            
        }
    }

    function handleCItemQuantityChange(e, d, cItem) {
        // console.log('in handleDropdown, e: ', e, ', d: ', d, ', cItem: ', cItem);

        if (d.value === 10) {
            const qInput = qInputs[cItem.id];
            qInput[0] = true;
            setQInputs({
                ...qInputs,
                [cItem.id]: qInput,
            });
        } else
            handleCItemChange({
                ...cItem,
                quantity: d.value,
            }, onSetCartItems, null);
    }

    async function handleSelect() {
        for (const cartItem of cartItems) {
            if ((selectStatus === 2 && cartItem.checked) || 
                (selectStatus !== 2 && !cartItem.checked)) {
                await handleCItemChange({
                    ...cartItem,
                    checked: selectStatus === 2 ? 0 : 1,
                }, onSetCartItems, null);
            }
        }
    }

    function deleteCheckedCartItems() {
        cartItems.filter(cItem => cItem.checked)
        .forEach(cItem => handleCItemDelete(cItem, onSetCartItems));
    }

    async function handlePlaceOrder() {
        const numCheckedItems = cartItems.reduce((acc, cItem) => cItem.checked ? acc + 1 : acc, 0);
        if (!numCheckedItems) {
            alert("At least one item must be checked.")
            return;
        }

        await fetch('/orders', {
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
                customer_id: user.customer.id,
            })
        })
        .then(async r => {
            await r.json().then(async data1 => {
                if (r.ok) {
                    //console.log('in handlePlaceOrder new order: ', data1);

                    const orderTmp = data1;
                    const checedCartItems = cartItems.filter(cItem => cItem.checked);
                    for (const cItem of checedCartItems) {
                        await fetch('/orderitems', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                quantity: cItem.quantity,
                                price: cItem.item.discount_prices[cItem.item_idx],
                                item_idx: cItem.item_idx, // ??? - what if this item is removed from db?
                                item_id: cItem.item.id,
                                order_id: orderTmp.id,
                            })
                        })
                        .then(async r => {
                            await r.json().then(async data2 => {
                                if (r.ok) {
                                    
                                    const orderItemTmp = data2;
                                    orderItemTmp.item = cItem.item
                                    orderTmp.order_items.push(orderItemTmp);
                                } else {
                                    if (r.status === 401 || r.status === 403) {
                                        console.log(data2);
                                        alert(data2.message);
                                    } else {
                                        console.log("Server Error - Can't add an order item: ", data2);
                                        alert(`Server Error - Can't add an order item: ${data2.message}`);

                                        await fetch(`/orders/${orderTmp.id}`, {
                                            method: 'DELETE',
                                        })
                                        .then(r => {
                                            return;
                                        })
                                    }
                                }
                            })
                        })
                    }

                    // console.log('in handlePlaceOrder, new order: ', orderTmp);
                    onSetOrders([
                        ...orders,
                        orderTmp,
                    ]);

                    deleteCheckedCartItems();
                    navigate('/orders');
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

    function dispSubTotal() {
        return (
            <>
                {
                    selectStatus ? 
                    <>
                        <span style={{fontSize: '1.5em', marginRight: '10px', }}>
                            Subtotal ({cartItems.length} {cartItems.length <= 1 ? 'item' : 'items'}):
                        </span>
                        <span style={{fontSize: '1.5em', fontWeight: 'bold', }}>
                            ${(Math.round(subTotal*100)/100).toLocaleString('en-US', 
                                { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </> : 
                    <span style={{fontSize: '1.5em', marginRight: '10px', }}>No items selected</span>
                }
            </>
        )
    }

    let subTotal = 0, itemTotal = 0;
    const dispCartItems = cartItems.map(cItem => {
        itemTotal = Math.round(cItem.quantity*cItem.item.discount_prices[cItem.item_idx]*100)/100;
        subTotal += cItem.checked ? itemTotal : 0;

        return (
            <div key={cItem.id} style={{display: 'grid', gridTemplateColumns: '100px 200px 1fr 180px', 
                alignItems: 'center'}}>
                <Checkbox checked={Boolean(cItem.checked)} style={{margin: 'auto', }}
                    onChange={() => handleCItemChange({...cItem, checked: !cItem.checked}, onSetCartItems, null)} />
                <div style={{width: '100%', height: '220px', 
                    backgroundImage: `url(${cItem.item.images[0]})`, // image change from card_thumbnail
                    backgroundSize: 'contain', backgroundRepeat: 'no-repeat', 
                    backgroundPosition: 'center', }} 
                    className='link' 
                    onClick={() => handleNavigateItem(cItem.item.id)}
                />
                <div style={{margin: '10px',}} >
                    <p style={{fontSize: '1.4em', marginBottom: '1px', }} 
                        className='link' 
                        onClick={() => handleNavigateItem(cItem.item.id)} >{cItem.item.name}</p>
                    <div>
                        <span style={{fontSize: '1.0em', fontWeight: 'bold', marginRight: '5px', }}>Size:</span>
                        <span style={{fontSize: '1.0em', }}>
                            {
                                `${cItem.item.amounts[cItem.item_idx]} \
                                ${cItem.item.units[cItem.item_idx].charAt(0).toUpperCase() + cItem.item.units[cItem.item_idx].slice(1)} \
                                (Pack of ${cItem.item.packs[cItem.item_idx]})`
                            }
                        </span>
                    </div>
                    <div>
                        {
                            (Object.keys(qInputs).length > 0 && qInputs[cItem.id][0]) ? 
                            <div style={{display: 'inline-block', marginTop: '15px', }}>
                                <Input type='text' size='small' style={{width: '80px'}}
                                    value={qInputs[cItem.id][1]} 
                                    onChange={(e, d) => handleCItemMassQuantityChange(e, d, cItem)} />
                                {
                                    qInputs[cItem.id][1] !== '' ? 
                                    <Button type='button' size='mini' color='yellow' 
                                        style={{color: 'black', borderRadius: '10px', padding: '7px 10px', marginLeft: '5px', }} 
                                        onClick={() => handleCItemChange({
                                            ...cItem,
                                            quantity: parseInt(qInputs[cItem.id][1], 10),
                                        }, onSetCartItems, null)} >
                                        Update
                                    </Button> : 
                                    null
                                }
                            </div> :
                            <Dropdown button style={{fontSize: '1.2em', padding: '7px 10px', margin: '10px 0 0 0', 
                                borderRadius: '10px', background: 'whitesmoke', border: '1px solid lightgray', 
                                boxShadow: '0 2 10 10 red', }}
                                options={quantityOptions} text={`Qty: ${cItem.quantity}`} 
                                value={cItem.quantity} onChange={(e, d) => handleCItemQuantityChange(e, d, cItem)}
                            /> 
                        }
                        <span style={{fontSize: '1.2em', color: 'lightgray', margin: '0 10px',}}>|</span>
                        <span className='link2 link' onClick={() => handleCItemDelete(cItem, onSetCartItems)} >Delete</span>
                    </div>
                </div>
                <div style={{display: 'grid', gridTemplateColumns: '1fr max-content', alignItems: 'center', 
                    margin: '10px', }}>
                    <div></div>
                    <div style={{fontSize: '1.4em', fontWeight: 'bold', marginRight: '10px', }}>
                        ${itemTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                </div>
            </div>
        );
    });

    return (
        <div style={{minWidth: '815px', border: '10px solid whitesmoke', }}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr max-content', alignItems: 'center', 
                padding: '20px', border: '10px solid whitesmoke', }} >
                <div>{dispSubTotal()}</div>
                <Button color='yellow' size='large' 
                    style={{color: 'black', borderRadius: '10px', width: '250px', }}
                    onClick={handlePlaceOrder}>
                    Proceed to checkout
                </Button>
            </div>
            <div style={{border: '10px solid whitesmoke',  }}>
                <div style={{padding: '30px 0 0 20px', fontSize: '2.2em', }}>Shopping Cart</div>
                <div style={{fontSize: '1.0em', padding: '10px 0 0 20px', }}>
                    <span>{selectStatus === 0 ? 'No items selected. ' : null}</span>
                    <span className='link1 link' onClick={handleSelect}>
                        {selectStatus === 2 ? 'Deselect all items' : 'Select all items'}
                    </span>
                </div>
                <div style={{display: 'grid', gridTemplateColumns: '1fr max-content'}}>
                    <div></div>
                    <div style={{marginRight: '20px', }}>Price</div>
                </div>
                <Divider style={{margin: '0 20px 0 20px', }} />
                <div>{dispCartItems}</div>
                <Divider style={{margin: '0 20px 0 20px', }} />
                <div style={{display: 'grid', gridTemplateColumns: '1fr max-content', 
                    alignItems: 'center', }}>
                    <div></div>
                    <div style={{margin: '10px 20px 40px', }}>{dispSubTotal()}</div>
                </div>
            </div>
        </div>
    );
}

export default Cart;