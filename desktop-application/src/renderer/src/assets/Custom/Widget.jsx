import React from 'react'

import { Statistic } from 'antd';
import CountUp from 'react-countup';

import { Image } from 'react-bootstrap';
import CustomCard from './DynamicCards/CustomCard';


const Widget = ({ allWidget, setOption }) => {
    const formatter = (value) => <CountUp end={value} separator="," />;

    let handleClick = (elem) => {
        // alert(elem);
        setOption(elem);
    }

    return (
        <div className='row mt-2'>
            {allWidget.map((elem, index) => {
                if (elem.version === 1) {
                    return (
                        <div className='col-md-3' key={index}>
                            <CustomCard extra={'py-1 ' + elem.extra} role={"button"} callBack={true} Data={elem.Name} handleClick={handleClick}>
                                <div className='d-flex flex-column flex-wrap justify-content-center gap-3 py-2 px-1'>
                                    <p className="DMFamily fw-bold h4 C-color text-center">{elem.Name}</p>
                                    <div className='d-flex align-items-center justify-content-center'>
                                        <Image src={elem.icon} fluid style={{ width: "14vw", height: "14vh" }} />
                                    </div>
                                    <div className='text-center '>
                                        {/* <h5 className="DMFamily fw-bold h3 C-color">{elem.Name}</h5> */}
                                        <Statistic
                                            // title={elem.Name}
                                            className="fw-bold"
                                            prefix={elem.symbolLocation === 'prefix' && elem.symbol}
                                            suffix={elem.symbolLocation === 'suffix' && elem.symbol}
                                            value={elem.value}
                                            formatter={formatter}
                                        />
                                    </div>
                                </div>
                            </CustomCard>
                        </div>
                    )
                }
                else {
                    return (
                        <div className='col-md-3' key={index}>
                            <CustomCard extra={elem.extra} role={"button"} callBack={true} Data={elem.Name} handleClick={handleClick}>
                                <div className='d-flex justify-content-start gap-3 py-2 px-1'>
                                    <div className='d-flex align-items-center '>
                                        <Image src={elem.icon} fluid style={{ width: "6vw", height: "10vh" }} />
                                    </div>
                                    <div className=''>
                                        {/* <h5 className="DMFamily fw-bold h3 C-color">{elem.Name}</h5> */}
                                        <Statistic
                                            title={elem.Name}
                                            className="fw-bold themeGreen"
                                            prefix={elem.symbolLocation === 'prefix' && elem.symbol}
                                            suffix={elem.symbolLocation === 'suffix' && elem.symbol}
                                            value={elem.value}
                                            formatter={formatter}
                                        />
                                    </div>
                                </div>
                            </CustomCard>
                        </div>
                    )
                }
            })}

        </div>
    )
}

export default Widget

