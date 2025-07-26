import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Space, message, Spin, Input, Tooltip } from 'antd';
import { ScanOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import type { ActivePort } from '../../../core/models/Port';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;

const ScanView: React.FC = () => {
  const [activePorts, setActivePorts] = useState<ActivePort[]>([]);
  const [filteredPorts, setFilteredPorts] = useState<ActivePort[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  const scanPorts = async () => {
    setIsLoading(true);
    try {
      const ports = await window.portManager.port.scan();
      console.log('Scanned ports:', ports); // Debug log
      
      if (!ports || !Array.isArray(ports)) {
        console.error('Invalid ports data:', ports);
        setActivePorts([]);
        setFilteredPorts([]);
        message.warning('No active ports found');
        return;
      }
      
      setActivePorts(ports);
      setFilteredPorts(ports);
      message.success(`Found ${ports.length} active ports`);
    } catch (error) {
      console.error('Scan error:', error);
      message.error(`Scan failed: ${(error as Error).message}`);
      setActivePorts([]);
      setFilteredPorts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    scanPorts();
  }, []);

  useEffect(() => {
    if (searchText) {
      const filtered = activePorts.filter(port => 
        port.number.toString().includes(searchText) ||
        port.processName?.toLowerCase().includes(searchText.toLowerCase()) ||
        port.pid?.toString().includes(searchText)
      );
      setFilteredPorts(filtered);
    } else {
      setFilteredPorts(activePorts);
    }
  }, [searchText, activePorts]);

  const columns: ColumnsType<ActivePort> = [
    {
      title: 'Port',
      dataIndex: 'number',
      key: 'number',
      sorter: (a, b) => a.number - b.number,
      width: 100,
      render: (port) => <Tag color="blue">{port}</Tag>,
    },
    {
      title: 'PID',
      dataIndex: 'pid',
      key: 'pid',
      width: 100,
      render: (pid) => pid || '-',
    },
    {
      title: 'Process',
      dataIndex: 'processName',
      key: 'processName',
      ellipsis: true,
      render: (name) => (
        <Tooltip title={name}>
          {name || 'Unknown'}
        </Tooltip>
      ),
    },
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state',
      width: 120,
      render: (state) => {
        const color = state === 'LISTEN' ? 'green' : 'orange';
        return <Tag color={color}>{state}</Tag>;
      },
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      width: 150,
      render: (address) => address || '0.0.0.0',
    },
  ];

  return (
    <Card>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Space style={{ justifyContent: 'space-between', width: '100%' }}>
          <Space>
            <Search
              placeholder="Search by port, PID, or process name"
              onSearch={setSearchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
              allowClear
              prefix={<SearchOutlined />}
            />
            <Button
              icon={<ReloadOutlined spin={isLoading} />}
              onClick={scanPorts}
              loading={isLoading}
            >
              Rescan
            </Button>
          </Space>
          <div style={{ fontSize: '14px', color: '#666' }}>
            {isLoading ? (
              <Space>
                <Spin size="small" />
                Scanning ports...
              </Space>
            ) : (
              `${filteredPorts.length} active ports found`
            )}
          </div>
        </Space>

        <Table
          columns={columns}
          dataSource={filteredPorts}
          rowKey={(record) => `${record.number}-${record.pid}`}
          loading={isLoading}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} ports`,
          }}
          scroll={{ x: 800 }}
        />
      </Space>
    </Card>
  );
};

export default ScanView;