import { useState } from 'react';
import type { FC } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAtom } from 'jotai';
import { activeKeyAtom, userinfoAtom } from '@/jotai';
import './index.less';

interface Formdata {
  username: string;
  password: string;
}

const LoginPage: FC = () => {
  const [loading, setLoading] = useState(false);
  const [, setActiveKey] = useAtom(activeKeyAtom);
  const [, setUserinfo] = useAtom(userinfoAtom);
  const [form] = Form.useForm<Formdata>();

  const handleFinish = (values: Formdata) => {
    setLoading(true);
    console.log(values);
    setTimeout(() => {
      setLoading(false);
      message.success('登录成功！');
      setUserinfo({ username: '测试小酱油' });
      setActiveKey('projects');
    }, 1000)
  };

  return (
    <div className="ant-pro-form-login-page">
      <div className="ant-pro-form-login-page-notice" />
      <div className="ant-pro-form-login-page-container">
        <div className="ant-pro-form-login-page-top">
          <div className="ant-pro-form-login-page-header">
            <span className="ant-pro-form-login-page-logo">
              <img src="https://jihulab.com/assets/auth_buttons/gitlab_64-2957169c8ef64c58616a1ac3f4fc626e8a35ce4eb3ed31bb0d873712f2a041a0.png" />
            </span>
            <span className="ant-pro-form-login-page-title">GitLab</span>
          </div>
          <div className="ant-pro-form-login-page-desc" />
        </div>
        <div className="ant-pro-form-login-page-main">
          <Form layout="vertical" form={form} onFinish={handleFinish}>
            <Form.Item name="username" rules={[{ required: true, message: '用户名不能为空！' }]}>
              <Input size="large" prefix={<UserOutlined />} placeholder="用户名" allowClear />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: '密码不能为空！' }]}>
              <Input.Password
                size="large"
                prefix={<LockOutlined />}
                placeholder="密码"
                allowClear
              />
            </Form.Item>
            <Button type="primary" size="large" block htmlType="submit" loading={loading}>
              登录
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
