import { useOutletContext } from 'react-router-dom';


function SalesPerf() {
    const { user, sellerItems } = useOutletContext();
    
    console.log('in SalesPerf, sellerItems: ', sellerItems);

    const dispSalesPerfs = sellerItems.map(item => {
        const itemSalesPerf = item.order_items.reduce((acc, oi) => {
            if (oi.processed_date) {
                acc.netSales += (oi.price * oi.quantity);
                acc.salesCnt += 1;
                acc.totalQty += oi.quantity;
            } else {
                acc.netSalesSalesIP += (oi.price * oi.quantity);
                acc.salesCntSalesIP += 1;
                acc.totalQtySalesIP += oi.quantity;
            }

            return acc;
        }, 
        {
            netSales: 0, 
            salesCnt: 0,
            totalQty: 0,
            avgPrice: 0,
            netSalesSalesIP: 0,
            salesCntSalesIP: 0,
            totalQtySalesIP: 0,
            avgPriceSalesIP: 0,
        });

        itemSalesPerf.avgPrice = !itemSalesPerf.totalQty ? 
            0 : itemSalesPerf.netSales / itemSalesPerf.totalQty;
        itemSalesPerf.avgPriceSalesIP = !itemSalesPerf.totalQtySalesIP ? 
            0 : itemSalesPerf.netSalesSalesIP / itemSalesPerf.totalQtySalesIP;

        console.log('SalesPerf, itemSalesPerf: ', itemSalesPerf);

        return (
            <div key={`${item.id}`} style={{marginTop: '10px', }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', alignItems: 'center', 
                    backgroundColor: 'whitesmoke', borderRadius: '10px 10px 0 0', 
                    border: '1px solid lightgray', borderBottom: '0px', }}>
                    <div style={{width: '80px', height: '100px', marginLeft: '15px', 
                        backgroundImage: `url(${item.card_thumbnail})`, 
                        backgroundSize: 'contain', backgroundRepeat: 'no-repeat', 
                        backgroundPosition: 'center', }} 
                    />
                    <div style={{margin: '15px', }}>
                        <div style={{fontSize: '1.2em', }}>
                            {item.name}</div>
                    </div>
                </div>
                <div style={{borderRadius: '0 0 10px 10px', border: '1px solid lightgray', }}>
                    <ul style={{margin: '7px 0 7px 30px', fontSize: '1.2em', }}>
                        <li style={{margin: '3px 0', }}>
                            <span>Net Sales: ${itemSalesPerf.netSales.toLocaleString('en-US', 
                                { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                            <span style={{margin: '10px', }}>
                                (${itemSalesPerf.netSalesSalesIP.toLocaleString('en-US', 
                                    { minimumFractionDigits: 2, maximumFractionDigits: 2 })} in progress)
                            </span>
                        </li>
                        <li style={{margin: '3px 0', }}>
                            <span>Quantity: {itemSalesPerf.totalQty.toLocaleString('en-US')}</span>
                            <span style={{margin: '10px', }}>
                                ({itemSalesPerf.totalQtySalesIP.toLocaleString('en-US')} in progress)
                            </span>
                        </li>
                        <li style={{margin: '3px 0', }}>
                            <span>Sales Count: {itemSalesPerf.salesCnt.toLocaleString('en-US')}</span>
                            <span style={{margin: '10px', }}>({itemSalesPerf.salesCntSalesIP.toLocaleString('en-US')} in progress)</span>
                        </li>
                        <li style={{margin: '3px 0', }}>
                            <span>Average Price: ${itemSalesPerf.avgPrice.toLocaleString('en-US', 
                                { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                            <span style={{margin: '10px', }}>
                                (${itemSalesPerf.avgPriceSalesIP.toLocaleString('en-US', 
                                    { minimumFractionDigits: 2, maximumFractionDigits: 2 })} in progress)
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        );

    });

    return (
        <div style={{display: 'grid', gridTemplateColumns: '1fr 800px 1fr', margin: '40px 0'}}>
            <div />
            <div>
                <div style={{display: 'grid', gridTemplateColumns: '1fr max-content', alignItems: 'center',}}>
                    <div style={{fontSize: '2.0em', }}>Sales Performance</div>
                    <div>
                        <div style={{fontSize: '1.1em', marginTop: '20px', }}>
                            <span>{'Period: '}</span>
                            {/* <Dropdown button style={{fontSize: '1.1em', padding: '7px 10px', margin: '10px 0 0 0', 
                                borderRadius: '10px', background: 'whitesmoke', border: '1px solid lightgray', 
                                boxShadow: '0 2 10 10 red', }}
                                options={itemOptions} 
                                value={filteritemId} onChange={(e, d) => setFilterItemId(d.value)}/> */}
                        </div>
                    </div>
                </div>
                <div style={{marginTop: '20px', }}>{dispSalesPerfs}</div>
            </div>
            <div />
        </div>
    );
}

export default SalesPerf;