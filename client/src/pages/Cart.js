import { useOutletContext } from 'react-router-dom'; 
import { Button, Divider, } from 'semantic-ui-react';

function Cart() {
    const { user, cartItems } = useOutletContext();

    console.log('In Cart, user: ', user, ', cartItems: ', cartItems);

    return (
        <div style={{with: '100%', height: '100%', border: '10px solid gainsboro', }}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr max-content', alignItems: 'center', 
                padding: '20px', border: '10px solid gainsboro', }} >
                <div>
                    <span style={{fontSize: '1.5em', marginRight: '10px', }}>
                        Subtotal ({cartItems.length} {cartItems.length <= 1 ? 'item' : 'items'}):
                    </span>
                    <span style={{fontSize: '1.5em', fontWeight: 'bold', }}>
                        ${Math.round(100 * cartItems.reduce((accum, cItem) => 
                            accum + (cItem.quantity * cItem.item.discount_prices[cItem.item_idx]), 0)) / 100}
                    </span>
                </div>
                <Button color='yellow' size='large' 
                    style={{color: 'black', borderRadius: '10px', width: '250px', }}>
                    Proceed to checkout
                </Button>
            </div>
            <div style={{border: '10px solid gainsboro',  }}>
                <div style={{padding: '30px 0 0 20px', fontSize: '2.2em', }}>Shopping Cart</div>
                <div className='underscore' style={{fontSize: '1.0em', padding: '10px 0 0 20px', }} >
                    Deselect all items</div>
                <div style={{display: 'grid', gridTemplateColumns: '1fr max-content'}}>
                    <div></div>
                    <div style={{paddingRight: '20px', }}>Price</div>
                </div>
                <Divider style={{margin: '0 20px 0 20px', }} />
                <div>test</div>
            </div>
        </div>
    );
}

export default Cart;