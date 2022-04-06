import Px, { renderApp, useState, useEffect } from './px';

const Button = 'Button';
const Space = 'Space';
const Text = 'Text';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const initA = async () => {
  await sleep(300);
  return 136;
};

const App = () => {
  const [a, setA] = useState(initA);
  const [b, setB] = useState('abc');
  const [c, setC] = useState({ c1: 2 });
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
    setC({ c1: 983 });
  }, [b]);

  return (
    <>
      <Text>this is a text</Text>
      <Text>a:{a}</Text>
      <Text>b:{b}</Text>
      <Text>c:{JSON.stringify(c)}</Text>
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
