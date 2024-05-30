import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { formatDate, applyUTCToOrder } from '../components/common';
import { Button, Dropdown, } from 'semantic-ui-react';

function OrdersInProgress() {
    const { user, sellerItems, onSetSellerItems, } = useOutletContext();
    const [ filteritemId, setFilterItemId ] = useState(-1);
    const otherItemOptions = sellerItems.map((item, i) => {
        return ({
            key: i,
            text: item.name.slice(0, 20) + '...',
            value: item.id,
        });
    });
    const itemOptions = [{key: -1, text: 'All', value: -1,}, ...otherItemOptions];

    async function handleOrderItem(orderItem, sellerItem) {
        const now = new Date();
        const year = now.getUTCFullYear();
        const month = String(now.getUTCMonth() + 1).padStart(2, '0');
        const day = String(now.getUTCDate()).padStart(2, '0');
        const hours = String(now.getUTCHours()).padStart(2, '0');
        const minutes = String(now.getUTCMinutes()).padStart(2, '0');
        const seconds = String(now.getUTCSeconds()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        // console.log('formattedDate: ', formattedDate);

        let curOrder = null;
        await fetch(`/orders/${orderItem.order_id}`)
        .then(async r => {
            await r.json().then(data => {
                if (r.ok) {
                    curOrder = data;
                } else {
                    if (r.status === 401 || r.status === 403) {
                        console.log(data);
                        alert(data.message);
                    } else {
                        console.log("Server Error - Can't retrieve the order: ", data);
                        alert(`Server Error - Can't retrieve the order: ${data.message}`);
                        return;
                    }
                }
            })
        });
        // console.log('in handleOrderItem, curOrder: ', curOrder);
        
        await fetch(`/orderitems/${orderItem.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                processed_date: formattedDate,
            })
        })
        .then(async r => {
            await r.json().then(async data => {
                if (r.ok) {
                    const si = {
                        ...sellerItem,
                        order_items: sellerItem.order_items.map(oi => 
                            oi.id === data.id ? {...oi, ...data} : oi),
                    }
                    // console.log('in handleOrderItem, sellerItem-after: ', si);
                    onSetSellerItems(sellerItems.map(item => item.id === si.id ? si : item));

                    if (!curOrder) return;
                    const isCompleteOrder = curOrder.order_items.reduce((acc, oi) => {
                        return acc && (oi.id === data.id ? true : !!oi.processed_date);
                    }, true);
                    // console.log('in handleOrderItem, isCompleteOrder: ', isCompleteOrder);

                    if (isCompleteOrder) {
                        await fetch(`/orders/${curOrder.id}`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                closed_date: formattedDate,
                            })
                        })
                        .then(async r => {
                            await r.json().then(data => {
                                if (r.ok) {
                                    // ??? - don't need to update order for seller account. 
                                    // please, check it out again.
                                    // console.log('in handleOrderItem, after setting order closed_date: ', data);
                                } else {
                                    if (r.status === 401 || r.status === 403) {
                                        console.log(data);
                                        alert(data.message);
                                    } else {
                                        console.log("Server Error - Can't update the order: ", data);
                                        alert(`Server Error - Can't update the order: ${data.message}`);
                                        return;
                                    }
                                }
                            });
                        });
                    }
                } else {
                    if (r.status === 401 || r.status === 403) {
                        console.log(data);
                        alert(data.message);
                    } else {
                        console.log("Server Error - Can't update an order item: ", data);
                        alert(`Server Error - Can't update an order item: ${data.message}`);
                    }
                }
            })
        });
    }

    const filteredSellerItems = sellerItems.filter(item => filteritemId === -1 || item.id === filteritemId);

    const dispOrdersInProgress = filteredSellerItems.map(item => {
        const orderItemsLocalTime = item.order_items.map(oi => {
            return {
                ...oi,
                order: applyUTCToOrder(oi.order),
            };
        });
        orderItemsLocalTime.sort((a, b) => b.order.ordered_date - a.order.ordered_date);
        // console.log('orderItemsLocalTime: ', orderItemsLocalTime);

        const dispOrderItemsInProgress = orderItemsLocalTime.map(oi => {
            return (
                oi.processed_date ? null :
                <div key={`${item.id}-${oi.id}`} style={{marginTop: '10px', }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', alignItems: 'center', 
                        backgroundColor: 'whitesmoke', borderRadius: '10px 10px 0 0', 
                        border: '1px solid lightgray', borderBottom: '0px', }}>
                        <div style={{width: '80px', height: '100px', marginLeft: '15px', 
                            backgroundImage: `url(${item.card_thumbnail})`, 
                            backgroundSize: 'contain', backgroundRepeat: 'no-repeat', 
                            backgroundPosition: 'center', }} 
                        />
                        <div style={{margin: '15px', }}>
                            <div style={{fontSize: '1.2em', }}>
                                {item.name}</div>
                            <ul style={{marginLeft: '15px', }}>
                                <li>Ordered Date: {formatDate(oi.order.ordered_date)}</li>
                                <li>Price: ${oi.price.toLocaleString('en-US', 
                                    { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</li>
                            </ul>
                        </div>
                    </div>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr max-content', alignItems: 'center', 
                        borderRadius: '0 0 10px 10px', border: '1px solid lightgray', }}>
                        <ul style={{margin: '7px 0 7px 30px', fontSize: '1.2em', }}>
                            <li style={{margin: '3px 0', }}>
                                <span>Size: </span>
                                <span>
                                    {
                                        `${item.amounts[oi.item_idx].toLocaleString('en-US', 
                                            { minimumFractionDigits: 2, maximumFractionDigits: 2})} \
                                        ${item.units[oi.item_idx].charAt(0).toUpperCase() + 
                                            item.units[oi.item_idx].slice(1)} (Pack of ${item.packs[oi.item_idx].toLocaleString('en-US')})`
                                    }
                                </span>
                            </li>
                            <li style={{margin: '3px 0', }}>Quantity: {oi.quantity.toLocaleString('en-US')}</li>
                            <li style={{margin: '3px 0', }}>Shipping Address: 
                                <div>{oi.order.customer.first_name} {oi.order.customer.last_name}</div>
                                <div>{oi.order.street_1}</div>
                                <div>{oi.order.street_2}</div>
                                <div>{oi.order.city} {oi.order.state} {oi.order.zip_code}</div>
                            </li>
                        </ul>
                        <Button color='yellow' style={{width: '250px', fontSize: '1.1em', borderRadius: '10px', 
                            border: '1px solid lightgray',  alignSelf: 'start', color: 'black', margin: '10px'}}
                            onClick={() => handleOrderItem(oi, item)}>Process Done</Button>
                    </div>
                </div>
            );
        })

        return dispOrderItemsInProgress;
    });

    return (
        <div style={{display: 'grid', gridTemplateColumns: '1fr 800px 1fr', margin: '40px 0'}}>
            <div />
            <div>
                <div style={{display: 'grid', gridTemplateColumns: '1fr max-content', alignItems: 'center',}}>
                    <div style={{fontSize: '2.0em', }}>Orders in progress</div>
                    <div>
                        <div style={{fontSize: '1.1em', marginTop: '20px', }}>
                            <span>{'Filter by '}</span>
                            <Dropdown button style={{fontSize: '1.1em', padding: '7px 10px', margin: '10px 0 0 0', 
                                borderRadius: '10px', background: 'whitesmoke', border: '1px solid lightgray', 
                                boxShadow: '0 2 10 10 red', }}
                                options={itemOptions} 
                                value={filteritemId} onChange={(e, d) => setFilterItemId(d.value)}/>
                        </div>
                    </div>
                </div>
                <div style={{marginTop: '20px', }}>{dispOrdersInProgress}</div>
            </div>
            <div />
        </div>
    );
}

export default OrdersInProgress;