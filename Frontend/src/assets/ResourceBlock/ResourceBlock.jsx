import React, { useEffect } from 'react';
import { Button, Flex, List, Result, Splitter, Typography } from 'antd';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import DynamicComp from './DynamicComp';

const Desc = (props) => (
    <Flex
        justify="center"
        align="center"
        style={{
            height: '100%',
            width: "100%"
        }}
        vertical
        gap="middle"
    >
        <Typography.Title
            type="secondary"
            level={5}
            style={{
                whiteSpace: 'nowrap',
            }}
        >
            {props.text}
        </Typography.Title>
        {/* Render additional component if provided */}
        {props.component && <props.component />}
    </Flex>
);

const SampleComponent = () => {
    let { listOfItems } = DynamicComp

    let Nav = useNavigate();
    return (
        <div className='h-75 w-75'>
            <List>
                {listOfItems.map((elem, index) => {
                    return (<List.Item key={index}>
                        <List.Item.Meta
                            title={<h6>{elem.Title||"Title not found"}</h6>}
                            description={elem.subDescription}
                        />
                        <Button onClick={() => { Nav(`/ResourceBlock${elem.route}`) }}>Show</Button>
                    </List.Item>)
                })}
            </List>
        </div>
    )
};

const CodeSetting = () => {
    let { listOfItems } = DynamicComp

    return (
        <div className='h-75 w-75'>
            <Routes>
                {listOfItems.map((elem, index) => {
                    return (<Route path={elem.route} element={<CodeDisplay code={elem.textLog} />} />)
                })}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    )
};
const CodeDisplay = ({ code }) => {
    return (
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px', width: "100%", height: "fit-content", textWrap: "wrap", }}>
            <code>{code}</code>
        </pre>
    );
};

const NotFound = () => (
    <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
    />
);

const ResourceBlock = () => {
    let { listOfItems } = DynamicComp
    let Nav = useNavigate()

    // useEffect(() => {

    //     if (localStorage.getItem("User") !== "Dev021") {
    //         Nav('/')
    //     }
    // }, [])



    return (
        <Splitter
            style={{
                height: "100vh",
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            }}
        >
            <Splitter.Panel>
                <Splitter layout="vertical">
                    <Splitter.Panel>
                        <Desc text="Buttons" component={SampleComponent} />
                    </Splitter.Panel>
                    <Splitter.Panel>
                        <Desc text="Attributes" component={CodeSetting} />
                    </Splitter.Panel>
                </Splitter>
            </Splitter.Panel>
            <Splitter.Panel collapsible>

                <Routes>
                    {listOfItems.map((elem, index) => {
                        return (
                            <Route
                                key={index}
                                path={elem.route}
                                element={
                                    <div className='d-flex h-100 w-100 justify-content-center align-items-center'>
                                        <div>
                                            {elem.component ? (
                                                React.cloneElement(elem.component, {
                                                    ...(elem.Props || {}), // Spread the entire Props object
                                                })
                                            ) : (
                                                "No Child exists"
                                            )}
                                        </div>
                                    </div>
                                }
                            />
                        );
                    })}
                    <Route path="*" element={<NotFound />} />
                </Routes>



            </Splitter.Panel>
        </Splitter>
    );
};
export default ResourceBlock;
