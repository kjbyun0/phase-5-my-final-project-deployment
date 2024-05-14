import App from './pages/App';
import Home from './pages/Home';
import SearchResult from './pages/SearchResult'
import Item from './pages/Item';
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