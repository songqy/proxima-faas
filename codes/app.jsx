import Px, { renderApp, useState, useEffect } from './px';

const Button = 'Button';
const Space = 'Space';
const Text = 'Text';
const Table = 'Table';

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

const useTableData = () => {
  const [data, setData] = useState([
    {
      key: 1,
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
    },
    {
      key: 2,
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号',
    },
  ]);

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '住址',
      dataIndex: 'address',
      key: 'address',
    },
  ];

  const appendData = () => {
    setData((d) => {
      const len = d.length;
      const newObj = {
        key: len + 1,
        name: '胡彦斌',
        age: 32,
        address: '西湖区湖底公园1号',
      };
      return [...d, newObj];
    });
  };

  return { columns, data, appendData };
};

const App = () => {
  const [a, setA] = useState(initA);
  const [b, setB] = useState('abc');
  const [c, setC] = useState({ c1: 2 });

  const { d, increaseD } = useAppHook();
  const { columns, data, appendData } = useTableData();

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
        <Button type="primary" onClick={appendData}>
          添加table数据
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ showSizeChanger: true }}
      />
    </>
  );
};

export default renderApp(<App />);
