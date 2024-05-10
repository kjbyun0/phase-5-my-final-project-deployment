import { isEmptyArray } from 'formik';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import { Divider, Table, TableBody, TableRow, TableCell, } from 'semantic-ui-react';

function Item() {
    const { id } = useParams();
    const [ item, setItem ] = useState(null);
    const [ activeItemIdx, setActiveItemIdx ] = useState(null);

    useEffect(() => {
        fetch(`/items/${id}`)
        .then(r => {
            r.json().then(data => {
                if (r.ok) {
                    // console.log('In Istem, fetched item: ', data);
                    setItem(data);
                    setActiveItemIdx(data.default_item);
                } else {
                    console.log('Error: ', data.message);
                }
            });
        })
    }, []);


    function dispAllSizes() {
        // console.log('activeItemIdx: ', activeItemIdx);
        const packs = item.packs.map((pack, i) => {
            return (
                <div key={pack} className={i === activeItemIdx ? 'size-active-ink' : 'size-link'} 
                    onClick={() => setActiveItemIdx(i)}>
                    {
                        `${item.amounts[i]} \
                        ${item.units[i].charAt(0).toUpperCase() + item.units[i].slice(1)} \
                        (Pack of ${pack})`
                    }
                </div>
            );
        });
        return packs;
    }

    function dispDetail_1() {
        return (
            <Table style={{border: '0'}}>
                <TableBody>
                    {
                        Object.keys(item.details_1).map(key => 
                            <TableRow key={key}>
                                <TableCell style={{width: '40%', fontWeight: 'bold', paddingLeft: '0', }}>{key}</TableCell>
                                <TableCell style={{width: '60%', paddingLeft: '0', }}>{item.details_1[key]}</TableCell>
                            </TableRow>
                        )
                    }
                </TableBody>
            </Table>
        );
    }

    function dispDetail_2() {
        return (
            <div style={{margin: '15px', fontSize: '1.1em'}}>
                {
                    Object.keys(item.details_2).map(key => 
                        <div key={key} style={{marginBottom: '8px', }}>
                            <span style={{fontWeight: 'bold', }}>{`${key} : `}</span>
                            <spen>{item.details_2[key]}</spen>
                        </div>
                    )
                }
            </div>
        );
    }

    function dispAboutItem() {
        return (
            <ul style={{marginLeft: '15px', }}>
                {item.about_item.map((info, i) =>
                    <li key={i}>{info}</li>
                )}
            </ul>
        );
    }

    if (!item)
        return;

    // console.log('item.discount_prices[item.default_item]')
    return (
        <div style={{display: 'grid', gridTemplateRows: 'auto auto auto', padding: '15px', }}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', }}>
                {/* images */}
                <div>
                    images
                </div>
                {/* Item name and descriptions */}
                <div style={{padding: '10px', }}>
                    <h1 style={{fontWeight: 'normal',}}>{item.name}</h1>
                    <Divider />
                    {/* Price */}
                    <div style={{marginTop: '20px', }}>
                        {
                            item.prices[activeItemIdx] !== item.discount_prices[activeItemIdx] ?
                            <span style={{fontSize: '2em', color: 'red', marginRight: '10px', }}>
                                -{Math.round((1-item.discount_prices[activeItemIdx] / 
                                    item.prices[activeItemIdx])*100)}%
                            </span> :
                            null
                        }
                        <span style={{fontSize: '1em', verticalAlign: '50%', }}>$</span>
                        <span style={{fontSize: '2em', }}>
                            {Math.floor(item.discount_prices[activeItemIdx])}
                        </span>
                        <span style={{fontSize: '1em', verticalAlign: '50%', marginRight: '10px', }}>
                            {Math.round((item.discount_prices[activeItemIdx] - 
                                Math.floor(item.discount_prices[activeItemIdx]))*100)}
                        </span>
                        <span style={{fontSize: '1em', verticalAlign: '30%', }}>
                            $({Math.round(item.discount_prices[activeItemIdx] / 
                                (item.amounts[activeItemIdx] * item.packs[activeItemIdx])*100)/100} 
                            / {item.units[activeItemIdx]})
                        </span>
                    </div>
                    <div>
                        {
                            item.prices[activeItemIdx] !== item.discount_prices[activeItemIdx] ?
                            <>
                                <span style={{marginRight: '5px', }}>List Price:</span>
                                <span><s>${item.prices[activeItemIdx]}</s></span>
                            </> :
                            null
                        }
                    </div>
                    {/* Size options */}
                    <div style={{margin: '20px 0 0 0', }}>
                        <span style={{fontSize: '1.2em', marginRight: '10px', }}>Size:</span>
                        <span style={{fontSize: '1.2em',  fontWeight: 'bold', }}>
                            {
                                `${item.amounts[activeItemIdx]} \
                                ${item.units[activeItemIdx].charAt(0).toUpperCase() + item.units[activeItemIdx].slice(1)} \
                                (Pack of ${item.packs[activeItemIdx]})`
                            }
                        </span>
                    </div>
                    <div>
                        {dispAllSizes()}
                    </div>
                    {/* Product details_1 */}
                    <div style={{marginTop: '20px', }}>
                        {dispDetail_1()}                
                    </div>
                    <Divider />
                    <div style={{marginTop: '20px', }}>
                        <div style={{marginBottom: '10px', fontSize: '1.2em', fontWeight: 'bold', }}>About this item</div>
                        {dispAboutItem()}
                    </div>
                </div>
                
            </div>
            {/* Product details_2 */}
            <div>
                <Divider />
                <div style={{fontSize: '1.8em', fontWeight: 'bold', marginTop: '20px'}}>Product details</div>
                {dispDetail_2()}
            </div>
            {/* Customer Reviews */}
            <div>
                <Divider />

            </div>
        </div>
    );
}

export default Item;