import React, { useState } from 'react';
import { Modal, InputNumber, Button, Space, Tag, Descriptions, Spin, Empty } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { usePortStore } from '@store/portStore';
import type { Port, PortStatus } from '../../../core/models/Port';

interface CheckPortModalProps {
  visible: boolean;
  onClose: () => void;
}

const CheckPortModal: React.FC<CheckPortModalProps> = ({ visible, onClose }) => {
  const [portNumber, setPortNumber] = useState<number | null>(null);
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState<PortStatus | null>(null);
  const [portInfo, setPortInfo] = useState<Port | null>(null);
  const [processInfo, setProcessInfo] = useState<any>(null);
  
  const { ports, activePorts } = usePortStore();

  const handleCheck = async () => {
    if (!portNumber) return;

    setChecking(true);
    setStatus(null);
    setPortInfo(null);
    setProcessInfo(null);

    try {
      // Check port status
      const portStatus = await window.portManager.port.check(portNumber);
      setStatus(portStatus);

      // Get additional info based on status
      if (portStatus === 'reserved') {
        const reservedPort = ports.find(p => p.number === portNumber);
        if (reservedPort) {
          setPortInfo(reservedPort);
        }
      } else if (portStatus === 'in-use') {
        const activePort = activePorts.find(p => p.number === portNumber);
        if (activePort) {
          setProcessInfo(activePort);
        }
      }
    } catch (error) {
      console.error('Error checking port:', error);
    } finally {
      setChecking(false);
    }
  };

  const getStatusTag = (status: PortStatus) => {
    const config = {
      'free': { color: 'green', text: 'Free' },
      'reserved': { color: 'orange', text: 'Reserved' },
      'in-use': { color: 'red', text: 'In Use' },
    };
    
    const { color, text } = config[status];
    return <Tag color={color} style={{ fontSize: '14px' }}>{text}</Tag>;
  };

  const handleReset = () => {
    setPortNumber(null);
    setStatus(null);
    setPortInfo(null);
    setProcessInfo(null);
  };

  return (
    <Modal
      title="Check Port Status"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
      width={500}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Space style={{ width: '100%' }}>
          <InputNumber
            placeholder="Enter port number"
            min={1}
            max={65535}
            value={portNumber}
            onChange={setPortNumber}
            onPressEnter={handleCheck}
            style={{ width: 200 }}
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleCheck}
            loading={checking}
            disabled={!portNumber}
          >
            Check
          </Button>
          {status && (
            <Button onClick={handleReset}>
              Clear
            </Button>
          )}
        </Space>

        {checking && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin tip="Checking port..." />
          </div>
        )}

        {!checking && status && (
          <div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Port">{portNumber}</Descriptions.Item>
              <Descriptions.Item label="Status">{getStatusTag(status)}</Descriptions.Item>
              
              {status === 'reserved' && portInfo && (
                <>
                  <Descriptions.Item label="Project">{portInfo.projectName}</Descriptions.Item>
                  {portInfo.description && (
                    <Descriptions.Item label="Description">{portInfo.description}</Descriptions.Item>
                  )}
                  <Descriptions.Item label="Reserved At">
                    {new Date(portInfo.reservedAt).toLocaleString()}
                  </Descriptions.Item>
                  {portInfo.tags && portInfo.tags.length > 0 && (
                    <Descriptions.Item label="Tags">
                      {portInfo.tags.map(tag => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </Descriptions.Item>
                  )}
                </>
              )}

              {status === 'in-use' && processInfo && (
                <>
                  <Descriptions.Item label="PID">{processInfo.pid}</Descriptions.Item>
                  {processInfo.processName && (
                    <Descriptions.Item label="Process">{processInfo.processName}</Descriptions.Item>
                  )}
                  {processInfo.state && (
                    <Descriptions.Item label="State">{processInfo.state}</Descriptions.Item>
                  )}
                  {processInfo.address && (
                    <Descriptions.Item label="Address">{processInfo.address}</Descriptions.Item>
                  )}
                </>
              )}

              {status === 'free' && (
                <Descriptions.Item label="Info">
                  This port is available for use
                </Descriptions.Item>
              )}
            </Descriptions>
          </div>
        )}

        {!checking && !status && !portNumber && (
          <Empty
            description="Enter a port number to check its status"
            style={{ padding: '20px' }}
          />
        )}
      </Space>
    </Modal>
  );
};

export default CheckPortModal;