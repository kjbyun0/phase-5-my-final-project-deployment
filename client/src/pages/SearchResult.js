import { useEffect, useState, useContext } from 'react';
import { useSearchParams, useOutletContext, useNavigate } from 'react-router-dom';
import { dispPrice, dispListPrice, handleCItemChange, handleCItemAdd, handleCItemDelete, } from '../components/common';
import { TestContext } from '../components/contexts';
import { CardGroup, Card, CardContent, CardHeader, Label, Dropdown, 
    Button, } from 'semantic-ui-react';

function SearchResult() {
    const [ searchParams, setSearchParams ] = useSearchParams();
    const { user, cartItems, onSetCartItems, searchItems, onSetSearchItems } = useOutletContext();
    // key: item id and value: cart item of card items. 
    // It is to speed up searching for items in cart among my search result.
    const [ cartItemsDict, setCartItemsDict ] = useState({});
    // key: item id and value: boolean value to indicate if corresponding searched item is added to cart.
    const [ itemInCart, setItemInCart] = useState({});
    const navigate = useNavigate();


    
    // ??? - testcode for useContext... delete it later on...
    const { tContext, setTContext } = useContext(TestContext);
    console.log('tContext: ', tContext);
    setTContext('in SearchResult');
    // ??? - testcode for useContext... delete it later on...



    const [ sort, setSort ] = useState(1);
    const sortOptions = [
        { key: 1, text: 'Featured', value: 1 },
        { key: 2, text: 'Price: Low to Hight', value: 2 },
        { key: 3, text: 'Price: High to Low', value: 3 },
        { key: 4, text: 'Avg. Customer Review', value: 4 },
    ];

    console.log('Before useEffect, searchParams: ', searchParams.get('query'));
    console.log('In SearchResult, searchItems: ', searchItems);
    console.log('In SearchResult, cartItemsDict: ', cartItemsDict);
    console.log('In SearchResult, itemInCart: ', itemInCart);

    useEffect(() => {
        console.log('In useEffect, searchParams: ', searchParams.get('query'));
        fetch(`/search/${searchParams.get('query')}`)
        .then(r => {
            r.json().then(data => {
                if (r.ok) {
                    console.log('In SearchResult, useEffect, searchItems: ', data)
                    onSetSearchItems(data)

                    // Initializing itemInCart state.
                    console.log('initializing');
                    const itemInCartTmp = {};
                    data.forEach(item => itemInCartTmp[item.id] = false);
                    setItemInCart(itemInCartTmp);
                } else
                    console.log('Server error: ', data.message);
                    //add more actions here....
            })
        });
    }, [searchParams]);

    useEffect(() => {
        const cartItemsDictTmp = {};
        cartItems.forEach(cItem => {
            if (cItem.item_idx === cItem.item.default_item_idx)
                cartItemsDictTmp[cItem.item_id] = cItem;
        });
        setCartItemsDict(cartItemsDictTmp);


        // const inCartTmp = {};
        // searchItems.forEach(item => {
        //     if (cartItemsDict.hasOwnProperty(item.id)) {
        //         // inCart.hasOwnProperty(item.id)
        //         // need to update a flag in right way....
        //         inCartTmp[item.id] = [false, cartItemsDict[item.id]];
                
        //     }
        // });
        // setInCart(inCartTmp);
    }, [cartItems]);

    function handleNavigateItem(itemId) {
        navigate(`/items/${itemId}`);
    }

    function handleAddToCart(item) {
        // if user is not signed in or is a seller
        if (!user || !user.customer) {
            navigate('/signin');
        }

        // const cItem = cartItems.find(cItem => 
        //     cItem.item_id === item.id && cItem.item_idx === item.default_item_idx);
        const cItem = cartItemsDict.hasOwnProperty(item.id) ? cartItemsDict[item.id] : null;
        console.log('In handleAddToCart, cItem: ', cItem);
        
        let res = false;
        if (cItem) {
            res = handleCItemChange({
                ...cItem,
                quantity: cItem.quantity + 1,
            }, cartItems, onSetCartItems);
        } else {
            res = handleCItemAdd({
                checked: 1,
                quantity: 1,
                item_idx: item.default_item_idx,
                item_id: item.id,
                customer_id: user.customer.id, //????????
            }, cartItems, onSetCartItems);
        }

        // Showing number of item in the cart is better regardless of 
        // the status of above fetch operation.
        setItemInCart({...itemInCart, [item.id]: true});
    }

    let sortedItems;
    switch(sort) {
        case 2:
            sortedItems = searchItems.toSorted((item1, item2) => item1.discount_prices[item1.default_item_idx] - item2.discount_prices[item2.default_item_idx])
            break;
        case 3:
            sortedItems = searchItems.toSorted((item1, item2) => item2.discount_prices[item2.default_item_idx] - item1.discount_prices[item1.default_item_idx])
            break;
        case 4:
            // need to implement it after reviews feature is implemented. the following code is temporary.
            sortedItems = searchItems;
            break;
        default:
            sortedItems = searchItems;
            break;
    };

    const dispItemCards = sortedItems.map(item => 
        <Card key={item.id} style={{minWidth: '250px', }}>
            <div style={{width: '100%', height: '300px', margin: 'auto', 
                backgroundImage: `url(${item.images[0]})`,     // image change from card_thumbnail
                backgroundSize: 'contain', backgroundRepeat: 'no-repeat', 
                backgroundPosition: 'center', }} 
                className='link' 
                onClick={() => handleNavigateItem(item.id)}
            />
            <CardContent>
                <CardHeader className='link' onClick={() => handleNavigateItem(item.id)}>{item.name}</CardHeader>
                <Label>
                    <span style={{fontSize: '1.2em',  fontWeight: 'bold', }}>
                        {
                            `${item.amounts[item.default_item_idx].toLocaleString('en-US', 
                                { minimumFractionDigits: 2, maximumFractionDigits: 2})} \
                            ${item.units[item.default_item_idx].charAt(0).toUpperCase() + item.units[item.default_item_idx].slice(1)} \
                            (Pack of ${item.packs[item.default_item_idx].toLocaleString('en-US')})`
                        }
                    </span>
                </Label>
                <div className='link' onClick={() => handleNavigateItem(item.id)}>
                    {dispPrice(item, item.default_item_idx)}
                </div>
                <div className='link' onClick={() => handleNavigateItem(item.id)}>
                    {
                        item.prices[item.default_item_idx] !== item.discount_prices[item.default_item_idx] ?
                        <>
                            <span style={{marginRight: '5px', }}>List:</span>
                            {dispListPrice(item, item.default_item_idx)}
                        </> :
                        null
                    }
                </div>
                <Button type='button' size='medium' color='yellow' 
                    style={{color: 'black', borderRadius: '20px', padding: '10px 15px', 
                    marginTop: '10px', }} 
                    onClick={() => handleAddToCart(item)} >Add to cart</Button> 
                {
                    itemInCart[item.id] && cartItemsDict.hasOwnProperty(item.id) ?
                    <div style={{marginTop: '5px', }}>
                        <span style={{fontSize: '0.9em', fontWeight: 'bold'}}>{cartItemsDict[item.id].quantity} in cart</span>
                        <span> - </span>
                        <span className='link3 link' 
                            onClick={() => handleCItemDelete(cartItemsDict[item.id], cartItems, onSetCartItems)}>
                            Remove</span>
                    </div> :
                    null
                }
            </CardContent>
        </Card>
    );


    return (
        <div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', }}>
                <div>
                    <div style={{display: 'inline-block', fontSize: '1.2em', margin: '10px 0 10px 10px', }}>{searchItems.length} results for "</div>
                    <div style={{display: 'inline-block', fontSize: '1.2em', margin: '10px 10px 10px 0', 
                        fontWeight: 'bold', color: 'chocolate'}}>{searchParams.get('query')}"</div>
                </div>
                {/* <Menu compact size='tiny' style={{float: 'inline-end', }}> */}
                <Dropdown options={sortOptions} simple item button 
                    text={`Sort by: ${sortOptions[sort-1].text}`} value={sort} onChange={(e, d) => setSort(d.value)} />
            </div>
            <hr style={{boxShadow: '0 2px 6px 1px lightgray'}}/>
            <div style={{padding: '15px', }}>

                <div style={{fontSize: '1.5em', fontWeight: 'bold', margin: '5px 0', }}>Results</div>
                <div style={{fontSize: '1.1em', }}>Check each product page for other buying options.</div>
                <CardGroup itemsPerRow={5} style={{marginTop: '5px', minWidth: '815px',}}>
                    {dispItemCards}
                </CardGroup>
            </div>
        </div>
    );
}

export default SearchResult;