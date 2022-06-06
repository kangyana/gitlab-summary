import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { List, Form, DatePicker, Button, Card, Modal, message, Checkbox } from 'antd';
import { CoffeeOutlined, CarryOutOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import copy from 'copy-to-clipboard';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { invoke } from '@tauri-apps/api/tauri';
import { useAtom } from 'jotai';
import { userinfoAtom } from '@/jotai';
import type { Project } from '@/types/project';
import type { Commit } from '@/types/commit';
import './index.less';

interface Formdata {
  last_activity_at: Dayjs[];
}

const ProjectList: FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<Project[]>([]);
  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [commitLoading, setCommitLoading] = useState(false);
  const [userinfo] = useAtom(userinfoAtom);
  const [form] = Form.useForm<Formdata>();

  const handleChange = (list: CheckboxValueType[]) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < dataSource.length);
    setCheckAll(list.length === dataSource.length);
  };

  const handleCheckAllChange = (e: CheckboxChangeEvent) => {
    setCheckedList(e.target.checked ? dataSource.map((v) => v.id) : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  const handleCreate = async (values: Formdata) => {
    const { last_activity_at } = values;
    const [start_at, end_at] = last_activity_at;
    setCommitLoading(true);
    const promiseList: Promise<Project>[] = [];
    dataSource
      .filter((item) => {
        if (checkedList.length === 0) return true;
        return checkedList.includes(item.id);
      })
      .forEach((item) => {
        const promiseFunc = async () => {
          return invoke<Commit[]>('project_commits', { projectId: item.id }).then((res) => {
            return { ...item, commits: res };
          });
        };
        promiseList.push(promiseFunc());
      });

    Promise.all(promiseList)
      .then((res) => {
        const content = res
          .map((item) => {
            const { name, commits } = item;
            const commitList = commits
              .filter((v) => {
                const isSameName = v.committer_name === userinfo.name;
                const isBetweenAt = dayjs(v.committed_date).isBetween(start_at, end_at);
                return isSameName && isBetweenAt;
              })
              .map((v, i) => `${i + 1}. ${v.message}`);
            return `${name}：\n${commitList.join('')}`;
          })
          .join('\n');

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
      })
      .finally(() => {
        setCommitLoading(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    invoke<Project[]>('projects')
      .then((res) => {
        setDataSource(res);
      })
      .finally(() => {
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
      });
  }, []);

  return (
    <div className="projects-page">
      <Card size="small">
        <Form
          layout="inline"
          form={form}
          onFinish={handleCreate}
          initialValues={{
            last_activity_at: [dayjs().subtract(7, 'day'), dayjs()],
          }}
        >
          <Form.Item>
            <Checkbox
              indeterminate={indeterminate}
              onChange={handleCheckAllChange}
              checked={checkAll}
              style={{ marginLeft: 12 }}
            >
              请选择项目
            </Checkbox>
          </Form.Item>
          <Form.Item name="last_activity_at">
            <DatePicker.RangePicker allowClear={false} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<CoffeeOutlined />}
              loading={commitLoading}
            >
              生成
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Checkbox.Group className="project-list" value={checkedList} onChange={handleChange}>
        <List
          bordered
          size="large"
          itemLayout="vertical"
          dataSource={dataSource}
          loading={loading}
          rowKey="id"
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Checkbox value={item.id}>
                    <a>{item.name_with_namespace}</a>
                  </Checkbox>
                }
                description={item.description}
              />
              {item.last_activity_at}
            </List.Item>
          )}
        />
      </Checkbox.Group>
    </div>
  );
};

export default ProjectList;
