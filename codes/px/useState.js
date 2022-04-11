import reconcilerState from './reconcilerState';

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
      let newVal = payload;
      if (typeof payload === 'function') {
        newVal = payload(hooks[currentIndex]);
      }
      hooks[currentIndex] = newVal;
      // 强制触发render
      reconcilerState.enqueueEffect(() => {
        console.log('setState');
      });
    },
  ];
};

export default useState;
