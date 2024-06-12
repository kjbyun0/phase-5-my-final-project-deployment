import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { setUserInfo } from '../components/common';
import { ItemProvider } from '../components/ItemProvider';


function App() {
    const [ user, setUser ] = useState(null);
    const [ cartItems, setCartItems ] = useState([]);
    const [ orders, setOrders ] = useState([]);
    const [ reviews, setReviews ] = useState([]);
    const [ sellerItems, setSellerItems ] = useState([]);

    useEffect(() => {
        fetch('/authenticate')
        .then(r => 
            r.json().then(data => {
                if (r.ok) {
                    console.log('in App, full user data: ', data);
                    setUserInfo(data, setUser, setCartItems, setOrders, setReviews, setSellerItems);
                } else {
                    console.log('In App, error: ', data.message);
                }
            })
        )
    }, []);

    console.log('In App, user: ', user, ', cartItems: ', cartItems, ', orders: ', 
        orders, ', reviews: ', reviews, ', sellerItems: ', sellerItems);

    return (
        <div style={{display: 'grid', gridTemplateRows: 'max-content 1fr', }}>
            {/* <header style={{minWidth: '0', minHeight: '0',}}> */}
            <header>
                <NavBar user={user} cartItems={cartItems} />
            </header>
            {/* <main style={{minWidth: '0', minHeight: '0', }}> */}
            <main>
                <ItemProvider>
                    <Outlet context={{
                        user: user,
                        onSetUser: setUser,
                        cartItems: cartItems,
                        onSetCartItems: setCartItems,
                        orders: orders,
                        onSetOrders: setOrders,
                        reviews: reviews,
                        onSetReviews: setReviews,
                        sellerItems: sellerItems,
                        onSetSellerItems: setSellerItems, 
                    }} />
                </ItemProvider>
            </main>
        </div>
    );
}

export default App;