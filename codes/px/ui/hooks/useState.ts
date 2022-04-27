import reconcilerState from '../reconcilerState';

export type Payload<T> = T | ((val: T) => T) | undefined;

interface UpdateItem {
  index: number;
  payload: Payload<any>;
}

const updateQueue: UpdateItem[] = [];

// state的批量更新
const batchUpdate = (len: number) => {
  if (len !== updateQueue.length) return;
  const { hooks } = reconcilerState;
  while (updateQueue.length !== 0) {
    const { index, payload } = updateQueue.shift()!;
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

const enqueueUpdate = async (index: number, payload: Payload<any>) => {
  updateQueue.push({
    index,
    payload,
  });
  const len = updateQueue.length;
  await Promise.resolve();
  batchUpdate(len);
};

const useState = <T>(
  initialState: T | (() => Promise<T> | (() => T)),
): [T, (payload: Payload<T>) => void] => {
  const { currentIndex, effectType, hooks } = reconcilerState;
  if (effectType === 'initial') {
    if (typeof initialState === 'function') {
      reconcilerState.enqueueEffect(async () => {
        // @ts-ignore
        const val = await initialState();
        hooks[currentIndex] = val;
      });
    } else {
      hooks[currentIndex] = initialState;
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
