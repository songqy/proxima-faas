import Px, {
  renderApp,
  useState,
  useEffect,
  Button,
  Space,
  Text,
  Table,
} from './px';
import { fetch } from './api';
import useTableData from './useTableData';

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

  const { data, columns, appendData } = useTableData();

  const renderTable = () => (
    <Table
      columns={columns}
      dataSource={data}
      pagination={{ showSizeChanger: true }}
    />
  );

  const fb = async () => {
    setB('fb111111 bbbbbb');
    setA(91);
    setA(92);
    const res = await fetch();
    setA(res);
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
    const res = await fetch();
    setC({ c1: res });
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
        <Button type="primary" onClick={appendData}>
          添加table数据
        </Button>
      </Space>
      {renderTable()}
    </>
  );
};

export default renderApp(<App />);
