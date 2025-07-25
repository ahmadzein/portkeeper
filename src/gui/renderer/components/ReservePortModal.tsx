import React from 'react';
import { Modal, Form, Input, InputNumber, Select, Switch, message } from 'antd';
import { usePortStore } from '@store/portStore';

const { TextArea } = Input;

interface ReservePortModalProps {
  visible: boolean;
  onClose: () => void;
}

const ReservePortModal: React.FC<ReservePortModalProps> = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const { reservePort } = usePortStore();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      await reservePort(values.port, {
        projectName: values.projectName,
        description: values.description,
        tags: values.tags,
        autoRelease: values.autoRelease,
      });

      message.success(`Port ${values.port} reserved successfully!`);
      form.resetFields();
      onClose();
    } catch (error: any) {
      if (error.message) {
        message.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Reserve Port"
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText="Reserve"
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          autoRelease: false,
        }}
      >
        <Form.Item
          name="port"
          label="Port Number"
          rules={[
            { required: true, message: 'Please enter a port number' },
            { type: 'number', min: 1, max: 65535, message: 'Port must be between 1 and 65535' },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="e.g., 3000"
            min={1}
            max={65535}
          />
        </Form.Item>

        <Form.Item
          name="projectName"
          label="Project Name"
          rules={[
            { required: true, message: 'Please enter a project name' },
            { max: 100, message: 'Project name must be less than 100 characters' },
          ]}
        >
          <Input placeholder="e.g., my-react-app" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[
            { max: 500, message: 'Description must be less than 500 characters' },
          ]}
        >
          <TextArea
            placeholder="Optional description of what this port is used for"
            rows={3}
          />
        </Form.Item>

        <Form.Item
          name="tags"
          label="Tags"
          tooltip="Tags help categorize your ports"
        >
          <Select
            mode="tags"
            placeholder="Add tags (press Enter)"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          name="autoRelease"
          label="Auto-release"
          valuePropName="checked"
          tooltip="Automatically release this port when the process stops"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ReservePortModal;