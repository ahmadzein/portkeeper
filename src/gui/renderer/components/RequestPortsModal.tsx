import React, { useState } from 'react';
import { Modal, Form, InputNumber, Input, Radio, Select, Space, Button, Tag, message, Alert, Slider } from 'antd';
import { usePortStore } from '@store/portStore';

interface RequestPortsModalProps {
  visible: boolean;
  onClose: () => void;
}

const RequestPortsModal: React.FC<RequestPortsModalProps> = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const { refreshPorts } = usePortStore();
  const [loading, setLoading] = useState(false);
  const [previewPorts, setPreviewPorts] = useState<string>('');

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const options = {
        count: values.count,
        projectName: values.projectName,
        description: values.description,
        tags: values.tags,
        sequential: values.mode === 'sequential',
        startPort: values.portRange[0],
        endPort: values.portRange[1],
        avoid: values.avoid ? values.avoid.split(',').map((p: string) => parseInt(p.trim(), 10)) : undefined,
      };

      const result = await window.portManager.port.request(options);
      
      message.success(result.summary);
      
      // Show detailed result
      const portNumbers = result.ports.map(p => p.number).join(', ');
      message.info(`Reserved ports: ${portNumbers}`, 5);
      
      await refreshPorts();
      form.resetFields();
      onClose();
    } catch (error) {
      message.error(`Failed to request ports: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setPreviewPorts('');
    onClose();
  };

  const updatePreview = () => {
    const count = form.getFieldValue('count') || 1;
    const mode = form.getFieldValue('mode') || 'sequential';
    const range = form.getFieldValue('portRange') || [3000, 9999];
    
    if (mode === 'sequential') {
      const ports = [];
      for (let i = 0; i < Math.min(count, 5); i++) {
        ports.push(range[0] + i);
      }
      const preview = ports.join(', ');
      setPreviewPorts(count > 5 ? `${preview}, ...` : preview);
    } else {
      setPreviewPorts('Random ports will be selected');
    }
  };

  return (
    <Modal
      title="Request Available Ports"
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={600}
      okText="Request Ports"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          count: 1,
          mode: 'sequential',
          portRange: [3000, 9999],
        }}
        onValuesChange={updatePreview}
      >
        <Form.Item
          name="count"
          label="Number of Ports"
          rules={[
            { required: true, message: 'Please enter number of ports' },
            { type: 'number', min: 1, max: 100, message: 'Must be between 1 and 100' },
          ]}
        >
          <InputNumber min={1} max={100} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="projectName"
          label="Project Name"
          rules={[{ required: true, message: 'Please enter project name' }]}
        >
          <Input placeholder="e.g., microservices, dev-stack" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description (Optional)"
        >
          <Input.TextArea rows={2} placeholder="Brief description of port usage" />
        </Form.Item>

        <Form.Item
          name="tags"
          label="Tags (Optional)"
        >
          <Select
            mode="tags"
            placeholder="Add tags (press Enter)"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          name="mode"
          label="Selection Mode"
        >
          <Radio.Group>
            <Radio value="sequential">Sequential (e.g., 3000, 3001, 3002)</Radio>
            <Radio value="random">Random (scattered across range)</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="portRange"
          label="Port Range"
        >
          <Slider
            range
            min={1024}
            max={65535}
            marks={{
              1024: '1024',
              3000: '3000',
              8000: '8000',
              9999: '9999',
              65535: '65535',
            }}
            tooltip={{ formatter: (value) => `Port ${value}` }}
          />
        </Form.Item>

        <Form.Item
          name="avoid"
          label="Additional Ports to Avoid (Optional)"
          help="Comma-separated port numbers"
        >
          <Input placeholder="e.g., 8080, 8081, 8082" />
        </Form.Item>

        {previewPorts && (
          <Alert
            message="Preview"
            description={`Example ports: ${previewPorts}`}
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Alert
          message="Common ports automatically avoided"
          description="80 (HTTP), 443 (HTTPS), 3306 (MySQL), 5432 (PostgreSQL), 27017 (MongoDB), 6379 (Redis)"
          type="warning"
          showIcon
        />
      </Form>
    </Modal>
  );
};

export default RequestPortsModal;