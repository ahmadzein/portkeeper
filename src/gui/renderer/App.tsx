import React from 'react';
import { ConfigProvider, Layout, theme, Tabs } from 'antd';
import { DatabaseOutlined, ScanOutlined } from '@ant-design/icons';
import Header from '@components/Header';
import Dashboard from '@pages/Dashboard';
import ScanView from '@pages/ScanView';
import { usePortStore } from '@store/portStore';
import { useTheme } from '@hooks/useTheme';
import { useKeyboardShortcuts } from '@hooks/useKeyboardShortcuts';

const { Content } = Layout;

function App(): React.ReactElement {
  const { refreshPorts } = usePortStore();
  const { themeConfig } = useTheme();
  const [showReserveModal, setShowReserveModal] = React.useState(false);

  // Set up keyboard shortcuts
  useKeyboardShortcuts(() => setShowReserveModal(true));

  React.useEffect(() => {
    // Initial load of ports
    refreshPorts();

    // Refresh ports every 5 seconds
    const interval = setInterval(refreshPorts, 5000);

    return () => clearInterval(interval);
  }, [refreshPorts]);

  const tabItems = [
    {
      key: 'dashboard',
      label: (
        <span>
          <DatabaseOutlined />
          Reserved Ports
        </span>
      ),
      children: <Dashboard />,
    },
    {
      key: 'scan',
      label: (
        <span>
          <ScanOutlined />
          Active Ports
        </span>
      ),
      children: <ScanView />,
    },
  ];

  return (
    <ConfigProvider
      theme={{
        algorithm: themeConfig.algorithm,
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <Header onReserveClick={() => setShowReserveModal(true)} showReserveModal={showReserveModal} setShowReserveModal={setShowReserveModal} />
        <Content style={{ padding: '24px' }}>
          <Tabs 
            defaultActiveKey="dashboard" 
            items={tabItems}
            size="large"
          />
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default App;