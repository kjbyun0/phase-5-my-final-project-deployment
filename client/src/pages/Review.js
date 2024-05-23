import { useState, useEffect } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';


function Review() {
    const { user, reviews, onSetReviews } = useOutletContext();
    const [ review, setReview ] = useState(null);
    const { itemId } = useParams();
    const iid = parseInt(itemId);

    console.log('itemId: ', itemId, 'reviews: ', reviews, 'review: ', review);

    useEffect(() => {
        setReview(reviews.find(r => r.item_id === iid && !r.review_done));
    }, [itemId, reviews]);
    




    return (
        <div>Review Composition Page</div>
    );
}

export default Review;
