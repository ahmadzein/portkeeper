import React, { useState } from 'react';
import { Card, Table, Tag, Button, Space, Input, Select, message, Popconfirm } from 'antd';
import { SearchOutlined, DeleteOutlined, StopOutlined } from '@ant-design/icons';
import type { Port, PortStatus } from '../../../core/models/Port';
import { usePortStore } from '@store/portStore';
import type { ColumnsType } from 'antd/es/table';
import type { TableRowSelection } from 'antd/es/table/interface';

const { Search } = Input;
const { Option } = Select;

const Dashboard: React.FC = () => {
  const { 
    ports, 
    activePorts, 
    isLoading, 
    filter,
    setFilter,
    refreshPorts,
    releasePort,
    killPort 
  } = usePortStore();
  
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const handleRelease = async (port: number) => {
    try {
      await releasePort(port);
      message.success(`Port ${port} released successfully`);
    } catch (error) {
      message.error(`Failed to release port ${port}`);
    }
  };

  const handleKill = async (port: number) => {
    try {
      await killPort(port);
      message.success(`Process on port ${port} killed successfully`);
    } catch (error) {
      message.error(`Failed to kill process on port ${port}`);
    }
  };

  const handleBulkRelease = async () => {
    const selectedPorts = selectedRowKeys.map(key => Number(key));
    let successCount = 0;
    let errorCount = 0;

    for (const port of selectedPorts) {
      try {
        await releasePort(port);
        successCount++;
      } catch (error) {
        errorCount++;
      }
    }

    if (successCount > 0) {
      message.success(`Released ${successCount} ports`);
    }
    if (errorCount > 0) {
      message.error(`Failed to release ${errorCount} ports`);
    }

    setSelectedRowKeys([]);
  };

  const handleBulkKill = async () => {
    const selectedPorts = selectedRowKeys.map(key => Number(key));
    const portsWithProcesses = selectedPorts.filter(port => {
      const activePort = activePorts.find(p => p.number === port);
      return activePort !== undefined;
    });

    if (portsWithProcesses.length === 0) {
      message.warning('No active processes found for selected ports');
      return;
    }

    let successCount = 0;
    let errorCount = 0;

    for (const port of portsWithProcesses) {
      try {
        await killPort(port);
        successCount++;
      } catch (error) {
        errorCount++;
      }
    }

    if (successCount > 0) {
      message.success(`Killed ${successCount} processes`);
    }
    if (errorCount > 0) {
      message.error(`Failed to kill ${errorCount} processes`);
    }

    setSelectedRowKeys([]);
  };

  const getStatusTag = (status: PortStatus) => {
    const config = {
      'free': { color: 'green', text: 'Free' },
      'reserved': { color: 'orange', text: 'Reserved' },
      'in-use': { color: 'red', text: 'In Use' },
    };
    
    const { color, text } = config[status];
    return <Tag color={color}>{text}</Tag>;
  };

  const columns: ColumnsType<Port> = [
    {
      title: 'Port',
      dataIndex: 'number',
      key: 'number',
      sorter: (a, b) => a.number - b.number,
      defaultSortOrder: 'ascend',
      width: 100,
    },
    {
      title: 'Project',
      dataIndex: 'projectName',
      key: 'projectName',
      sorter: (a, b) => (a.projectName || '').localeCompare(b.projectName || ''),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      sorter: (a, b) => (a.description || '').localeCompare(b.description || ''),
      render: (text) => text || '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: getStatusTag,
      sorter: (a, b) => a.status.localeCompare(b.status),
      filters: [
        { text: 'Free', value: 'free' },
        { text: 'Reserved', value: 'reserved' },
        { text: 'In Use', value: 'in-use' },
      ],
      onFilter: (value, record) => record.status === value,
      width: 120,
    },
    {
      title: 'PID',
      key: 'pid',
      width: 100,
      sorter: (a, b) => {
        const aPid = activePorts.find(p => p.number === a.number)?.pid || 0;
        const bPid = activePorts.find(p => p.number === b.number)?.pid || 0;
        return aPid - bPid;
      },
      render: (_, record) => {
        const activePort = activePorts.find(p => p.number === record.number);
        return activePort?.pid || '-';
      },
    },
    {
      title: 'Reserved At',
      dataIndex: 'reservedAt',
      key: 'reservedAt',
      render: (date) => date ? new Date(date).toLocaleString() : '-',
      sorter: (a, b) => new Date(a.reservedAt || 0).getTime() - new Date(b.reservedAt || 0).getTime(),
      width: 180,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          {record.status === 'in-use' && (
            <Popconfirm
              title="Kill process?"
              description={`Are you sure you want to kill the process on port ${record.number}?`}
              onConfirm={() => handleKill(record.number)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button 
                size="small" 
                danger 
                icon={<StopOutlined />}
              >
                Kill
              </Button>
            </Popconfirm>
          )}
          <Popconfirm
            title="Release port?"
            description={`Are you sure you want to release port ${record.number}?`}
            onConfirm={() => handleRelease(record.number)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              size="small" 
              icon={<DeleteOutlined />}
            >
              Release
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const rowSelection: TableRowSelection<Port> = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const hasSelected = selectedRowKeys.length > 0;

  return (
    <Card>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Space style={{ justifyContent: 'space-between', width: '100%' }}>
          <Space>
            <Search
              placeholder="Search by project name"
              onSearch={(value) => setFilter({ ...filter, projectName: value })}
              style={{ width: 300 }}
              allowClear
              prefix={<SearchOutlined />}
            />
            <Select
              placeholder="Filter by status"
              style={{ width: 150 }}
              allowClear
              onChange={(value) => setFilter({ ...filter, status: value })}
            >
              <Option value="reserved">Reserved</Option>
              <Option value="in-use">In Use</Option>
              <Option value="free">Free</Option>
            </Select>
          </Space>
          {hasSelected && (
            <Space>
              <span style={{ marginRight: 8 }}>
                {`Selected ${selectedRowKeys.length} ports`}
              </span>
              <Popconfirm
                title="Release selected ports?"
                description={`Are you sure you want to release ${selectedRowKeys.length} ports?`}
                onConfirm={handleBulkRelease}
                okText="Yes"
                cancelText="No"
              >
                <Button danger icon={<DeleteOutlined />}>
                  Release Selected
                </Button>
              </Popconfirm>
              <Popconfirm
                title="Kill processes?"
                description={`Are you sure you want to kill processes on selected ports?`}
                onConfirm={handleBulkKill}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ danger: true }}
              >
                <Button danger icon={<StopOutlined />}>
                  Kill Selected
                </Button>
              </Popconfirm>
            </Space>
          )}
        </Space>

        <Table
          columns={columns}
          dataSource={ports}
          rowKey="number"
          loading={isLoading}
          rowSelection={rowSelection}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} ports`,
          }}
          scroll={{ x: 1000 }}
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

export default Dashboard;