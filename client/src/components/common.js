

function setUserInfo(userData, setUser, setCartItems) {
    const { customer, ...userRemaings } = userData;
    const { cart_items, ...customerRemainings } = customer ? customer : {};

    // userData can't be null because fetch operation for user data is succeeded.
    setUser({
        ...userRemaings,
        customer: Object.keys(customerRemainings).length === 0 ? null : customerRemainings,
    });
    setCartItems(cart_items === undefined ? [] : cart_items);
}

function dispPrice(item, idx) {
    // console.log('dispPrice, item: ', item);
    // console.log('dispPrice, idx: ', idx, 'type: ', typeof(idx));
    // console.log('Dollar: ', item.discount_prices[idx]);
    return (
        <>
            <span style={{fontSize: '1em', verticalAlign: '50%', }}>$</span>
            <span style={{fontSize: '2em', }}>
                {Math.floor(item.discount_prices[idx])}
            </span>
            <span style={{fontSize: '1em', verticalAlign: '50%', marginRight: '5px', }}>
                {Math.round((item.discount_prices[idx] - 
                    Math.floor(item.discount_prices[idx]))*100)}
            </span>
            <span style={{fontSize: '1em', verticalAlign: '30%', }}>
                $({Math.round(item.discount_prices[idx] / 
                    (item.amounts[idx] * item.packs[idx])*100)/100} 
                / {item.units[idx]})
            </span>
        </>
    );
}

function dispListPrice(item, idx) {
    return (
        <span><s>${item.prices[idx]}</s></span>
    );
}


function handleCItemDelete(cartItem, cartItems, onSetCartItems) {
    console.log('in handleCItemDelete, item: ', cartItem);

    fetch(`/cartitems/${cartItem.id}`, {
        method: 'DELETE',
    })
    .then(r => {
        console.log('in handleCItemDelete, r: ', r);
        if (r.ok) {
            console.log('in handleCItemChange, cItem is successfully deleted.');
            onSetCartItems(cartItems.filter(cItem => cItem.id !== cartItem.id));
        } else {
            r.json().then(data => {
                if (r.status === 401 || r.status === 403) {
                    console.log(data);
                    alert(data.message);
                } else {
                    console.log("Server Error - Can't delete this item from cart: ", data);
                    alert(`Server Error - Can't delete this item from cart: ${data.message}`);
                }
            });
        }
    });
}

function handleCItemAdd(cartItem, cartItems, onSetCartItems) {
    fetch('/cartitems', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartItem),
    })
    .then(r => {
        r.json().then(data => {
            if (r.ok) {
                console.log('In handleAddToCart fetch(POST), cartItem: ', data);

                onSetCartItems([
                    ...cartItems,
                    data
                ]);

                // navigate to my cart page later...
            } else {
                if (r.status === 401 || r.status === 403) {
                    console.log(data);
                    alert(data.message);
                } else {
                    console.log("Server Error - Can't add an item to cart: ", data);
                    alert(`Server Error - Can't add an item to cart: ${data.message}`);
                }
            }
        });
    });
}

function handleCItemChange(cartItem, cartItems, onSetCartItems) {
    // console.log('in handleCItemCheckChange, e: ', e, ', d: ', d);
    console.log('in handleCItemCheckChange, item: ', cartItem);

    if (cartItem.quantity === 0) {
        handleCItemDelete(cartItem);
        return;
    }

    fetch(`/cartitems/${cartItem.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            checked: cartItem.checked,
            quantity: cartItem.quantity,
        }),
    })
    .then(r => {
        r.json().then(data => {
            if (r.ok) {
                console.log('in handleCItemChange, cItem: ', data);
                onSetCartItems(cartItems.map(cItem => cItem.id === data.id ? data : cItem));
            } else {
                if (r.status === 401 || r.status === 403) {
                    console.log(data);
                    alert(data.message);
                } else {
                    console.log("Server Error - Can't patch this item in cart: ", data);
                    alert(`Server Error - Can't patch this item in cart: ${data.message}`);
                }
            }
        });
    });
}


export { setUserInfo, dispPrice, dispListPrice, handleCItemDelete, handleCItemAdd, handleCItemChange };
