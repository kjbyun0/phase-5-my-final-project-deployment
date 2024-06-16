import { useEffect, useState, useContext } from 'react';
import { useSearchParams, useOutletContext, useNavigate } from 'react-router-dom';
import { dispPrice, dispListPrice, handleCItemChange, handleCItemAdd, handleCItemDelete, 
    handleDeleteItem, dispAvgRating, } from '../components/common';
import { ItemContext } from '../components/ItemProvider';
import { CardGroup, Card, CardContent, CardHeader, Label, Dropdown, 
    Button, } from 'semantic-ui-react';

function SearchResult() {
    const [ searchParams, setSearchParams ] = useSearchParams();
    const { user, cartItems, onSetCartItems } = useOutletContext();
    const [ searchItems, setSearchItems ] = useState([]);
    // key: item id and value: cart item of card items. 
    // It is to speed up searching for items in cart among my search result.
    const [ cartItemsDict, setCartItemsDict ] = useState({});
    // key: item id and value: boolean value to indicate if corresponding searched item is added to cart.
    const [ itemsInCart, setItemsInCart] = useState({});
    const navigate = useNavigate();
    const { item, setItem } = useContext(ItemContext);


    const [ sort, setSort ] = useState(1);
    const sortOptions = [
        { key: 1, text: 'Featured', value: 1 },
        { key: 2, text: 'Price: Low to Hight', value: 2 },
        { key: 3, text: 'Price: High to Low', value: 3 },
        { key: 4, text: 'Avg. Customer Review', value: 4 },
        { key: 5, text: 'Best Sellers', value: 5 },
    ];

    // console.log('Before useEffect, searchParams: ', searchParams.get('query'));
    console.log('In SearchResult, searchItems: ', searchItems);
    // console.log('In SearchResult, cartItemsDict: ', cartItemsDict);
    console.log('In SearchResult, itemsInCart: ', itemsInCart);

    useEffect(() => {
        const key = searchParams.get('query');
        console.log('In useEffect, searchParams: ', key);

        if (!key) {
            navigate('/');
            return;
        }

        fetch(`/search/${key}`)
        .then(r => {
            r.json().then(data => {
                if (r.ok) {
                    console.log('In SearchResult, useEffect, searchItems: ', data)
                    setSearchItems(data)

                    // Initializing itemsInCart state.
                    const itemInCartTmp = {};
                    data.forEach(item => itemInCartTmp[item.id] = false);
                    setItemsInCart(itemInCartTmp);
                } else {
                    console.log('Server error: ', data);
                    alert(`Server Error: ${data.message}`);
                    navigate('/');
                }
            });
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


    function handleAddToCart(itm) {
        // RBAC
        // if user is not signed in or is a seller
        if (!user || !user.customer) {
            alert("Please, signin with your customer account.");
            navigate('/signin');
            return;
        }

        // const cItem = cartItems.find(cItem => 
        //     cItem.item_id === item.id && cItem.item_idx === item.default_item_idx);
        const cItem = cartItemsDict.hasOwnProperty(itm.id) ? cartItemsDict[itm.id] : null;
        console.log('In handleAddToCart, cItem: ', cItem);
        
        let res = false;
        if (cItem) {
            res = handleCItemChange({
                ...cItem,
                quantity: cItem.quantity + 1,
            }, onSetCartItems, null);
        } else {
            res = handleCItemAdd({
                checked: 1,
                quantity: 1,
                item_idx: itm.default_item_idx,
                item_id: itm.id,
                customer_id: user.customer.id, //????????
            }, onSetCartItems, null);
        }

        // Showing number of item in the cart is better regardless of 
        // the status of above fetch operation.
        setItemsInCart({...itemsInCart, [itm.id]: true});
    }

    function handleNavigateItem(itm) {
        setItem(itm);
        navigate(`/items/${itm.id}`);
    }


    function removeDeletedItem(itm) {
        setSearchItems(searchItems => searchItems.filter(sitm => sitm.id !== itm.id));

        const itemsInCartTmp = {...itemsInCart};
        delete itemsInCartTmp[itm.id];
        setItemsInCart(itemsInCart => itemsInCartTmp);
    }

    
    let sortedItems;
    switch(sort) {
        case 2:
            sortedItems = searchItems.toSorted((itm1, itm2) => itm1.discount_prices[itm1.default_item_idx] - itm2.discount_prices[itm2.default_item_idx]);
            break;
        case 3:
            sortedItems = searchItems.toSorted((itm1, itm2) => itm2.discount_prices[itm2.default_item_idx] - itm1.discount_prices[itm1.default_item_idx]);
            break;
        case 4:
            sortedItems = searchItems.toSorted((itm1, itm2) => itm2.avg_review_rating - itm1.avg_review_rating);
            break;
        case 5: 
            sortedItems = searchItems.toSorted((itm1, itm2) => itm2.accum_sales_cnt - itm1.accum_sales_cnt);
            break;
        default:
            sortedItems = searchItems;
            break;
    };

    const dispItemCards = sortedItems.map(itm => 
        <Card key={itm.id} style={{minWidth: '250px', }}>
            <div style={{width: '100%', height: '300px', margin: 'auto', 
                backgroundImage: `url(${itm.images[0]})`,     // image change from card_thumbnail
                backgroundSize: 'contain', backgroundRepeat: 'no-repeat', 
                backgroundPosition: 'center', }} 
                className='link' 
                onClick={() => handleNavigateItem(itm)}
            />
            <CardContent>
                <CardHeader className='link' onClick={() => handleNavigateItem(itm)}>{itm.name}</CardHeader>
                <Label>
                    <span style={{fontSize: '1.2em',  fontWeight: 'bold', }}>
                        {
                            `${itm.amounts[itm.default_item_idx].toLocaleString('en-US', 
                                { minimumFractionDigits: 2, maximumFractionDigits: 2})} \
                            ${itm.units[itm.default_item_idx].charAt(0).toUpperCase() + itm.units[itm.default_item_idx].slice(1)} \
                            (Pack of ${itm.packs[itm.default_item_idx].toLocaleString('en-US')})`
                        }
                    </span>
                </Label>
                <div style={{display: 'grid', gridTemplateColumns: 'max-content max-content', alignItems: 'center', 
                    marginTop: '5px', }}>
                    <div style={{marginLeft: '5px', }}>{dispAvgRating(itm, 17, 17)}</div>
                    <div style={{marginLeft: '10px', }}>{itm.accum_review_cnt.toLocaleString('en-US')}  rating{itm.accum_review_cnt > 1 ? 's' : null}</div>
                </div>

                <div className='link' style={{marginTop: '15px', }} onClick={() => handleNavigateItem(itm)}>
                    {dispPrice(itm, itm.default_item_idx)}
                </div>
                <div className='link' onClick={() => handleNavigateItem(itm)}>
                    {
                        itm.prices[itm.default_item_idx] !== itm.discount_prices[itm.default_item_idx] ?
                        <>
                            <span style={{marginRight: '5px', }}>List:</span>
                            {dispListPrice(itm, itm.default_item_idx)}
                        </> :
                        null
                    }
                </div>
                {
                    user && user.seller ? 
                    <div>
                        {
                            user.seller.id === itm.seller_id ? 
                            <div style={{marginTop: '10px', }}>
                                <Button basic icon='edit outline' 
                                    onClick={() => { setItem(itm); navigate(`/additem/${itm.id}`);}} />
                                <Button color='red' icon='trash alternate outline' 
                                    onClick={() => handleDeleteItem(itm, removeDeletedItem)} />
                            </div> : 
                            null
                        }
                     </div> : 
                    <div>
                        <Button type='button' size='medium' color='yellow' 
                            style={{color: 'black', borderRadius: '20px', padding: '10px 15px', 
                            marginTop: '10px', }} 
                            onClick={() => handleAddToCart(itm)} >Add to cart</Button> 
                        {
                            itemsInCart[itm.id] && cartItemsDict.hasOwnProperty(itm.id) ?
                            <div style={{marginTop: '5px', }}>
                                <span style={{fontSize: '0.9em', fontWeight: 'bold'}}>{cartItemsDict[itm.id].quantity} in cart</span>
                                <span> - </span>
                                <span className='link3 link' 
                                    onClick={() => handleCItemDelete(cartItemsDict[itm.id], onSetCartItems)}>
                                    Remove</span>
                            </div> :
                            null
                        }
                    </div>
                }
            </CardContent>
        </Card>
    );


    return (
        <div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', }}>
                <div>
                    <div style={{display: 'inline-block', fontSize: '1.2em', margin: '10px 0 10px 10px', }}>{searchItems.length} results for "</div>
                    <div style={{display: 'inline-block', fontSize: '1.2em', margin: '10px 0', 
                        fontWeight: 'bold', color: 'chocolate'}}>{searchParams.get('query')}</div>
                    <div style={{display: 'inline-block', fontSize: '1.2em', margin: '10px 10px 10px 0'}}>"</div>
                </div>
                {/* <Menu compact size='tiny' style={{float: 'inline-end', }}> */}
                <Dropdown options={sortOptions} simple item button style={{borderRadius: '20px', padding: '5px 10px'}}
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