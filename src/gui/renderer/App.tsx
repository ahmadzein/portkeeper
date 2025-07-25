import React from 'react';
import { ConfigProvider, Layout, theme } from 'antd';
import Header from '@components/Header';
import Dashboard from '@pages/Dashboard';
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
          <Dashboard />
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default App;