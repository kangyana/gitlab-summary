import { Tabs } from 'antd';
import { useAtom } from 'jotai';
import { activeKeyAtom } from '@/jotai';
import LoginPage from '@/components/Login';
import ProjectList from '@/components/Projects';

function App() {
  const [activeKey, setActiveKey] = useAtom(activeKeyAtom);

  return (
    <div className="app">
      <Tabs
        className="app-tabs"
        type="card"
        tabPosition="left"
        activeKey={activeKey}
        onChange={setActiveKey}
      >
        <Tabs.TabPane tab="登录" key="login">
          <LoginPage />
        </Tabs.TabPane>
        <Tabs.TabPane tab="项目列表" key="projects">
          <ProjectList />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

export default App;
