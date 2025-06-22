import React from 'react';
import { Card, Image } from 'react-bootstrap';

const DynamicCard = ({
    iconSrc,
    altText,
    children,
    aosSettings = {
        animation: "zoom-in-right",
        duration: 350,
        easing: "ease-in-sine"
    },
    Head
}) => {
    return (
        <Card className="mb-3 p-2 scale-up-tl"
            data-aos={aosSettings.animation}
            data-aos-duration={aosSettings.duration}
            data-aos-easing={aosSettings.easing}
        >
            <Card.Body>
                <div className='row justify-content-between'>
                    {Head && <div className='col-md-12 mb-3'> <h5 className='fw-bold Head1 text-center '>{Head}</h5></div>}
                    <div className='col-md-4 d-flex flex-column justify-content-center align-item-center'>
                        <Image src={iconSrc} alt={altText} fluid className='w-75 m-auto' />
                    </div>
                    <div className='col-md-8 d-flex justify-content-center'>
                        <div className='row my-auto w-100'>
                            {children}
                        </div>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default DynamicCard;
