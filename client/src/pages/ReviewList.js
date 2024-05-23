import { useEffect, useState, userEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { applyUTCToOrders } from '../components/common';
import { Icon, Input, Button, Divider, CardGroup, Card, 
    CardContent,} from 'semantic-ui-react';

function ReviewList() {
    const { user, onSetUser, orders, reviews, onSetReviews } = useOutletContext();
    const [ nickname, setNickname ] = useState(null);
    const [ itemsReviewed, setItemsReviewed ] = useState({});
    const navigate = useNavigate()
    
    //RBAC need to be implemented. !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    console.log('in ReviewList, user: ', user, ', orders: ', orders, ', reviews: ', reviews);

    useEffect(() => {
        const itemsReviewedTmp = {};
        reviews.forEach(review => {
            if (!itemsReviewedTmp.hasOwnProperty(review.item_id)) {
                itemsReviewedTmp[review.item_id] = review;
            }
        })
        setItemsReviewed(itemsReviewedTmp);
    }, [reviews]);

    function handleNickNameChange() {
        console.log('In handleNicknameChange');

        fetch(`/customers/${user.customer.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nickname: nickname,
            }),
        })
        .then(r => {
            r.json().then(data => {
                if (r.ok) {
                    onSetUser({
                        ...user,
                        customer: {
                            ...user.customer,
                            nickname: nickname,
                        }
                    })
                    setNickname(null);
                } else {
                    if (r.status === 401 || r.status === 403) {
                        console.log(data);
                        alert(data.message);
                    } else {
                        console.log('Server Error - Updating customer nickname: ', data);
                        alert(`Server Error - Updating customer nickname: ', ${data.message}`);
                    }
                }
            })
        });
    }

    function handleReviewAdd(review) {
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

    function handleReviewChange(review) {
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

    function handleStarClick(itemId, rating) {
        if (itemsReviewed.hasOwnProperty(itemId)) {
            const review = itemsReviewed[itemId];
            handleReviewChange({
                id: review.id,
                rating: rating,
                headline: review.headline,
                content: review.content,
                images: review.images,
                review_done: review.review_done,
                item_id: review.item_Id,
                customer_id: review.customer_id,
            });
        } else {
            handleReviewAdd({
                rating: rating,
                headline: '',
                content: '',
                images: '',
                review_done: 0,
                item_id: itemId,
                customer_id: user.customer.id,
            });
        }
    }

    function dispStars(itemId) {
        const stars = [];
        const rating = (itemsReviewed.hasOwnProperty(itemId) 
                        && !itemsReviewed[itemId].review_done) ? 
                        itemsReviewed[itemId].rating : 0;

        for (let i = 1; i <= 5; i++) {
            stars.push(<img key={i} src={rating >= i ? 'star_filled.png' : 'star_hollow.png'} 
                className='link' 
                style={{width: '35px', height: '35px', }} 
                onClick={() => handleStarClick(itemId, i)} />);        
        }

        return stars;
    }

    function handleNavigateReview(itemId) {
        navigate(`/reviewlist/${itemId}`);
    }

    // Apply UTC time to order dates.
    const ordersInUTC = applyUTCToOrders(orders);
    // Sort orders in descending order
    ordersInUTC.sort((a, b) => b.date - a.date);

    // Get a list of ordered items, that are not reviewed, in descending order.
    const itemsNotReviewed = [];
    const itemsInList = {};
    ordersInUTC.forEach(order => {
        order.order_items.forEach(oi => {
            // oi.review_done must be fixed
            // if (!oi.review_done && !itemsInList.hasOwnProperty(oi.id)) {
            if (!itemsInList.hasOwnProperty(oi.id) && 
                (!itemsReviewed.hasOwnProperty(oi.item_id) || !itemsReviewed[oi.item_id].review_done)) {
                itemsNotReviewed.push(oi);
                itemsInList[oi.id] = oi;
            }
        });
    });
    console.log('itemsNotReviewed: ', itemsNotReviewed);

    const dispReviewCards = itemsNotReviewed.map(oi => {

        return (
            <Card key={oi.id} style={{minWidth: '200px', borderWidth: '0', alignItems: 'center', }}>
                <div className='link' style={{width: '90%', height: '250px', margin: 'auto', 
                    backgroundImage: `url(${oi.item.card_thumbnail})`, 
                    backgroundSize: 'contain', backgroundRepeat: 'no-repeat', 
                    backgroundPosition: 'center', }} 
                    onClick={() => handleNavigateReview(oi.item_id)} />
                {/* <CardContent> */}
                    <div className='link4 link' style={{fontSize: '1.1em', margin: '10px auto 0', }} 
                        onClick={() => handleNavigateReview(oi.item_id)} >
                        {oi.item.name.length <= 20 ? oi.item.name : oi.item.name.slice(0, 20) + '...'}
                    </div>
                    <div style={{margin: '10px auto', }}>
                        {dispStars(oi.item_id)}
                    </div>
                    <div>
                        {
                            itemsReviewed.hasOwnProperty(oi.item_id) ? 
                            <Button type='button' style={{color: 'black', backgroundColor: 'white', 
                                fontSize: '0.8em', padding: '5px 30px', marginBottom: '10px', 
                                border: '1px solid lightgray', borderRadius: '10px', }} 
                                onClick={() => handleNavigateReview(oi.item_id)} >
                                Write a review</Button> : 
                            null
                        }
                    </div>
                {/* </CardContent> */}
            </Card>
        );
    });


    if (!user) return;

    // padding: '15px 150px'
    return (
        <div style={{width: '100%', height: '100%', }}>
            <div style={{width: '100%', height: '60px', padding: '0 140px', backgroundColor: 'lightcyan', fontSize: '1.1em', 
                 display: 'grid', gridTemplateColumns: '1fr', alignItems: 'center', }}>
                <div>
                    <Icon name='user circle outline' size='big' inverted 
                        style={{backgroundColor: 'lightcyan', color: 'lightgray', }} />
                    {
                        nickname !== null ?
                        <>
                            <Input type='text' style={{width: '180px', height: '35px', 
                                border: '1px solid gray', borderRadius: '5px'}}
                                value={nickname} onChange={(e, d) => setNickname(nickname => d.value)}/>
                            <Button color='yellow' 
                                style={{marginLeft: '5px', color: 'black', borderRadius: '10px', }} 
                                onClick={handleNickNameChange}>Save</Button>
                            <Button 
                                style={{marginLeft: '5px', color: 'black', borderRadius: '10px', 
                                backgroundColor: 'white',  border: '1px solid lightgray', }} 
                                onClick={() => setNickname(nickname => null)}>Cancel</Button>
                        </> : 
                        <>
                            <span style={{marginLeft: '3px', }}>{user.customer.nickname}</span>
                            <span className='link1 link' style={{marginLeft: '10px', }} 
                                onClick={() => setNickname(nickname => user.customer.nickname)}>Edit</span>
                        </>
                    }
                </div>
            </div>
            <div style={{padding: '0 140px'}}>
                <div style={{fontSize: '2.0em', margin: '30px 0'}}>
                    Review Your Purchases</div>
                <Divider />
                <CardGroup itemsPerRow={3} style={{marginTop: '5px', }} >
                    {dispReviewCards}
                </CardGroup>
            </div>
        </div>
    );
}

export default ReviewList;
