import React, { useState } from 'react';

const ItemContext = React.createContext();

function ItemProvider({ children }) {
    const [item, setItem] = useState(null);

    return (
        <ItemContext.Provider value={{ item, setItem }}>
            {children}
        </ItemContext.Provider>
    );
}

export { ItemContext, ItemProvider };