import { NavLink } from 'react-router-dom';

function NavBar({ user }) {
    return (
        <nav className='nav'>
            {/* The following home link is a temporaray */}
            <NavLink to='/home'>Home</NavLink>
            {
                user ? 
                <NavLink to='/signout' className='nav-link'>Sign Out</NavLink> :
                <NavLink to='/signin' className='nav-link'>Sign in</NavLink>
            }
        </nav>
    )
}

export default NavBar;