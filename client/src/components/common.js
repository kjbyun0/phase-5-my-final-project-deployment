

function setUserInfo(userData, setUser, setCartItems, setOrders, setReviews, setSellerItems) {
    const { customer, seller, ...userRemaings } = userData;
    const { cart_items, orders, reviews, ...customerRemainings } = customer ? customer : {};
    const { items, ...sellerRemainings } = seller ? seller : {};

    // userData can't be null because fetch operation for user data is succeeded.
    setUser({
        ...userRemaings,
        customer: Object.keys(customerRemainings).length === 0 ? null : customerRemainings,
        seller: Object.keys(sellerRemainings).length === 0 ? null : sellerRemainings,
    });
    setCartItems(cart_items === undefined ? [] : cart_items);
    setOrders(orders === undefined ? [] : orders);
    setReviews(reviews === undefined ? [] : reviews);
    setSellerItems(items === undefined ? [] : items);
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


async function handleCItemDelete(cartItem, cartItems, onSetCartItems) {
    console.log('in handleCItemDelete, item: ', cartItem);
    if (!cartItem) return;

    await fetch(`/cartitems/${cartItem.id}`, {
        method: 'DELETE',
    })
    .then(async r => {
        console.log('in handleCItemDelete, r: ', r);
        if (r.ok) {
            console.log('in handleCItemChange, cItem is successfully deleted.');
            onSetCartItems(cartItems => cartItems.filter(cItem => cItem.id !== cartItem.id));
        } else {
            await r.json().then(data => {
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

async function handleCItemAdd(cartItem, cartItems, onSetCartItems) {
    await fetch('/cartitems', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartItem),
    })
    .then(async r => {
        await r.json().then(data => {
            if (r.ok) {
                console.log('In handleAddToCart fetch(POST), cartItem: ', data);
                onSetCartItems(cartItems => [
                    ...cartItems,
                    data
                ]);
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

async function handleCItemChange(cartItem, cartItems, onSetCartItems) {
    console.log('in handleCItemChange, item: ', cartItem);

    if (cartItem.quantity === 0) {
        handleCItemDelete(cartItem);
        return;
    }

    await fetch(`/cartitems/${cartItem.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            checked: cartItem.checked,
            quantity: cartItem.quantity,
        }),
    })
    .then(async r => {
        await r.json().then(data => {
            if (r.ok) {
                console.log('in handleCItemChange, cItem: ', data);
                onSetCartItems(cartItems => cartItems.map(cItem => cItem.id === data.id ? data : cItem));
            } else {
                if (r.status === 401 || r.status === 403) {
                    console.log(data);
                    alert(data.message);
                } else {
                    console.log("Server Error - Can't update this item in cart: ", data);
                    alert(`Server Error - Can't update this item in cart: ${data.message}`);
                }
            }
        });
    });
}

function formatDate(date) {
    let month;
    switch(date.getMonth()) {
        case 0:
            month = 'January';
            break;
        case 1:
            month = 'February';
            break;
        case 2:
            month = 'March';
            break;
        case 3:
            month = 'April';
            break;
        case 4:
            month = 'May';
            break;
        case 5:
            month = 'June';
            break;
        case 6:
            month = 'July';
            break;
        case 7:
            month = 'August';
            break;
        case 8:
            month = 'September';
            break;
        case 9:
            month = 'October';
            break;
        case 10:
            month = 'November';
            break;
        case 11:
            month = 'December';
            break;
        default:
            month = 'January';
            break;
    }

    return month + ' ' + date.getDate() + ', ' + date.getFullYear();
}

function convertUTCDate(utcDate) {
    return new Date(Date.UTC(
        utcDate.slice(0, 4),
        utcDate.slice(5, 7) - 1,
        utcDate.slice(8, 10),
        utcDate.slice(11, 13), 
        utcDate.slice(14, 16), 
        utcDate.slice(17)
    ));
}

function applyUTCToOrders(orders) {
    return orders.map(order => {
        return (
            {
                ...order,
                ordered_date: convertUTCDate(order.ordered_date),
                closed_date: order.closed_date ? convertUTCDate(order.ordered_date) : null,
            }
        );
    });
}


/////////////////////////////////////////////////////////////////////////////////////////////////

function handleReviewDelete(review, reviews, onSetReviews) {
    if (!review) return;

    fetch(`/reviews/${review.id}`, {
        method: 'DELETE',
    })
    .then(r => {
        if (r.ok) {
            onSetReviews(reviews.filter(rw => rw.id !== review.id));
        } else {
            r.json().then(data => {
                if (r.status === 401 || r.status === 403) {
                    console.log(data);
                    alert(data.message);
                } else {
                    console.log("Server Error - Can't delete this review: ", data);
                    alert(`Server Error - Can't delete this review: ${data.message}`);
                }
            });
        }
    });
}

function handleReviewAdd(review, reviews, onSetReviews) {
    fetch('/reviews', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(review),
    })
    .then(r => {
        r.json().then(data => {
            if (r.ok) {
                onSetReviews([
                    ...reviews,
                    data
                ]);
            } else {
                if (r.status === 401 || r.status === 403) {
                    console.log(data);
                    alert(data.message);
                } else {
                    console.log("Server Error - Can't add this review: ", data);
                    alert(`Server Error - Can't add this review: ${data.message}`);
                }
            }
        });
    });
}

function handleReviewChange(review, reviews, onSetReviews) {
    console.log('review: ', review);

    fetch(`/reviews/${review.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(review),
    })
    .then(r => {
        r.json().then(data => {
            if (r.ok) {
                onSetReviews(reviews.map(rw => rw.id === data.id ? data : rw));
            } else {
                if (r.status === 401 || r.status === 403) {
                    console.log(data);
                    alert(data.message);
                } else {
                    console.log("Server Error - Can't update this review: ", data);
                    alert(`Server Error - Can't update this review: ${data.message}`);
                }
            }
        });
    });
}

function handleStarClick(itemId, review, rating, user, reviews, onSetReviews) {
    if (review) {
        handleReviewChange({
            id: review.id,
            rating: rating,
            headline: review.headline,
            content: review.content,
            images: review.images,
            review_done: review.review_done,
            item_id: review.item_Id,
            customer_id: review.customer_id,
        }, reviews, onSetReviews);
    } else {
        handleReviewAdd({
            rating: rating,
            headline: '',
            content: '',
            images: '',
            review_done: 0,
            item_id: itemId,
            customer_id: user.customer.id,
        }, reviews, onSetReviews);
    }
}

function dispRating(itemId, review, user, reviews, onSetReviews) {
    const stars = [];
    const rating = review ? review.rating : 0;

    for (let i = 1; i <= 5; i++) {
        stars.push(<img key={i} src={rating >= i ? '/star_filled.png' : '/star_hollow.png'} 
            className='link'  
            style={{width: '40px', height: '40px'}} 
            onClick={() => handleStarClick(itemId, review, i, user, reviews, onSetReviews)} />);        
    }

    return stars;
}

/////////////////////////////////////////////////////////////////////////////////////////////////

export { setUserInfo, dispPrice, dispListPrice, 
    handleCItemDelete, handleCItemAdd, handleCItemChange, 
    formatDate, convertUTCDate, applyUTCToOrders, 
    handleReviewDelete, handleReviewAdd, handleReviewChange, handleStarClick, dispRating };
