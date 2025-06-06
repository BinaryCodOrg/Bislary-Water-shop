import React from 'react'
import { Card } from 'react-bootstrap'

const CustomCard = (props) => {
    return (
        <Card role={props.role ? props.role : ""} className={` ${props.extra ? props.extra : 'border-0'}`} style={{ borderRadius: props.radius ? props.radius : "25px" }}
            // onClick={() => { console.log(props.extra); }}
            onClick={() => { if (props.callBack) { props.handleClick(props.Data) } }}
        >
            {props.children}
        </Card>
    )
}

export default CustomCard
