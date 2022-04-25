import Px, { Input, useState, Space, Text } from '../px';

const CustomInput = () => {
  const [text, setText] = useState('');
  const handleChange = (val: string) => {
    setText(val);
  };
  return (
    <Space>
      <Text style={{ width: 360 }}>
        <Input onChange={handleChange} debounceParams={[500]} />
      </Text>
      <Text>Text:{text}</Text>
    </Space>
  );
};

export default CustomInput;
