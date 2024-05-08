import { useOutletContext, Navigate } from 'react-router-dom';

function Signout() {
    const { onSetUser } = useOutletContext();

    function handleSignout() {
        fetch('/authenticate', {
            method: 'DELETE',
        })
        .then(r => {
            console.log('In Signout, signout successfully.');
            onSetUser(null);
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