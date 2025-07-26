import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Space, message, Spin, Input, Tooltip, Popconfirm } from 'antd';
import { ScanOutlined, ReloadOutlined, SearchOutlined, CloseCircleOutlined } from '@ant-design/icons';
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
      // Debug: Log what's available
      console.log('[ScanView] window:', window);
      console.log('[ScanView] window.portManager:', window.portManager);
      console.log('[ScanView] window.portManager?.port:', window.portManager?.port);
      
      // Ensure portManager is available
      if (!window.portManager?.port?.scan) {
        throw new Error('Port Manager API not available');
      }
      
      const ports = await window.portManager.port.scan();
      
      if (!ports || !Array.isArray(ports)) {
        console.error('Invalid ports data:', ports);
        setActivePorts([]);
        setFilteredPorts([]);
        message.warning('No active ports found');
        return;
      }
      
      setActivePorts(ports);
      setFilteredPorts(ports);
      
      if (ports.length === 0) {
        message.info('No active ports found');
      } else {
        message.success(`Found ${ports.length} active ports`);
      }
    } catch (error) {
      console.error('Scan error full details:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack',
        type: error?.constructor?.name
      });
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      message.error(`Scan failed: ${errorMessage}`);
      setActivePorts([]);
      setFilteredPorts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const killProcess = async (port: number) => {
    try {
      if (!window.portManager?.port?.kill) {
        throw new Error('Kill functionality not available');
      }

      await window.portManager.port.kill(port);
      message.success(`Process on port ${port} killed successfully`);
      
      // Rescan ports to update the list
      await scanPorts();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      message.error(`Failed to kill process: ${errorMessage}`);
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
        port.pid?.toString().includes(searchText) ||
        port.projectName?.toLowerCase().includes(searchText.toLowerCase()) ||
        port.description?.toLowerCase().includes(searchText.toLowerCase())
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
      defaultSortOrder: 'ascend',
      width: 100,
      render: (port) => <Tag color="blue">{port}</Tag>,
    },
    {
      title: 'PID',
      dataIndex: 'pid',
      key: 'pid',
      sorter: (a, b) => (a.pid || 0) - (b.pid || 0),
      width: 100,
      render: (pid) => pid || '-',
    },
    {
      title: 'Process',
      dataIndex: 'processName',
      key: 'processName',
      sorter: (a, b) => (a.processName || '').localeCompare(b.processName || ''),
      ellipsis: true,
      render: (name) => (
        <Tooltip title={name}>
          {name || 'Unknown'}
        </Tooltip>
      ),
    },
    {
      title: 'Project',
      dataIndex: 'projectName',
      key: 'projectName',
      sorter: (a, b) => (a.projectName || '').localeCompare(b.projectName || ''),
      width: 150,
      ellipsis: true,
      render: (projectName, record) => {
        if (!projectName) return '-';
        return (
          <Tooltip title={record.description || 'Reserved port'}>
            <Tag color="purple">{projectName}</Tag>
          </Tooltip>
        );
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      sorter: (a, b) => (a.description || '').localeCompare(b.description || ''),
      ellipsis: true,
      render: (description) => {
        if (!description) return '-';
        return (
          <Tooltip title={description}>
            <span style={{ fontSize: '12px', color: '#666' }}>
              {description.length > 30 ? `${description.substring(0, 30)}...` : description}
            </span>
          </Tooltip>
        );
      },
    },
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state',
      sorter: (a, b) => (a.state || '').localeCompare(b.state || ''),
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
      sorter: (a, b) => (a.address || '').localeCompare(b.address || ''),
      width: 150,
      render: (address) => address || '0.0.0.0',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Popconfirm
          title="Kill Process"
          description={`Are you sure you want to kill the process on port ${record.number}?`}
          onConfirm={() => killProcess(record.number)}
          okText="Yes"
          cancelText="No"
          okButtonProps={{ danger: true }}
        >
          <Button
            danger
            size="small"
            icon={<CloseCircleOutlined />}
            title="Kill process"
          >
            Kill
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Card>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Space style={{ justifyContent: 'space-between', width: '100%' }}>
          <Space>
            <Search
              placeholder="Search by port, PID, process, project, or description"
              onSearch={setSearchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 350 }}
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
          showSorterTooltip={true}
          onChange={(pagination, filters, sorter) => {
            // Enable sorting by handling onChange event
            console.log('Table sorting/filtering changed:', { pagination, filters, sorter });
          }}
        />
      </Space>
    </Card>
  );
};

export default ScanView;