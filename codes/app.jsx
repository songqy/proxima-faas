import Px, { renderApp, useState, useEffect } from './px';

const Button = 'Button';
const Space = 'Space';
const Text = 'Text';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const initA = async () => {
  await sleep(300);
  return 136;
};

// 自定义Hook
const useAppHook = () => {
  const [d, setD] = useState(0);

  const increaseD = () => {
    setD((d) => d + 1);
  };

  return { d, increaseD };
};

const App = () => {
  const [a, setA] = useState(initA);
  const [b, setB] = useState('abc');
  const [c, setC] = useState({ c1: 2 });

  const { d, increaseD } = useAppHook();

  const fb = () => {
    setA(99);
    setB('fb111111 bbbbbb');
  };

  const fb2 = () => {
    setA(854);
    setB('fb222222 bbbbbb');
  };

  const fb3 = () => {
    setC({ c1: 9 });
  };

  log('render', a, b, c, d);

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
      <Text>d:{d}</Text>
      <Space>
        <Button type="primary" onClick={fb}>
          btn1
        </Button>
        <Button type="dashed" onClick={fb2}>
          btn2
        </Button>
        <Button type="primary" onClick={fb3}>
          btn3
        </Button>
        <Button type="primary" onClick={increaseD}>
          increaseD
        </Button>
      </Space>
    </>
  );
};

export default renderApp(<App />);
