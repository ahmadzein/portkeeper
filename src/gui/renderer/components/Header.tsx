import React from 'react';
import { Layout, Typography, Space, Button, Switch } from 'antd';
import { ReloadOutlined, PlusOutlined, BulbOutlined } from '@ant-design/icons';
import { usePortStore } from '@store/portStore';
import { useTheme } from '@hooks/useTheme';
import ReservePortModal from './ReservePortModal';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

interface HeaderProps {
  onReserveClick?: () => void;
  showReserveModal?: boolean;
  setShowReserveModal?: (show: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ onReserveClick, showReserveModal = false, setShowReserveModal }) => {
  const { refreshPorts, isLoading } = usePortStore();
  const { isDark, toggleTheme } = useTheme();
  const internalShowModal = showReserveModal;
  const internalSetShowModal = setShowReserveModal || (() => {});

  return (
    <>
      <AntHeader style={{ 
        background: '#fff', 
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        height: 64,
      }}>
        <Title level={3} style={{ margin: 0 }}>
          Port Manager
        </Title>
        
        <Space size="middle">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              if (onReserveClick) onReserveClick();
              else internalSetShowModal(true);
            }}
          >
            Reserve Port
          </Button>
        
        <Button
          icon={<ReloadOutlined spin={isLoading} />}
          onClick={refreshPorts}
          loading={isLoading}
        >
          Refresh
        </Button>
        
        <Space>
          <BulbOutlined />
          <Switch
            checked={isDark}
            onChange={toggleTheme}
            checkedChildren="Dark"
            unCheckedChildren="Light"
          />
        </Space>
      </Space>
    </AntHeader>

    <ReservePortModal
      visible={internalShowModal}
      onClose={() => internalSetShowModal(false)}
    />
    </>
  );
};

export default Header;