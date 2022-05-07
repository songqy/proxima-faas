import NebulaUI, {
  renderApp,
  useState,
  useEffect,
  Button,
  Space,
  Text,
  SearchInput,
} from '@nebulare/ui';
import { fetch } from '@nebulare/api';
import User from './components/User';
import { cloneDeep } from 'lodash-es';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
  const [b, setB] = useState(() => 'abc');
  const [c, setC] = useState({});

  const { d, increaseD } = useAppHook();

  const fb = async () => {
    setB('fb111111 bbbbbb');
    setA(91);
    setA(92);
    const res: any = await fetch('http://127.0.0.1:4000/test-api', {
      method: 'post',
      json: {
        time: Date.now(),
      },
    });
    setA(res.time);
  };

  const fb2 = () => {
    setA(854);
    setB('fb222222 bbbbbb');
  };

  const fb3 = () => {
    setC({ c1: 9 });
  };

  const fb4 = () => {
    console.warn('fb4 error');
    throw new Error('fb4 error');
  };

  // console.log('render', a, b, c, d);

  useEffect(async () => {
    const res: any = await fetch('http://127.0.0.1:4000/test-api');
    // setC({ c1: res });
    setC(cloneDeep(res));
  }, [b]);

  return (
    <>
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
        <Button type="primary" onClick={fb4}>
          点击抛出异常
        </Button>
        <Button type="primary" onClick={increaseD}>
          increaseD
        </Button>
      </Space>
      <Text style={{ margin: '10px 0' }}>
        {/* 使用自定义组件 */}
        <User count={d} />
      </Text>
      <SearchInput
        onSearch={(val) => {
          console.log('search:', val);
        }}
      />
    </>
  );
};

export default renderApp(<App />);
