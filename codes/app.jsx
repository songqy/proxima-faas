import Px, { renderApp, useState, useEffect } from './px';

const Button = 'Button';
const Space = 'Space';
const Text = 'Text';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const App = () => {
  const [a, setA] = useState(2);
  const [b, setB] = useState('abc');
  const fb = () => {
    console.log('fb', a, b);
    setA(99);
    setB('fb111111 bbbbbb');
  };

  const fb2 = () => {
    console.log('fb2', a, b);
    setA(854);
    setB('fb222222 bbbbbb');
  };

  log('render', a, b);

  useEffect(async () => {
    log('useEffect');
    await sleep(20);
    setA(4321);
  }, [b]);

  return (
    <>
      <Text>this is a text</Text>
      <Text>a:{a}</Text>
      <Text>b:{b}</Text>
      <Space>
        <Button type="primary" onClick={fb}>
          btn1
        </Button>
        <Button type="dashed" onClick={fb2}>
          btn2
        </Button>
      </Space>
    </>
  );
};

export default renderApp(<App />);
