import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Form, Input, Dropdown, Button, Icon } from 'semantic-ui-react';

function NavBar({ user }) {
    const [ searchKey, setSearchKey ] = useState(null);
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
        </nav>
    )
}

export default NavBar;