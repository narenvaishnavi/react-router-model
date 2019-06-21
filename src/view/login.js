
import React from 'react';
import 'antd/dist/antd.css';
import './index.css';
import { Form, Icon, Input, Button, Col } from 'antd';
import Hp from '../../src/Hp.png';

class NormalLoginForm extends React.Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ' + values.username + ' ' + values.password);
                if(values.username !== 'admin')
                    this.props.history.push('/home');
                else 
                    this.props.history.push('/admin');   
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                 <Col span={24}>
                    <Col span={1}></Col>
                    <Col span={10} style={{ marginTop: "1%", marginBottom: "1%" }}><img src={Hp} style={{ width: "4em" }} alt="Hp logo"/><span style={{ color: "#0095d9", fontWeight: 500, fontSize: "16px", marginLeft: "2%" }}>Visual Inspector</span></Col>
                    <Col span={10}></Col>
                    {/* <Col span={3} style={{ marginTop: "2%", fontSize: "24px", color: "#0095d9" }}><Tooltip placement="right" title="Refresh"><Icon type="sync" spin={this.state.spin} onClick={this.refresh}></Icon></Tooltip></Col> */}
                </Col>
                <Col span={24}>
                    <Col span={9}></Col>
                    <Col span={9}>
                        <Form onSubmit={this.handleSubmit} className="login-form">
                            <Form.Item>
                                {getFieldDecorator('username', {
                                    rules: [{ required: true, message: 'Please enter your username!' }],
                                })(
                                    <Input
                                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        placeholder="Username"
                                    />,
                                )}
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('password', {
                                    rules: [{ required: true, message: 'Please enter your Password!' }],
                                })(
                                    <Input
                                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        type="password"
                                        placeholder="Password"
                                    />,
                                )}
                            </Form.Item>
                            <Form.Item>
                                <Button htmlType="submit" className="login-form-button">
                                    Log in
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                    <Col span={6}></Col>
                </Col>
            </div>
        );
    }
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm);

export default WrappedNormalLoginForm;
