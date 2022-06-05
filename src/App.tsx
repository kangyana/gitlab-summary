import { useEffect } from 'react';
import { Tabs } from 'antd';
import { useAtom } from 'jotai';
import { activeKeyAtom } from '@/jotai';
import LoginPage from '@/components/Login';
import ProjectList from '@/components/Projects';
// import { invoke } from '@tauri-apps/api/tauri';

function App() {
  const [activeKey, setActiveKey] = useAtom(activeKeyAtom);


  useEffect(() => {
    // invoke<string>('oauth_token', { username: 'test', password: '123456' })
    //   .then((res) => {
    //     console.log('oauth_token', res);
    //   })
    //   .catch((e) => {
    //     console.error(e);
    //   });
  }, []);

  return (
    <div className="app">
      <Tabs className="app-tabs" type="card" tabPosition="left" activeKey={activeKey} onChange={setActiveKey}>
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
