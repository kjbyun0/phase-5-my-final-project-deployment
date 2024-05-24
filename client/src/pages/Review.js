import { useState, useEffect } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { dispRating } from '../components/common';
import { Divider } from 'semantic-ui-react';


function Review() {
    const { user, reviews, onSetReviews } = useOutletContext();
    const [ itemReview, setItemReview ] = useState({
        item: null, 
        review: null,
    });
    const { itemId } = useParams();
    const iid = parseInt(itemId);


    console.log('itemId: ', itemId, 'reviews: ', reviews, 'itemReview: ', itemReview);

    useEffect(() => {
        const reviewTmp = reviews.find(r => r.item_id === iid && !r.review_done);
        if (reviewTmp) {
            setItemReview({
                item: reviewTmp.item,
                review: reviewTmp,
            });
        } else {
            fetch(`/items/${iid}`)
            .then(r => {
                r.json().then(data => {
                    if (r.ok) {
                        setItemReview({
                            item: data,
                            review: null,
                        })
                    } else {
                        if (r.status === 401 || r.status === 403) {
                            console.log(data);
                            alert(data.message);
                        } else {
                            console.log("Server Error - Can't retrieve this item: ", data);
                            alert(`Server Error - Can't retrieve this item: ${data.message}`);
                            // ??? - navigate to a diffierent page?
                        }
                    }
                });
            });
        }
    }, [itemId, reviews]);
    

    //RBAC need to be implemented. !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    if (!itemReview.item) return;
    








    return (
        <div style={{width: '100%', height: '100%', padding: '0 160px', }}>
            <div style={{fontSize: '1.9em', fontWeight: 'bold', marginTop: '40px', }}>
                Create Review</div>
            <div style={{display: 'grid', gridTemplateColumns: 'max-content 1fr', alignItems: 'center', 
                marginTop: '25px', }}>
                <div style={{width: '65px', height: '77px', 
                    backgroundImage: `url(${itemReview.item.card_thumbnail})`, 
                    backgroundSize: 'contain', backgroundRepeat: 'no-repeat', 
                    backgroundPosition: 'center', }} 
                />
                <div style={{marginLeft: '10px', fontSize: '1.1em', }}>
                    {itemReview.item.name.length > 30 ? itemReview.item.name.slice(0, 85) + '...' : 
                    itemReview.item.name}
                </div>
            </div>
            <Divider style={{backgroundColor: 'gainsboro', }} />
            <div style={{display: 'grid', gridTemplateColumns: '1fr max-content', }}>
                <div>
                    <div style={{fontSize: '1.5em', fontWeight: 'bold', }}>Overall rating</div>
                    <div style={{margin: '20px 0', }}>
                        {dispRating(itemReview.item.id, itemReview.review, user, reviews, onSetReviews)}
                    </div>
                </div>
                <div className='link' style={{color: 'darkcyan', fontSize: '1.1em', marginRight: '10px', }} >
                    {itemReview.review && itemReview.review.rating > 0 ? 'Clear' : null}
                </div>
            </div>
            <Divider style={{backgroundColor: 'gainsboro', }} />
        </div>
    );
}

export default Review;
