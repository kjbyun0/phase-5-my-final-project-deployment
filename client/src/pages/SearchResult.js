import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { dispPrice, dispListPrice, } from '../components/common';
import { CardGroup, Card, CardContent, CardHeader, Label, Menu, Dropdown,  } from 'semantic-ui-react';


function SearchResult() {
    const [ searchParams, setSearchParams ] = useSearchParams();
    const [ items, setItems ] = useState([]);
    const [ sort, setSort ] = useState(1);

    const options = [
        { key: 1, text: 'Featured', value: 1 },
        { key: 2, text: 'Price: Low to Hight', value: 2 },
        { key: 3, text: 'Price: High to Low', value: 3 },
        { key: 4, text: 'Avg. Customer Review', value: 4 },
    ];

    console.log('Before useEffect, searchParams: ', searchParams.get('query'));

    useEffect(() => {
        console.log('searchParams: ', searchParams.get('query'));
        fetch(`/search/${searchParams.get('query')}`)
        .then(r => {
            r.json().then(data => {
                if (r.ok) 
                    setItems(data)
                else
                    console.log('Server error: ', data.message);
                    //add more actions here....
            })
        });
    }, [searchParams]);

    let sortedItems;
    switch(sort) {
        case 2:
            sortedItems = items.toSorted((item1, item2) => item1.discount_prices[item1.default_item] - item2.discount_prices[item2.default_item])
            break;
        case 3:
            sortedItems = items.toSorted((item1, item2) => item2.discount_prices[item2.default_item] - item1.discount_prices[item1.default_item])
            break;
        case 4:
            // need to implement it after reviews feature is implemented. the following code is temporary.
            sortedItems = items;
            break;
        default:
            sortedItems = items;
            break;
    };

    const dispItemCards = sortedItems.map(item => 
        <Card key={item.id} style={{minWidth: '250px', }}>
            <div style={{width: '100%', height: '300px', 
                backgroundImage: `url(${item.card_thumbnail})`, 
                backgroundSize: 'contain', backgroundRepeat: 'no-repeat', 
                backgroundPosition: 'center', }}>
            </div>
            <CardContent>
                <CardHeader>{item.name}</CardHeader>
                <Label>
                    <span style={{fontSize: '1.2em',  fontWeight: 'bold', }}>
                        {
                            `${item.amounts[item.default_item]} \
                            ${item.units[item.default_item].charAt(0).toUpperCase() + item.units[item.default_item].slice(1)} \
                            (Pack of ${item.packs[item.default_item]})`
                        }
                    </span>
                </Label>
                <div>
                    {dispPrice(item, item.default_item)}
                </div>
                <div>
                    {
                        item.prices[item.default_item] !== item.discount_prices[item.default_item] ?
                        <>
                            <span style={{marginRight: '5px', }}>List:</span>
                            {dispListPrice(item, item.default_item)}
                        </> :
                        null
                    }
                </div>
            </CardContent>
        </Card>
    );


    console.log('In SearchResult, items: ', items);

    return (
        <div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center',}}>
                <div>
                    <div style={{display: 'inline-block', fontSize: '1.2em', margin: '10px 0 10px 10px', }}>{items.length} results for "</div>
                    <div style={{display: 'inline-block', fontSize: '1.2em', margin: '10px 10px 10px 0', 
                        fontWeight: 'bold', color: 'chocolate'}}>{searchParams.get('query')}"</div>
                </div>
                {/* <Menu compact size='tiny' style={{float: 'inline-end', }}> */}
                <Dropdown options={options} simple item button 
                    text='Dropdown' value={sort} onChange={(e, d) => setSort(d.value)} />
            </div>
            <hr style={{boxShadow: '0 2px 6px 1px lightgray'}}/>
            <div style={{ padding: '15px', width: '100%', height: '100%', }}>

                <div style={{fontSize: '1.5em', fontWeight: 'bold', margin: '5px 0', }}>Results</div>
                <div style={{fontSize: '1.1em', }}>Check each product page for other buying options.</div>
                <CardGroup itemsPerRow={5} style={{marginTop: '5px', }}>
                    {dispItemCards}
                </CardGroup>
            </div>
        </div>
    );
}

export default SearchResult;