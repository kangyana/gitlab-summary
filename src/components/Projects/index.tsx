import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { List, Form, DatePicker, Button, Card, Modal, message } from 'antd';
import { SearchOutlined, CoffeeOutlined, CarryOutOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import copy from 'copy-to-clipboard';
import './index.less';

interface Formdata {
  update_at: Dayjs;
}

const ProjectList: FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<any>([]);
  const [form] = Form.useForm<Formdata>();

  const handleFinish = (values: Formdata) => {
    const { update_at } = values;
    console.log(update_at);
  };

  const handleCreate = () => {
    const content =
      'gitlab-summary：\n1. xxx\n2. xxx\n3. xxx\n\ntimely-hooks：\n1. xxx\n2. xxx\n3. xxx\n\ntimely-hooks：\n1. xxx\n2. xxx\n3. xxx\n\ntimely-hooks：\n1. xxx\n2. xxx\n3. xxx';
    Modal.success({
      title: '生成周报',
      icon: <CarryOutOutlined />,
      content: (
        <div style={{ whiteSpace: 'pre-wrap', maxHeight: '60vh', overflow: 'overlay' }}>
          {content}
        </div>
      ),
      okText: '一键复制',
      onOk: () => {
        copy(content);
        message.success('复制成功！');
      },
      centered: true,
      closable: true,
    });
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDataSource([
        {
          id: 1,
          name: 'gitlab-summary',
          desc: 'gitlab生成周报器',
          update_at: '2022-06-05',
        },
        {
          id: 2,
          name: 'timely-hooks',
          desc: 'A timely rain React Hooks library.',
          update_at: '2022-04-05',
        },
      ]);
    }, 1000);
  }, []);

  return (
    <div className="projects-page">
      <Card size="small">
        <Form
          layout="inline"
          form={form}
          onFinish={handleFinish}
          initialValues={{
            update_at: [dayjs().subtract(7, 'day'), dayjs()],
          }}
        >
          <Form.Item label="更新时间" name="update_at">
            <DatePicker.RangePicker allowClear={false} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" icon={<SearchOutlined />} htmlType="submit">
              查询
            </Button>
          </Form.Item>
          <Form.Item>
            <Button icon={<CoffeeOutlined />} onClick={handleCreate}>
              生成
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <List
        bordered
        size="large"
        itemLayout="vertical"
        dataSource={dataSource}
        loading={loading}
        renderItem={(item: any) => (
          <List.Item>
            <List.Item.Meta title={<a>{item.name}</a>} description={item.desc} />
            {item.update_at}
          </List.Item>
        )}
      />
    </div>
  );
};

export default ProjectList;
