

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

export { setUserInfo, dispPrice, dispListPrice };
