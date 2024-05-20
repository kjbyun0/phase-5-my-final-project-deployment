import { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom'; 
import { handleCItemDelete, handleCItemChange } from '../components/common';
import { Button, Divider, Checkbox, Dropdown, Input, } from 'semantic-ui-react';

function Cart() {
    const { user, cartItems, onSetCartItems } = useOutletContext();
    //0: Nothing is selected, 1: Not all items selected, 2: all items selected
    const [ selectStatus, setSelectStatus ] = useState(2);
    const navigate = useNavigate();

    const [ qInputs, setQInputs ] = useState({});

    useEffect(() => {
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

    //RBAC need to be implemented.

    console.log('In Cart, user: ', user, ', cartItems: ', cartItems);
    console.log('In Cart, qInputs: ', qInputs);

    // function handleCItemChange(cItem) {
    //     // console.log('in handleCItemCheckChange, e: ', e, ', d: ', d);
    //     console.log('in handleCItemCheckChange, item: ', item);

    //     if (item.quantity === 0) {
    //         handleCItemDelete(item);
    //         return;
    //     }

    //     fetch(`/cartitems/${item.id}`, {
    //         method: 'PATCH',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //             checked: item.checked,
    //             quantity: item.quantity,
    //         }),
    //     })
    //     .then(r => {
    //         r.json().then(data => {
    //             if (r.ok) {
    //                 console.log('in handleCItemChange, cItem: ', data);
    //                 onSetCartItems(cartItems.map(cItem => cItem.id === data.id ? data : cItem));
    //             } else {
    //                 if (r.status === 401 || r.status === 403) {
    //                     console.log(data);
    //                     alert(data.message);
    //                 } else {
    //                     console.log("Server Error - Can't patch this item in cart: ", data);
    //                     alert(`Server Error - Can't patch this item in cart: ${data.message}`);
    //                 }
    //             }
    //         });
    //     });
    // }

    // function handleCItemDelete(item) {
    //     console.log('in handleCItemDelete, item: ', item);

    //     fetch(`/cartitems/${item.id}`, {
    //         method: 'DELETE',
    //     })
    //     .then(r => {
    //         console.log('in handleCItemDelete, r: ', r);
    //         if (r.ok) {
    //             console.log('in handleCItemChange, cItem is successfully deleted.');
    //             onSetCartItems(cartItems.filter(cItem => cItem.id !== item.id));
    //         } else {
    //             r.json().then(data => {
    //                 if (r.status === 401 || r.status === 403) {
    //                     console.log(data);
    //                     alert(data.message);
    //                 } else {
    //                     console.log("Server Error - Can't delete this item from cart: ", data);
    //                     alert(`Server Error - Can't delete this item from cart: ${data.message}`);
    //                 }
    //             });
    //         }
    //     });
    // }

    function handleNavigateItem(itemId) {
        navigate(`/items/${itemId}`);
    }

    function handleCItemMassQuantityChange(e, d, cItem) {
        console.log('in handleDropdown, e: ', e, ', d: ', d, ', cItem: ', cItem);

        if (/^([1-9]{1}[0-9]{0,2})|([0]{0,1})$/.test(d.value)) {
            const qInput = qInputs[cItem.id];
            qInput[1] = d.value;
            setQInputs({...qInputs, [cItem.id]: qInput,});            
        }
    }

    function handleCItemQuantityChange(e, d, cItem) {
        console.log('in handleDropdown, e: ', e, ', d: ', d, ', cItem: ', cItem);

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
            }, cartItems, onSetCartItems);
    }

    async function handleSelect() {
        for (const cartItem of cartItems) {
            // console.log('in handleSelect, cartItem will be: ', {
            //     ...cartItem,
            //     checked: selectStatus === 2 ? 0 : 1,
            // });

            if ((selectStatus === 2 && cartItem.checked) || 
                (selectStatus !== 2 && !cartItem.checked)) {
                await handleCItemChange({
                    ...cartItem,
                    checked: selectStatus === 2 ? 0 : 1,
                }, cartItems, onSetCartItems);
            }
        }
    }

    function dispSubTotal() {
        return (
            <>
                <span style={{fontSize: '1.5em', marginRight: '10px', }}>
                    Subtotal ({cartItems.length} {cartItems.length <= 1 ? 'item' : 'items'}):
                </span>
                {/* <span style={{fontSize: '1.5em', fontWeight: 'bold', }}>
                    ${Math.round(100 * cartItems.reduce((accum, cItem) => 
                        accum + (cItem.quantity * cItem.item.discount_prices[cItem.item_idx]), 0)) / 100}
                </span> */}
                <span style={{fontSize: '1.5em', fontWeight: 'bold', }}>
                    ${Math.round(subTotal*100)/100}
                </span>
            </>
        )
    }

    let subTotal = 0, itemTotal = 0;
    const dispCartItems = cartItems.map(cItem => {
        itemTotal = Math.round(cItem.quantity*cItem.item.discount_prices[cItem.item_idx]*100)/100;
        subTotal += itemTotal;

        return (
            <div key={cItem.id} style={{display: 'grid', gridTemplateColumns: '100px 200px 1fr 180px', 
                alignItems: 'center'}}>
                <Checkbox checked={Boolean(cItem.checked)} style={{margin: 'auto', }}
                    onChange={() => handleCItemChange({...cItem, checked: !cItem.checked}, cartItems, onSetCartItems)} />
                <div style={{width: '100%', height: '220px', 
                    backgroundImage: `url(${cItem.item.card_thumbnail})`, 
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
                                        }, cartItems, onSetCartItems)} >
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
                        <span className='link2 link' onClick={() => handleCItemDelete(cItem, cartItems, onSetCartItems)} >Delete</span>
                    </div>
                </div>
                <div style={{display: 'grid', gridTemplateColumns: '1fr max-content', alignItems: 'center', 
                    margin: '10px', }}>
                    <div></div>
                    <div style={{fontSize: '1.4em', fontWeight: 'bold', marginRight: '10px', }}>
                        ${itemTotal}
                    </div>
                </div>
            </div>
        );
    });

    return (
        <div style={{with: '100%', height: '100%', border: '10px solid gainsboro', }}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr max-content', alignItems: 'center', 
                padding: '20px', border: '10px solid gainsboro', }} >
                <div>{dispSubTotal()}</div>
                <Button color='yellow' size='large' 
                    style={{color: 'black', borderRadius: '10px', width: '250px', }}>
                    Proceed to checkout
                </Button>
            </div>
            <div style={{border: '10px solid gainsboro',  }}>
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