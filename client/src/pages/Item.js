import { useEffect, useState, useContext } from 'react';
import { useParams, useOutletContext, useNavigate, } from 'react-router-dom'; 
//bkj - active
import { dispPrice, dispListPrice, handleCItemAdd, handleCItemChange, 
    formatDate, convertUTCDate, handleInactvateItem, dispAvgRating, } from '../components/common';
import { ItemContext } from '../components/ItemProvider';
import { Divider, Table, TableBody, TableRow, TableCell, 
    Image, ButtonGroup, Button, Dropdown, Icon, Progress, } from 'semantic-ui-react';


function Item() {
    const { id } = useParams();
    // const [ item, setItem ] = useState(null);
    const { item, setItem } = useContext(ItemContext);
    const [ activeItemIdx, setActiveItemIdx ] = useState(0);
    const [ activeImageIdx, setActiveImageIdx ] = useState(0);
    const [ quantity, setQuantity ] = useState(1);
    const [ itemReviews, setItemReviews ] = useState([]);

    const [ avgRating, setAvgRating ] = useState(0);
    const [ starCounts, setStarCounts ] = useState([0, 0, 0, 0, 0]);
    
    const { user, cartItems, onSetCartItems, orders, onSetOrders, } = useOutletContext();
    const navigate = useNavigate();
    

    const quantityOptions = [];
    for (let i = 1; i <= 30; i++)
        quantityOptions.push({
            key: i,
            text: `${i}`,
            value: i
        });

    // console.log('In Item, user: ', user, ', item: ', item, ', cartItems: ', cartItems, 
    //     ', orders: ', orders, ', itemReviews: ', itemReviews);
    // console.log('quantity: ', quantity);
    // console.log('avgRating: ', avgRating, ', starCounts: ', starCounts);
    // console.log('id from useParam: ', id);

    useEffect(() => {

        // if the id of the item in ItemContext is same id from useParam, no need to fetch it again.
        if (item && item.id === parseInt(id)) {
            // console.log('Already has the item data in ItemContext');

            if (item.default_item_idx >= 0 && item.default_item_idx < item.prices.length)
                setActiveItemIdx(item.default_item_idx);
        } else {
            fetch(`/items/${id}`)
            .then(r => {
                r.json().then(data => {
                    if (r.ok) {
                        // console.log('In Istem, fetched item: ', data);
                        setItem(data);
                        if (data.default_item_idx >= 0 && data.default_item_idx < data.prices.length)
                            setActiveItemIdx(data.default_item_idx);
                    } else {
                        console.log('Error: ', data.message);
                    }
                });
            })
        }

        fetch(`/reviews/items/${id}`)
        .then(r => {
            r.json().then(data => {
                if (r.ok) {
                    setItemReviews(data);
                    setAvgRating(
                        Math.round(data.reduce((avg, review, i) => 
                            review.review_done ? 
                            avg + (review.rating - avg) / (i+1) :
                            avg
                        , 0) * 10) / 10);
                    const starCountsTmp = [0, 0, 0, 0, 0];
                    data.forEach(review => starCountsTmp[review.rating-1] += 1);
                    setStarCounts(starCountsTmp);
                } else {
                    // only authentication error is possible.
                    console.log(data);
                    alert(data.message);
                }
            });
        });

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
                        item.details_1.map((pair, i) => {
                            const pairArray = pair.split(';-;');

                            return (
                                <TableRow key={i}>
                                    <TableCell style={{width: '40%', fontWeight: 'bold', paddingLeft: '0', }}>{pairArray[0]}</TableCell>
                                    <TableCell style={{width: '60%', paddingLeft: '0', }}>{pairArray[1]}</TableCell>
                                </TableRow>
                            );
                        })
                    }
                </TableBody>
            </Table>
        );
    }

    function dispDetail_2() {
        return (
            <div style={{margin: '15px', fontSize: '1.1em'}}>
                {
                    item.details_2.map((pair, i) => {
                        const pairArray = pair.split(';-;');

                        return (
                            <div key={i} style={{marginBottom: '8px', }}>
                                <span style={{fontWeight: 'bold', }}>{`${pairArray[0]} : `}</span>
                                <span>{pairArray[1]}</span>
                            </div>
                        );
                    })
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
        // console.log('handleThumnailMouseEnter, idx: ', idx);
        setActiveImageIdx(idx);
    }

    function dispThumbnails() {
        return item.images.map((thumbnail, i) =>    // image change from thumbnails
            <Image key={i} className='item-thumbnail' 
                src={thumbnail} alt='product thumbnail' 
                onMouseEnter={() => handleThumnailMouseEnter(i)}
            />
        );
    }

    // function dispAvgRating(starWidth, starHeight) {
    //     const stars = [];
    //     const maxFilled = starWidth, minFilled = 0;

    //     for (let i = 1; i <= 5; i++) {
    //         const width = avgRating >= i ? maxFilled : 
    //             avgRating <= i - 1 ? minFilled :
    //             (avgRating - (i - 1)) * (maxFilled - minFilled);
    //         stars.push(
    //             <div key={i} style={{width: `${starWidth}px`, height: `${starHeight}px`, }}>
    //                 <div style={{position: 'absolute', zIndex: '1', backgroundColor: '#ffbd59', 
    //                     height: `${starHeight}px`, width: `${width}px`, 
    //                     }} />
    //                 <img src='/star_tp.png' alt='transparent star image for rating' 
    //                     style={{position: 'absolute', zIndex: '2', 
    //                         width: `${starWidth}px`, height: `${starHeight}px`, }} />
    //             </div>
    //         );
    //     }

    //     return (
    //         <div style={{display: 'grid', 
    //             gridTemplateColumns: 'max-content max-content max-content max-content max-content', 
    //             alignItems: 'center', }}>
    //             {stars}
    //         </div>
    //     );
    // }

    function dispStarDistribution() {
        return (
            starCounts.map((cnt, i) => {
                const percentage = Math.round((starCounts[4 - i] / itemReviews.length)*100);

                return (
                    <div style={{display: 'grid', gridTemplateColumns: 'max-content max-content', 
                        alignItems: 'center', margin: '15px 0', }}>
                        <div style={{fontSize: '1.1em', }}>{5-i} star</div>
                        {/* <progress value={percentage / 100} 
                            style={{width: '200px', color: 'yellow', }} /> */}
                        <Progress percent={percentage}  progress color='yellow' 
                            style={{width: '200px', border: '1px solid lightgray', 
                                margin: '0 0 0 15px', }}/>
                    </div>
                    // <div>
                    //     <div style={{display: 'inline-block', }}>{5-i} star</div>
                    //     <progress value={percentage / 100} 
                    //         style={{display: 'inline-block', width: '200px', height: '50px', 

                    //         }}/>
                    //     <div style={{display: 'inline-block', }}>{percentage}%</div>
                    // </div>
                );
            })
        );
    }

    function dispReviewRating(review) {
        const stars = [];
    
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <img key={i} src={review.rating >= i ? '/star_filled.png' : '/star_hollow.png'} 
                    style={{width: '17px', height: '17px'}}/>
            );        
        }
    
        return stars;
    }

    function dispReviews() {
        return (
            itemReviews.map(review => 
                review.review_done ? 
                <div key={review.id} style={{margin: '15px 0', fontSize: '1.1em', }}>
                    <div>
                        <Icon name='user circle outline' size='big' 
                            style={{color: 'lightgray', }} />
                        <span>{review.customer.nickname ? 
                            review.customer.nickname : 
                            review.customer.first_name}</span>
                    </div>
                    <div style={{display: 'grid', gridTemplateColumns: 'max-content 1fr', alignItems: 'center', 
                         marginTop: '7px', }}>
                        <div>{dispReviewRating(review)}</div>
                        <div style={{fontWeight: 'bold', marginLeft: '10px', }}>
                            {review.headline}</div>
                    </div>
                    <div>Reviewed on {formatDate(convertUTCDate(review.date))}</div>
                    <div style={{margin: '5px 0', }}>
                        <p>{review.content}</p>
                    </div>
                </div> : 
                null
            )
        );
    }

    function handleAddToCart() {
        if (!item) return;

        // RBAC
        // if user is not signed in or is a seller
        if (!user || !user.customer) {
            alert("Please, signin with your customer account.");
            navigate('/signin');
            return;
        }

        const cItem = cartItems.find(cItem => 
            cItem.item_id === item.id && cItem.item_idx === activeItemIdx);
        
        if (cItem) {
            handleCItemChange({
                ...cItem,
                quantity: cItem.quantity + quantity,
            }, onSetCartItems, () => navigate('/cart'));
        } else {
            handleCItemAdd({
                checked: 1,
                quantity: quantity,
                item_idx: activeItemIdx,
                item_id: item.id,
                customer_id: user.customer.id,
            }, onSetCartItems, () => navigate('/cart'));
        }
    }


    function handlePlaceOrder() {
        if (!item) return;

        // RBAC
        // if user is not signed in or is a seller
        if (!user || !user.customer) {
            alert("Please, signin with your customer account.");
            navigate('/signin');
            return;
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
                customer_id: user.customer.id,
            }),
        })
        .then(r => {
            r.json().then(data1 => {
                if (r.ok) {
                    // console.log('in handlePlaceOrder new order: ', data1);
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
                                // console.log('in handlePlaceOrder new order item: ', data2);
                                const orderItemTmp = data2;
                                orderItemTmp.item = item;
                                orderTmp.order_items.push(orderItemTmp);
                                onSetOrders([
                                    ...orders,
                                    orderTmp
                                ]);

                                navigate('/orders');
                            } else {
                                if (r.status === 401 || r.status === 403) {
                                    console.log(data2); // it won't occur
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

    function removeItemNavigateHome(itm) {
        setItem(null);
        navigate('/');
    }


    if (!item || item.id !== parseInt(id))
        return;

    // maxWidth: '630px', maxHeight: '630px', 
    return (
        <div style={{ padding: '15px', minWidth: '850px', }}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', }} >
                {/* Images */}
                <div>
                    <div className='sticky'>
                        <div style={{display: 'grid', gridTemplateColumns: '10% 90%',
                            width: '100%', height: '100%', margin: '14px', }}>
                            <div style={{padding: '14px 0 0 0', }}>
                                {dispThumbnails()}
                            </div>
                            <div style={{padding: '0', marginLeft: '5px', }}>
                                {
                                    activeImageIdx !== null ? 
                                        <Image style={{objectFit: 'contain', width: '100%', height: '100%', maxWidth: '630px', maxHeight: '630px', margin: '0 auto', }} 
                                            src={item.images[activeImageIdx]} alt='product image'/> : 
                                        null
                                }
                            </div>
                        </div>
                    </div>
                </div>

                {/* Item name and descriptions */}
                <div style={{padding: '15px 10px 10px 30px', }}>
                    <h1 style={{fontWeight: 'normal',}}>{item.name}</h1>
                    <div style={{display: 'grid', gridTemplateColumns: 'max-content max-content 1fr', 
                        alignItems: 'center', }}>
                        <div>{avgRating.toFixed(1)}</div>
                        <div style={{marginLeft: '5px', }}>{dispAvgRating(item, 17, 17)}</div>
                        <a href='#customer_reviews' className='link1 link' style={{marginLeft: '20px', }}>
                            {item.accum_review_cnt.toLocaleString('en-US')}  rating{item.accum_review_cnt > 1 ? 's' : null}
                        </a>
                    </div>

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
                                        `${item.amounts[activeItemIdx].toLocaleString('en-US', 
                                            { minimumFractionDigits: 2, maximumFractionDigits:2 })} \
                                        ${item.units[activeItemIdx].charAt(0).toUpperCase() + item.units[activeItemIdx].slice(1)} \
                                        (Pack of ${item.packs[activeItemIdx].toLocaleString('en-US')})`
                                    }
                                </span>
                            </div>
                            <div>
                                {dispAllSizes()}
                            </div>
                        </div>
                        <div style={{margin: '20px 0 0 20px',}}>
                            {
                                user && user.seller ?
                                <div>
                                    {
                                        user.seller.id === item.seller_id ? 
                                        <div>
                                            <Button basic size='medium'
                                                style={{display: 'block', borderRadius: '20px', width: '220px', margin: '5px', 
                                                    color: 'black', }} onClick={() => navigate(`/additem/${item.id}`)}>
                                                <Icon name='edit outline'/> Edit
                                            </Button>
                                            <Button color='red' size='medium' 
                                                style={{display: 'block', borderRadius: '20px', width: '220px', margin: '5px', 
                                                    color: 'white', }} onClick={() => handleInactvateItem(item, removeItemNavigateHome)} >
                                                <Icon name='trash alternate outline'/> Delete
                                            </Button>
                                                
                                        </div> : 
                                        null
                                    }
                                </div> :
                                <div>
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
                            }
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
            <div>
                <div style={{fontSize: '1.8em', fontWeight: 'bold', marginTop: '20px'}}>Product details</div>
                {dispDetail_2()}
            </div>

            {/* Customer Reviews */}
            <Divider />
            <a id='customer_reviews' />
            <div style={{display: 'grid', gridTemplateColumns: 'max-content 1fr', marginTop: '20px'}}>
                <div>
                    <div style={{fontSize: '1.8em', fontWeight: 'bold'}}>
                        Customer reviews
                    </div>
                    <div style={{display: 'grid', gridTemplateColumns: 'max-content 1fr', 
                        alignItems: 'center', marginTop: '10px', }}>
                        <div>{dispAvgRating(item, 20,20)}</div>
                        <div style={{fontSize: '1.5em', marginLeft: '15px', }}>{avgRating.toFixed(1)} out of 5</div>
                    </div>
                    {/* <div style={{marginTop: '15px', fontSize: '1.1em', }}>
                        {itemReviews.length.toLocaleString('en-US')} rating{itemReviews.length > 1 ? 's' : null}
                    </div> */}
                    <div style={{marginTop: '15px', fontSize: '1.1em', }}>
                        {item.accum_review_cnt.toLocaleString('en-US')} rating{item.accum_review_cnt > 1 ? 's' : null}
                    </div>
                    <div style={{marginTop: '20px', }}>
                        {dispStarDistribution()}
                    </div>
                </div>
                <div style={{marginLeft: '80px', }}>
                    {dispReviews()}
                </div>
            </div>
        </div>
    );
}

export default Item;