import { Tooltip } from 'antd';
import React from 'react';
import { Image } from 'react-bootstrap';
import { FaCircleQuestion } from 'react-icons/fa6';

const DynamicQuestionBlocks = (props) => {
    const { QuestionArray, QuestionClick, values, setFieldValue } = props;

    return (
        <React.Fragment>
            {QuestionArray.map((elem, index) => {
                try {
                    return (
                        <div key={index} className="col-md-4 px-2 pb-3 d-flex">
                            <div className="flex-grow-1 d-flex">
                                <div
                                    className={`${values[elem.key] === "Yes" ? "customBorder p-3" : "border p-3"
                                        } flex-grow-1`}
                                    onClick={() =>
                                        QuestionClick(index, elem, values, setFieldValue)
                                    }
                                >
                                    <div className="text-center">
                                        <div className="mx-auto" style={{ width: "20%" }}>
                                            <Image src={elem.img} fluid />
                                        </div>
                                    </div>
                                    <p htmlFor={elem.key} className="form-label-Questions text-center">
                                        {elem.title||"Title not find"}&nbsp;&nbsp;

                                        {elem?.info ?
                                            <Tooltip placement="top" title={elem.info}>
                                                <FaCircleQuestion style={{ fontSize: '18px', cursor: 'pointer' }} />
                                            </Tooltip> : ""
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                } catch (error) {
                    console.error(`Error rendering question block at index ${index}:`, error);
                    return null; // Optionally, you can return some fallback UI or null
                }
            })}
        </React.Fragment>
    );
};

export default DynamicQuestionBlocks;
