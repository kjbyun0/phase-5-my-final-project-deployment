import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Form, Input, Dropdown, Button, 
    Icon, IconGroup } from 'semantic-ui-react';

function NavBar({ user, cartItems }) {
    const [ searchKey, setSearchKey ] = useState('');
    const navigate = useNavigate();

    function handleSearchInput(e, d) {
        console.log('in handleSearchInput, e: ', e, ', d: ', d);
        setSearchKey(d.value);
    }

    function handleSearchSubmit(e, d) {
        console.log('in handleSearchInputClick, e: ', e, ', d: ', d);
        console.log('searchKey: ', searchKey);

        navigate(`/search?query=${searchKey}`);
    }

    return (
        <nav className='nav'>
            {/* I need to make the with of the search bar fit correctly. */}
            <Form onSubmit={handleSearchSubmit} 
                style={{display: 'flex', alignItems: 'center', }} >
                <Input type='text' action value={searchKey} onChange={handleSearchInput} 
                    style={{width: '80%', }} >
                    <Dropdown />
                    <input />
                    <Button type='submit' icon='search' />
                </Input>
            </Form>
            {
                user ? 
                <NavLink to='/signout' className='nav-link'>Sign Out</NavLink> :
                <NavLink to='/signin' className='nav-link'>Sign in</NavLink>
            }
            {
                user && user.seller ? 
                <NavLink to='/ordersinprogress' className='nav-link'>Orders In Progress</NavLink> : 
                <NavLink to='/orders' className='nav-link'>Orders</NavLink>
            }
            {
                user && user.seller ? 
                null : 
                <NavLink to='/cart' className='nav-link'>
                    <div style={{display: 'grid', gridTemplateColumns: 'max-content max-content'}}>
                        <IconGroup>
                            <Icon name='cart' size='big' />
                            <Icon >
                                <div style={{fontFamily: 'sans-serif', fontSize: '0.8em', 
                                    fontWeight: 'bold', color: 'darkorange', marginLeft: '5px', }}>
                                    {cartItems.length}
                                </div>
                            </Icon>
                        </IconGroup>
                        <div style={{alignSelf: 'end', fontSize: '0.8em', fontWeight: 'bold'}}>Cart</div>
                    </div>
                </NavLink>
            }
        </nav>
    )
}

export default NavBar;