import { useState, useEffect, forwardRef } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { convertUTCDate } from '../components/common';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { Input } from 'semantic-ui-react';


function SalesPerf() {
    const { user, sellerItems } = useOutletContext();
    const [ periodStart, setPeriodStart ] = useState(initStartDate());
    const [ periodEnd, setPeriodEnd] = useState(initEndDate());
    const navigate = useNavigate();

    console.log('in SalesPerf, periodStart: ', periodStart, ', periodEnd: ', periodEnd);
    console.log('in SalesPerf, sellerItems: ', sellerItems);

    //RBAC
    useEffect(() => {
        if (!user || !user.seller) {
            navigate('/signin');
            return;
        }
    }, []);

    function initStartDate() {
        const d = new Date();
        d.setHours(0); d.setMinutes(0); d.setSeconds(0); d.setMilliseconds(0);
        d.setDate(d.getDate() - 7);
        return d;
    }

    function initEndDate() {
        const d = new Date();
        d.setHours(23); d.setMinutes(59); d.setSeconds(59); d.setMilliseconds(999);
        return d;
    }

    const CustomInput = forwardRef(({ value, onClick }, ref) => (
        <Input style={{width: '120px', height: '30px',}} 
            value={value} onClick={onClick} ref={ref} />
    ));

    const dispSalesPerfs = sellerItems.map(item => {
        const itemSalesPerf = item.order_items.reduce((acc, oi) => {
            if (oi.processed_date) {
                const processed_dateUTC = convertUTCDate(oi.processed_date);
                // console.log('oi: ', oi, ', processed_dateUTC: ', processed_dateUTC);
                // if ((periodStart && periodEnd && processed_dateUTC >= periodStart && processed_dateUTC <= periodEnd) || 
                //     (!periodStart || !periodEnd)) {
                if (processed_dateUTC >= periodStart && processed_dateUTC <= periodEnd) {
                    acc.netSales += (oi.price * oi.quantity);
                    acc.salesCnt += 1;
                    acc.totalQty += oi.quantity;
                }
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

        // console.log('SalesPerf, itemSalesPerf: ', itemSalesPerf);

        return (
            <div key={`${item.id}`} style={{marginTop: '10px', }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', alignItems: 'center', 
                    backgroundColor: 'whitesmoke', borderRadius: '10px 10px 0 0', 
                    border: '1px solid lightgray', borderBottom: '0px', }}>
                    <div style={{width: '80px', height: '100px', marginLeft: '15px', 
                        backgroundImage: `url(${item.images[0]})`,     // image change from card_thumbnail
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
        <div style={{display: 'grid', gridTemplateColumns: '1fr 800px 1fr', margin: '40px 0', minWidth: '815px', }}>
            <div />
            <div>
                <div style={{display: 'grid', gridTemplateColumns: '1fr max-content max-content max-content max-content', 
                    alignItems: 'center', margin: '10px 0', fontSize: '1.1em'}}>
                    <div style={{alignSelf: 'center', fontSize: '2.0em', }}>Sales Performance</div>
                    <div style={{marginRight: '5px', }}>{'Period: '}</div>
                    <div >
                        <DatePicker style={{border: '1px solid lightgray', }} 
                            showIcon selected={periodStart} onChange={(d) => setPeriodStart(d)} 
                            dateFormat="yyyy-MM-dd" 
                            customInput={<CustomInput />} />
                    </div>
                    <div style={{margin: '0 5px', }}>~</div>
                    <div >
                        <DatePicker style={{}} 
                            showIcon selected={periodEnd} onChange={(d) => {
                                d.setHours(23); d.setMinutes(59); d.setSeconds(59); d.setMilliseconds(999);
                                setPeriodEnd(d);
                            }} 
                            dateFormat="yyyy-MM-dd" 
                            customInput={<CustomInput />} />
                    </div>
                </div>
                <div style={{marginTop: '20px', }}>{dispSalesPerfs}</div>
            </div>
            <div />
        </div>
    );
}

export default SalesPerf;