import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ItemContext } from '../components/ItemProvider';


function Home() {
    const [ topSalesItems, setTopSalesItems ] = useState([]);
    const [ topReviewedItems, setTopReviewedItems ] = useState([]);
    const { item, setItem } = useContext(ItemContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/items/sales')
        .then(r => r.json())
        .then(data => {
            console.log('in Home, top sales items: ', data);
            setTopSalesItems(data);
        });

        fetch('/items/rating')
        .then(r => r.json())
        .then(data => {
            console.log('in Home, top reviewed items: ', data);
            setTopReviewedItems(data);
        })
    }, []);



    return (
        <div>
            <div className='gradient-img' style={{position: 'absolute', zIndex: '1',
                width: '100%', height: '100%',
                backgroundImage: 'linear-gradient(to bottom, rgba(245, 245, 245, 0), rgba(245, 245, 245, 1)), url(/61uNj76JeeL._SX3000_.jpg)',
                backgroundSize: 'cover', backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center',  }}
            />
            <div style={{position: 'absolute', zIndex: '2', width: '100%', marginTop: '420px',
                background: 'linear-gradient(to bottom, rgba(245, 245, 245, 0) 0%, rgba(245, 245, 245, 1) 50%)',
            }}>
                <div style={{ display:'grid', gridTemplateColumns: '1fr max-content max-content 1fr',
                    alignItems: 'center',
                }}>
                    <div />
                    <div style={{padding: '10px', margin: '10px', backgroundColor: 'white', width: '360px', height: '479.97px', }}>
                        <div style={{fontSize: '1.5em', fontWeight: 'bold', padding: '5px', margin: '5px', }}>Best Sellers</div>
                        <div style={{display:'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gridTemplateRows: '1fr 1fr', }}>
                            {
                                topSalesItems.map(item =>
                                    <div key={item.id} className='link' style={{margin: '10px', marginBottom: '30px', }}
                                        onClick={() => {setItem(item); navigate(`/items/${item.id}`)}}>
                                        <div style={{width: '150px', height: '150px',
                                            backgroundImage: `url(${item.images[0]})`,     // image change from card_thumbnail
                                            backgroundSize: 'contain', backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'center', border: '1px solid gainsboro', }}
                                        />
                                        <div>{`${item.name.slice(0, 17)}...`}</div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    <div style={{padding: '10px', margin: '10px', backgroundColor: 'white', width: '360px', height: '479.97px', }}>
                        <div style={{fontSize: '1.5em', fontWeight: 'bold', padding: '5px', margin: '5px', }}>Best Reviewed Products</div>
                        <div style={{display:'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gridTemplateRows: '1fr 1fr', }}>
                            {
                                topReviewedItems.map(item =>
                                    <div key={item.id} className='link' style={{margin: '10px', marginBottom: '30px', }}
                                        onClick={() => {setItem(item); navigate(`/items/${item.id}`)}}>
                                        <div style={{width: '150px', height: '150px',
                                            backgroundImage: `url(${item.images[0]})`,     // image change from card_thumbnail
                                            backgroundSize: 'contain', backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'center', border: '1px solid gainsboro', }}
                                        />
                                        <div>{`${item.name.slice(0, 17)}...`}</div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    <div />
                </div>
            </div>
        </div>
    );
}

export default Home;
