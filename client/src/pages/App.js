import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { setUserInfo } from '../components/common';
import { TestProvider } from '../components/contexts';


function App() {
    const [ user, setUser ] = useState(null);
    const [ cartItems, setCartItems ] = useState([]);
    const [ orders, setOrders ] = useState([]);
    const [ reviews, setReviews ] = useState([]);

    const [ searchItems, setSearchItems ] = useState([]);

    useEffect(() => {
        fetch('/authenticate')
        .then(r => 
            r.json().then(data => {
                if (r.ok) {
                    console.log('in App, full user data: ', data);
                    setUserInfo(data, setUser, setCartItems, setOrders, setReviews);
                } else {
                    console.log('In App, error: ', data.message);
                }
            })
        )
    }, []);

    console.log('In App, user: ', user, ', cartItems: ', cartItems, ', orders: ', 
        orders, ', reviews: ', reviews);

    return (
        <div style={{display: 'grid', width: '100%', height: '100%', 
            gridTemplateRows: 'max-content 1fr',}}>
            <header style={{minWidth: '0', minHeight: '0',}}>
                <NavBar user={user} cartItems={cartItems} />
            </header>
            <main style={{minWidth: '0', minHeight: '0',}}>
                {/* <h1>I'm at App.</h1> */}
                <TestProvider>
                    <Outlet context={{
                        user: user,
                        onSetUser: setUser,
                        cartItems: cartItems,
                        onSetCartItems: setCartItems,
                        orders: orders,
                        onSetOrders: setOrders,
                        reviews: reviews,
                        onSetReviews: setReviews,
                        searchItems: searchItems,
                        onSetSearchItems: setSearchItems, 
                    }} />
                </TestProvider>
            </main>
        </div>
    );
}

export default App;