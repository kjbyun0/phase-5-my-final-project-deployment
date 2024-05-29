import React, { useState } from 'react';

const TestContext = React.createContext();

function TestProvider({ children }) {
    const [tContext, setTContext] = useState('init');

    return (
        <TestContext.Provider value={{ tContext, setTContext }}>
            {children}
        </TestContext.Provider>
    );
}

export { TestContext, TestProvider };