import { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { applyUTCToOrder, dispRating, } from '../components/common';
import { Button, Divider, CardGroup, Card, CardContent,} from 'semantic-ui-react';

function ReviewList() {
    const { user, orders, reviews, onSetReviews } = useOutletContext();
    const [ itemsReviewed, setItemsReviewed ] = useState({});
    const navigate = useNavigate()
    
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


    //RBAC need to be implemented. !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


    // function handleReviewAdd(review) {
    //     fetch('/reviews', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(review),
    //     })
    //     .then(r => {
    //         r.json().then(data => {
    //             if (r.ok) {
    //                 onSetReviews([
    //                     ...reviews,
    //                     data
    //                 ]);
    //             } else {
    //                 if (r.status === 401 || r.status === 403) {
    //                     console.log(data);
    //                     alert(data.message);
    //                 } else {
    //                     console.log("Server Error - Can't add this review: ", data);
    //                     alert(`Server Error - Can't add this review: ${data.message}`);
    //                 }
    //             }
    //         });
    //     });
    // }

    // function handleReviewChange(review) {
    //     console.log('review: ', review);

    //     fetch(`/reviews/${review.id}`, {
    //         method: 'PATCH',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(review),
    //     })
    //     .then(r => {
    //         r.json().then(data => {
    //             if (r.ok) {
    //                 onSetReviews(reviews.map(rw => rw.id === data.id ? data : rw));
    //             } else {
    //                 if (r.status === 401 || r.status === 403) {
    //                     console.log(data);
    //                     alert(data.message);
    //                 } else {
    //                     console.log("Server Error - Can't update this review: ", data);
    //                     alert(`Server Error - Can't update this review: ${data.message}`);
    //                 }
    //             }
    //         });
    //     });
    // }

    // function handleStarClick(itemId, review, rating) {
    //     if (review) {
    //         handleReviewChange({
    //             id: review.id,
    //             rating: rating,
    //             headline: review.headline,
    //             content: review.content,
    //             images: review.images,
    //             review_done: review.review_done,
    //             item_id: review.item_Id,
    //             customer_id: review.customer_id,
    //         });
    //     } else {
    //         handleReviewAdd({
    //             rating: rating,
    //             headline: '',
    //             content: '',
    //             images: '',
    //             review_done: 0,
    //             item_id: itemId,
    //             customer_id: user.customer.id,
    //         });
    //     }
    // }

    // function dispRating(itemId, review) {
    //     const stars = [];
    //     const rating = review ? review.rating : 0;

    //     for (let i = 1; i <= 5; i++) {
    //         stars.push(<img key={i} src={rating >= i ? 'star_filled.png' : 'star_hollow.png'} 
    //             className='link'  
    //             style={{width: '40px', height: '40px'}} 
    //             onClick={() => handleStarClick(itemId, review, i)} />);        
    //     }

    //     return stars;
    // }

    function handleNavigateReview(itemId) {
        navigate(`/reviewlist/${itemId}`);
    }

    // Apply UTC time to order dates.
    const ordersLocalTime = orders.map(order => applyUTCToOrder(order));
    // Sort orders in descending order
    ordersLocalTime.sort((a, b) => b.date - a.date);

    // Get a list of ordered items, that are not reviewed, in descending order.
    const itemsNotReviewed = [];
    const itemsInList = {};
    ordersLocalTime.forEach(order => {
        order.order_items.forEach(oi => {
            // oi.review_done must be fixed
            // if (!oi.review_done && !itemsInList.hasOwnProperty(oi.id)) {
            if (!itemsInList.hasOwnProperty(oi.item_id) &&
                (!itemsReviewed.hasOwnProperty(oi.item_id) || !itemsReviewed[oi.item_id].review_done)) {
                itemsNotReviewed.push(oi.item);
                itemsInList[oi.item_id] = oi;   //this value is not used.
            }
        });
    });
    console.log('itemsNotReviewed: ', itemsNotReviewed);

    const dispReviewCards = itemsNotReviewed.map(item => {

        return (
            <Card key={item.id} style={{minWidth: '200px', borderWidth: '0', alignItems: 'center', }}>
                <div className='link' style={{width: '90%', height: '250px', margin: 'auto', 
                    backgroundImage: `url(${item.card_thumbnail})`, 
                    backgroundSize: 'contain', backgroundRepeat: 'no-repeat', 
                    backgroundPosition: 'center', }} 
                    onClick={() => handleNavigateReview(item.id)} />
                {/* <CardContent> */}
                    <div className='link4 link' style={{fontSize: '1.1em', margin: '10px auto 0', }} 
                        onClick={() => handleNavigateReview(item.id)} >
                        {item.name.length <= 20 ? item.name : item.name.slice(0, 20) + '...'}
                    </div>
                    <div style={{margin: '10px auto', }}>
                        {dispRating(item.id, 
                            itemsReviewed.hasOwnProperty(item.id) ? itemsReviewed[item.id] : null,
                            user, reviews, onSetReviews)}
                    </div>
                    <div>
                        {
                            itemsReviewed.hasOwnProperty(item.id) ? 
                            <Button type='button' style={{color: 'black', backgroundColor: 'white', 
                                fontSize: '0.8em', padding: '5px 30px', marginBottom: '10px', 
                                border: '1px solid lightgray', borderRadius: '10px', }} 
                                onClick={() => handleNavigateReview(item.id)} >
                                Write a review</Button> : 
                            null
                        }
                    </div>
                {/* </CardContent> */}
            </Card>
        );
    });

    // padding: '15px 150px'
    return (
        <div style={{width: '100%', height: '100%', padding: '0 140px', }}>
            <div style={{fontSize: '2.0em', margin: '30px 0'}}>
                Review Your Purchases</div>
            <Divider />
            <CardGroup itemsPerRow={3} style={{marginTop: '5px', }} >
                {dispReviewCards}
            </CardGroup>
        </div>
    );
}

export default ReviewList;
