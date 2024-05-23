import App from './pages/App';
import Home from './pages/Home';
import SearchResult from './pages/SearchResult'
import Item from './pages/Item';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import ReviewApp from './pages/ReviewApp';
import ReviewList from './pages/ReviewList';
import Review from './pages/Review';
import Signin from './pages/Signin';
import Signout from './pages/Signout';
import Signup from './pages/Signup';

const routes = [
    {
        path: '/', 
        element: <App />,
        // errorElement: ,
        children: [
            {
                path: '/',
                element: <Home />,
            },
            {
                path: '/search',
                element: <SearchResult />,
            },
            {
                path: '/items/:id',
                element: <Item />,
            },
            {
                path: '/cart',
                element: <Cart />,
            },
            {
                path: '/orders',
                element: <Orders />,
            },
            {
                path: '/reviewlist',
                element: <ReviewApp />,
                // errorElement: ,
                children: [
                    {
                        path: '/reviewlist',
                        element: <ReviewList />,
                    },
                    {
                        path: '/reviewlist/:itemId',
                        element: <Review />
                    }
                ],
            },
            {
                path: '/signin',
                element: <Signin />,
            },
            {
                path: '/signout',
                element: <Signout />,
            },
            {
                path: '/signup',
                element: <Signup />,
            },
        ],
    },
]

export default routes;