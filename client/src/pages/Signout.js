import { useOutletContext, Navigate } from 'react-router-dom';

function Signout() {
    const { onSetUser, onSetCartItems, onSetOrders, onSetReviews, onSetSellerItems } = useOutletContext();

    function handleSignout() {
        fetch('/authenticate', {
            method: 'DELETE',
        })
        .then(r => {
            console.log('In Signout, signout successfully.');
            // ??? - is this right??? I think I need to use setUserInfo(...). Check it out later...
            onSetUser(null);
            onSetCartItems([]);
            onSetOrders([]);
            onSetReviews([]);
            onSetSellerItems([]);
        });
    }

    return (
        <>
            {handleSignout()}
            <Navigate to='/' />
        </>
    );
}

export default Signout;