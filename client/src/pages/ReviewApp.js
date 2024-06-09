import { useState } from 'react';
import { useOutletContext, Outlet, } from 'react-router-dom';
import { Icon, Input, Button, } from 'semantic-ui-react';

function ReviewApp() {
    const { user, onSetUser, orders, reviews, onSetReviews } = useOutletContext();
    const [ nickname, setNickname ] = useState(null);

    //RBAC need to be implemented. !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    if (!user) return;
    

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

    return (
        <div>
            <div style={{height: '60px', padding: '0 140px', backgroundColor: 'lightcyan', fontSize: '1.1em', 
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
            <Outlet context={{
                user: user,
                // onSetUser: onSetUser,
                orders: orders,
                reviews: reviews,
                onSetReviews: onSetReviews,
            }} />
        </div>
    );
}

export default ReviewApp;