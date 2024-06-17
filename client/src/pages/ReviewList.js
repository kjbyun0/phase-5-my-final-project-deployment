import { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { applyUTCToOrder, dispRating, } from '../components/common';
import { Button, Divider, CardGroup, Card, CardContent,} from 'semantic-ui-react';

function ReviewList() {
    const { user, orders, reviews, onSetReviews } = useOutletContext();
    const [ itemsReviewed, setItemsReviewed ] = useState({});
    const navigate = useNavigate()
    
    // console.log('in ReviewList, user: ', user, ', orders: ', orders, ', reviews: ', reviews);

    useEffect(() => {
        const itemsReviewedTmp = {};
        reviews.forEach(review => {
            if (!itemsReviewedTmp.hasOwnProperty(review.item_id)) {
                itemsReviewedTmp[review.item_id] = review;
            }
        })
        setItemsReviewed(itemsReviewedTmp);
    }, [reviews]);

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
            if (!itemsInList.hasOwnProperty(oi.item_id) &&
                (!itemsReviewed.hasOwnProperty(oi.item_id) || !itemsReviewed[oi.item_id].review_done) && 
                oi.item.active) {
                itemsNotReviewed.push(oi.item);
                itemsInList[oi.item_id] = oi;
            }
        });
    });
    // console.log('itemsNotReviewed: ', itemsNotReviewed);

    const dispReviewCards = itemsNotReviewed.map(item => {

        return (
            <Card key={item.id} style={{minWidth: '200px', borderWidth: '0', alignItems: 'center', }}>
                <div className='link' style={{width: '90%', height: '250px', margin: 'auto', 
                    backgroundImage: `url(${item.images[0]})`,
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
        <div style={{padding: '0 140px', }}>
            <div style={{fontSize: '2.0em', margin: '30px 0'}}>
                Review Your Purchases</div>
            <Divider />
            <CardGroup itemsPerRow={3} style={{marginTop: '5px', minWidth: '815px', }} >
                {dispReviewCards}
            </CardGroup>
        </div>
    );
}

export default ReviewList;
