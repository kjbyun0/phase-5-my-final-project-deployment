import { Outlet } from 'react-router-dom';

function App() {

    return (
        <div>
            <header>
                {/* NavBar needed. */}
            </header>
            <main>
                <h1>I'm at App.</h1>
                <Outlet />
            </main>
        </div>
    );
}

export default App;