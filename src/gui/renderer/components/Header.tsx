import React, { useState } from 'react';
import { Layout, Typography, Space, Button, Switch, Dropdown, Menu, message } from 'antd';
import { ReloadOutlined, PlusOutlined, BulbOutlined, DownloadOutlined, UploadOutlined, MenuOutlined, SearchOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import { usePortStore } from '@store/portStore';
import { useTheme } from '@hooks/useTheme';
import ReservePortModal from './ReservePortModal';
import CheckPortModal from './CheckPortModal';
import RequestPortsModal from './RequestPortsModal';

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
  const [showCheckModal, setShowCheckModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const handleExport = async () => {
    try {
      // Get port data
      const data = await window.portManager.port.export();
      
      // Show save dialog
      const result = await window.portManager.dialog.showSaveDialog();
      
      if (!result.canceled && result.filePath) {
        // Write data to file
        await window.portManager.file.write(result.filePath, JSON.stringify(data, null, 2));
        message.success(`Exported ${data.ports.length} ports to ${result.filePath}`);
      }
    } catch (error) {
      message.error(`Export failed: ${(error as Error).message}`);
    }
  };

  const handleImport = async () => {
    try {
      // Show open dialog
      const result = await window.portManager.dialog.showOpenDialog();
      
      if (!result.canceled && result.filePaths.length > 0) {
        // Read file
        const content = await window.portManager.file.read(result.filePaths[0]);
        const data = JSON.parse(content);
        
        // Import ports
        const importResult = await window.portManager.port.import(data);
        
        if (importResult.imported > 0) {
          message.success(`Imported ${importResult.imported} ports`);
        }
        
        if (importResult.skipped > 0) {
          message.warning(`Skipped ${importResult.skipped} ports (already in use)`);
        }
        
        if (importResult.errors.length > 0) {
          console.error('Import errors:', importResult.errors);
        }
        
        // Refresh the port list
        await refreshPorts();
      }
    } catch (error) {
      message.error(`Import failed: ${(error as Error).message}`);
    }
  };

  const menuItems = [
    {
      key: 'request',
      icon: <AppstoreAddOutlined />,
      label: 'Request Multiple Ports',
      onClick: () => setShowRequestModal(true),
    },
    {
      key: 'check',
      icon: <SearchOutlined />,
      label: 'Check Port',
      onClick: () => setShowCheckModal(true),
    },
    {
      type: 'divider',
    },
    {
      key: 'export',
      icon: <DownloadOutlined />,
      label: 'Export Configuration',
      onClick: handleExport,
    },
    {
      key: 'import',
      icon: <UploadOutlined />,
      label: 'Import Configuration',
      onClick: handleImport,
    },
  ];

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
        
        <Dropdown menu={{ items: menuItems }} placement="bottomRight">
          <Button icon={<MenuOutlined />}>
            Actions
          </Button>
        </Dropdown>
        
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
    
    <CheckPortModal
      visible={showCheckModal}
      onClose={() => setShowCheckModal(false)}
    />
    
    <RequestPortsModal
      visible={showRequestModal}
      onClose={() => setShowRequestModal(false)}
    />
    </>
  );
};

export default Header;