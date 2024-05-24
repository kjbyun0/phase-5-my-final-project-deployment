import { useState, useEffect } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { dispRating, handleReviewDelete } from '../components/common';

import { Divider, Input, TextArea, Button, } from 'semantic-ui-react';


function Review() {
    const { user, reviews, onSetReviews } = useOutletContext();
    const [ itemReview, setItemReview ] = useState({
        item: null, 
        review: null,
    });
    const { itemId } = useParams();
    const iid = parseInt(itemId);

    const [ headline, setHeadline ] = useState('');
    const [ content, setContent ] = useState('');

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
                    <div style={{margin: '10px 0', }}>
                        {dispRating(itemReview.item.id, itemReview.review, user, reviews, onSetReviews)}
                    </div>
                </div>
                {
                    !itemReview.review ? null :
                    <div className='link' style={{color: 'darkcyan', fontSize: '1.1em', marginRight: '10px', }} 
                    onClick={() => handleReviewDelete(itemReview.review, reviews, onSetReviews)}>
                    Clear</div>   
                }
            </div>
            <Divider style={{backgroundColor: 'gainsboro', }} />
            <div>
                <div style={{fontSize: '1.5em', fontWeight: 'bold', }}>Add a headline</div>
                <Input type='text' style={{width: '100%', marginTop: '20px', border: '1px solid gray', 
                    borderRadius: '5px', fontSize: '1.1em', }}
                    placeholder="What's most important to know?" 
                    value={headline} onChange={(e, d) => setHeadline(d.value)} />
            </div>
            <Divider style={{backgroundColor: 'gainsboro', }} />
            <div>
                <div style={{fontSize: '1.5em', fontWeight: 'bold', }}>Add a written review</div>
                <TextArea rows='6' style={{width: '100%', marginTop: '20px', border: '1px solid gray', 
                    borderRadius: '5px', fontSize: '1.1em', }} 
                    value={content} onChange={(e, d) => setContent(d.value)} />
            </div>
            <Divider style={{backgroundColor: 'gainsboro', }} />
            <Button style={{float: 'right', }}></Button>
            
        </div>
    );
}

export default Review;
