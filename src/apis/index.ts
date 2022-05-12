const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getUser = async () => {
  await sleep(400);
  return { name: 'name111' };
};

export const getItem = async () => {
  await sleep(300);
  return { id: 111 };
};

export const addTen = async (num: number) => {
  await sleep(200);
  return num + 10;
};
