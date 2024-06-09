import { useState, useEffect } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { dispRating, handleReviewDelete, handleReviewChange } from '../components/common';
import { Divider, Input, TextArea, Button, Form, Icon } from 'semantic-ui-react';


function Review() {
    const { user, reviews, onSetReviews } = useOutletContext();
    const [ itemReview, setItemReview ] = useState({
        item: null, 
        review: null,
    });
    const [ validateAfterSubmit, setValidateAfterSubmit ] = useState(false);
    const { itemId } = useParams();
    const iid = parseInt(itemId);

    console.log('itemId: ', itemId, 'reviews: ', reviews, 'itemReview: ', itemReview);
    console.log('itemReview, item: ', itemReview.item, ', review: ', itemReview.review);
    // console.log('validateOnChange: ', formik.validateOnChange);

    useEffect(() => {
        const reviewTmp = reviews.find(r => r.item_id === iid && !r.review_done);
        if (reviewTmp) {
            setItemReview({
                item: reviewTmp.item,
                review: reviewTmp,
            });
            formik.setFieldValue('rating', reviewTmp.rating);
        } else {
            fetch(`/items/${iid}`)
            .then(r => {
                r.json().then(data => {
                    if (r.ok) {
                        setItemReview({
                            item: data,
                            review: null,
                        });
                        formik.resetForm();
                        setValidateAfterSubmit(false);
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
    
    const formSchema = yup.object().shape({
        rating: yup.number().required('Please select a star rating')
            .min(1, 'Your rating should be in between 1 and 5.')
            .max(5, 'Your rating should be in between 1 and 5.'),
        headline: yup.string().required('Please enter your headline.'),
        // images: , Please add a video, photo, or a written review.
        content: yup.string().required('Please add a written review.'),
    });

    const formik = useFormik({
        initialValues: {
            rating: null,
            headline: '',
            // images: ''
            content: '',
        },
        validationSchema: formSchema,
        validateOnChange: validateAfterSubmit,
        validateOnBlur: false,
        onSubmit: values => {
            // console.log('formik submit called.')
            // Since rating must be updated and adding a rate creates a review, 
            // submit is always a patch operation.
            handleReviewChange({
                id: itemReview.review.id,
                rating: formik.values.rating,
                headline: formik.values.headline,
                content: formik.values.content,
                // images: formik.values.images,
                review_done: 1,
            }, reviews, onSetReviews);
        },
    });
    
    //RBAC need to be implemented. !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    if (!itemReview.item) return;


    return (
        <div style={{padding: '0 160px', }}>
            <div style={{fontSize: '1.9em', fontWeight: 'bold', marginTop: '40px', }}>
                Create Review</div>
            <div style={{display: 'grid', gridTemplateColumns: 'max-content 1fr', alignItems: 'center', 
                marginTop: '25px', }}>
                <div style={{width: '65px', height: '77px', 
                    backgroundImage: `url(${itemReview.item.images[0]})`,  // image change from card_thumbnail
                    backgroundSize: 'contain', backgroundRepeat: 'no-repeat', 
                    backgroundPosition: 'center', }} 
                />
                <div style={{marginLeft: '10px', fontSize: '1.1em', }}>
                    {itemReview.item.name.length > 30 ? itemReview.item.name.slice(0, 85) + '...' : 
                    itemReview.item.name}
                </div>
            </div>
            <Divider style={{backgroundColor: 'gainsboro', }} />

            <Form onSubmit={formik.handleSubmit}>
                <div style={{display: 'grid', gridTemplateColumns: '1fr max-content', }}>
                    <div>
                        <div style={{fontSize: '1.5em', fontWeight: 'bold', }}>Overall rating</div>
                        <div style={{margin: '10px 0', }}>
                            {dispRating(itemReview.item.id, itemReview.review, user, reviews, onSetReviews)}
                        </div>
                        {
                            formik.errors.rating ?
                            <div style={{marginTop: '15px', color: 'crimson', fontSize: '1.1em', }}>
                                <Icon name='exclamation circle' size='large' />
                                {formik.errors.rating}</div> : 
                            null
                        }
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
                    <Input id='headline' name='headline' type='text' style={{width: '100%', marginTop: '20px', border: '1px solid gray', 
                        borderRadius: '5px', fontSize: '1.1em', }}
                        placeholder="What's most important to know?" 
                        value={formik.values.headline} onChange={formik.handleChange} />
                    {
                        formik.errors.headline ? 
                        <div style={{marginTop: '15px', color: 'crimson', fontSize: '1.1em', }}>
                            <Icon name='exclamation circle' size='large' />
                            {formik.errors.headline}</div> : 
                        null
                    }
                </div>
                <Divider style={{backgroundColor: 'gainsboro', }} />
                <div>
                    <div style={{fontSize: '1.5em', fontWeight: 'bold', }}>Add a written review</div>
                    <TextArea  id='content' name='content' rows='6' style={{width: '100%', marginTop: '20px', border: '1px solid gray', 
                        borderRadius: '5px', fontSize: '1.1em', }} 
                        placeholder="What did you like or dislike? What did you use this product for?"
                        value={formik.values.content} onChange={formik.handleChange} />
                    {
                        formik.errors.content ?
                        <div style={{marginTop: '15px', color: 'crimson', fontSize: '1.1em', }}>
                            <Icon name='exclamation circle' size='large' />
                            {formik.errors.content}</div> : 
                        null
                    }
                    
                </div>
                <Divider style={{backgroundColor: 'gainsboro', }} />
                <Button type='submit' color='yellow'
                    style={{float: 'right', color: 'black', borderRadius: '10px', }} 
                    onClick={() => setValidateAfterSubmit(validateAfterSubmit => true)} >
                    Submit</Button>
            </Form>

        </div>
    );
}

export default Review;
