import { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { applyUTCToOrders } from '../components/common';
import { Dropdown, Button, } from 'semantic-ui-react';

function Orders() {
    const { user, orders } = useOutletContext();
    const [ period, setPeriod ] = useState(2);
    const navigate = useNavigate();

    const periodOptions = [
        {key: 1, text: 'last 30 days', value: 1},
        {key: 2, text: 'past 3 months', value: 2},
        {key: 3, text: `${new Date().getFullYear()}`, value: 3},
        {key: 4, text: `${new Date().getFullYear() - 1}`, value: 4},
        {key: 5, text: `${new Date().getFullYear() - 2}`, value: 5},
    ];

    //RBAC need to be implemented. !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    console.log('in Orders, user: ', user, ', orders: ', orders);

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

    function handleNavigateItem(itemId) {
        navigate(`/items/${itemId}`);
    }

    // apply UTC time to order dates.
    const ordersLocalTime = applyUTCToOrders(orders);
    // console.log('ordersLocalTime: ', ordersLocalTime);

    const thirtyDaysInMillisec = 1000 * 60 * 60 * 24 * 30;
    const ordersInPeriod = ordersLocalTime.filter(order => {
        switch(period) {
            case 1:
                return new Date() - order.date < thirtyDaysInMillisec;
            case 2: 
                const threeMonthsAgo = new Date();
                const threeMonthsAgoTS = threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
                return order.date > threeMonthsAgoTS;
            case 3: 
                return new Date(order.date).getFullYear() === new Date().getFullYear();
            case 4:
                return new Date(order.date).getFullYear() === new Date().getFullYear() - 1;
            case 5:
                return new Date(order.date).getFullYear() === new Date().getFullYear() - 2;
            default:
                return true;
        }
    });

    // Sort ordersInPeriod.
    ordersInPeriod.sort((a, b) => b.date - a.date);

    const dispOrders = ordersInPeriod.map(order => {
        const total = order.order_items.reduce((accum, oi) => accum + (oi.quantity * oi.price), 0);

        const dispOrderedItems = order.order_items.map(oi => {
            return (
                <div key={oi.id} style={{ 
                    display: 'grid', gridTemplateColumns: 'max-content 1fr', alignItems: 'center', 
                    margin: '2px 0'}}>
                    <div>
                        <div style={{width: '125px', height: '150px', 
                            backgroundImage: `url(${oi.item.card_thumbnail})`, 
                            backgroundSize: 'contain', backgroundRepeat: 'no-repeat', 
                            backgroundPosition: 'center', }} 
                            className='link' 
                            onClick={() => handleNavigateItem(oi.item_id)}
                        />
                    </div>
                    <div className='link1 link' style={{fontSize: '1.1em', marginLeft: '15px', }}
                        onClick={() => handleNavigateItem(oi.item_id)}>
                        {oi.item.name}</div>
                </div>
            );
        });

        return (
            <div key={order.id}>
                <div style={{display: 'grid', gridTemplateColumns: 'max-content max-content 1fr', 
                    alignItems: 'center', backgroundColor: 'whitesmoke', 
                    borderRadius: '10px 10px 0 0', border: '1px solid lightgray', borderBottom: '0px', 
                    marginTop: '10px', }}>
                    <div style={{margin: '16px 30px 16px 20px', }}>
                        <div style={{fontSize: '0.9em', }}>ORDER PLACED</div>
                        <div style={{fontSize: '1.1em', }}>{formatDate(order.date)}</div>
                    </div>
                    <div style={{margin: '16px 30px', }}>
                        <div style={{fontSize: '0.9em', }}>TOTAL</div>
                        <div style={{fontSize: '1.1em', }}>${total}</div>
                    </div>
                    <div style={{margin: '16px 30px', }}>
                        <div style={{fontSize: '0.9em', }}>SHIP TO</div>
                        <div style={{fontSize: '1.1em', }}>{`${user.customer.first_name} ${user.customer.last_name}`}</div>
                    </div>
                </div>
                <div style={{display: 'grid', gridTemplateColumns: '1fr max-content',
                    borderRadius: '0 0 10px 10px', border: '1px solid lightgray', }}>
                    <div style={{margin: '5px 20px', }}>
                        {dispOrderedItems}
                    </div>
                    <div style={{margin: '15px 20px', }}>
                        <Button style={{width: '250px', fontSize: '1.1em', borderRadius: '10px', 
                            backgroundColor: 'white', border: '1px solid lightgray',  }} 
                            onClick={() => navigate('/reviewlist')}>
                            Write a product review
                        </Button>
                    </div>
                </div>
            </div>
        );
    });


    // ??? - Why didn't margin work???
    return (
        <div style={{width: '100%', height: '100%', padding: '40px', }} >
            <div style={{fontSize: '2.0em', }}>Your Orders</div>
            <div style={{fontSize: '1.1em', marginTop: '20px', }}>
                <span style={{fontWeight: 'bold', }}>{`${ordersInPeriod.length} order${ordersInPeriod.length <= 1 ? ' ' : 's '}`} </span>
                <span>{'placed in '}</span>
                <Dropdown button style={{fontSize: '1.1em', padding: '7px 10px', margin: '10px 0 0 0', 
                    borderRadius: '10px', background: 'whitesmoke', border: '1px solid lightgray', 
                    boxShadow: '0 2 10 10 red', }}
                    options={periodOptions} 
                    value={period} onChange={(e, d) => setPeriod(d.value)}/>
            </div>
            <div>
                {dispOrders}
            </div>
        </div>
    );
}

export default Orders;
