import NebulaUI, { Input, useState, Space, Text } from '@nebula/ui';

const CustomInput = () => {
  const [text, setText] = useState('');
  const handleChange = (val: string) => {
    setText(val);
  };
  return (
    <Space>
      <Text style={{ width: 360 }}>
        <Input onChange={handleChange} debounceParams={{ wait: 500 }} />
      </Text>
      <Text>Text:{text}</Text>
    </Space>
  );
};

export default CustomInput;
