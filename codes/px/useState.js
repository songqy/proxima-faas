import reconcilerState from './reconcilerState';

const updateQueue = [];

// state的批量更新
const batchUpdate = (len) => {
  if (len !== updateQueue.length) return;
  const { hooks } = reconcilerState;
  while (updateQueue.length !== 0) {
    const { index, payload } = updateQueue.shift();
    let newVal = payload;
    if (typeof payload === 'function') {
      newVal = payload(hooks[index]);
    }
    hooks[index] = newVal;
  }
  // 触发一次render
  reconcilerState.enqueueEffect(() => {
    // console.log('setState');
  });
};

const enqueueUpdate = async (index, payload) => {
  updateQueue.push({
    index,
    payload,
  });
  const len = updateQueue.length;
  await Promise.resolve();
  batchUpdate(len);
};

const useState = (initialValue) => {
  const { currentIndex, effectType, hooks } = reconcilerState;
  if (effectType === 'initial') {
    if (typeof initialValue === 'function') {
      reconcilerState.enqueueEffect(async () => {
        const val = await initialValue();
        hooks[currentIndex] = val;
      });
    } else {
      hooks[currentIndex] = initialValue;
    }
  }
  reconcilerState.currentIndex++;
  return [
    hooks[currentIndex],
    (payload) => {
      enqueueUpdate(currentIndex, payload);
    },
  ];
};

export default useState;
