import { useState } from 'react';
import { json, useOutletContext } from 'react-router-dom';
import { applyUTCToOrders } from '../components/common';
import { Icon, Input, Button, Divider, CardGroup, Card, 
    CardContent,} from 'semantic-ui-react';

function ReviewList() {
    const { user, onSetUser, orders, reviews } = useOutletContext();
    const [ nickname, setNickname ] = useState(null);
    
    //RBAC need to be implemented. !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    console.log('in ReviewList, user: ', user, ', orders: ', orders, ', reviews: ', reviews);

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

    // Apply UTC time to order dates.
    const ordersInUTC = applyUTCToOrders(orders);
    // Sort orders in descending order
    ordersInUTC.sort((a, b) => b.date - a.date);

    const itemsReviewed = {};
    reviews.forEach(review => {
        if (!itemsReviewed.hasOwnProperty(review.item_id)) {
            itemsReviewed[review.item_id] = review;
        }
    })
    console.log('itemsReviewed: ', itemsReviewed);

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
            <Card key={oi.id} style={{minWidth: '200px', borderWidth: '0', }}>
                <div style={{width: '90%', height: '250px', 
                    backgroundImage: `url(${oi.item.card_thumbnail})`, 
                    backgroundSize: 'contain', backgroundRepeat: 'no-repeat', 
                    backgroundPosition: 'center', }} 
                    className='link' 
                />
                <CardContent>
                    <div style={{fontSize: '1.1em', }}>{oi.item.name.length <= 20 ? oi.item.name : 
                        oi.item.name.slice(0, 20) + '...'}</div>
                    <div>
                        <img src='star_filled.png' />
                        <img src='star_hollow.png' />
                    </div>
                </CardContent>
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
