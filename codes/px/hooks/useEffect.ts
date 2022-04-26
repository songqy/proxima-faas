import reconcilerState from '../reconcilerState';
import type { EffectCallback, DependencyList } from '../interface';

const useEffect = (effect: EffectCallback, deps?: DependencyList) => {
  const { currentIndex, hooks, effectType } = reconcilerState;
  if (!deps) {
    reconcilerState.enqueueEffect(effect);
  } else {
    if (effectType === 'initial') {
      reconcilerState.enqueueEffect(effect);
    } else {
      const prevDeps = hooks[currentIndex];
      // 浅比较
      for (let i = 0; i < deps.length; ++i) {
        if (deps[i] !== prevDeps[i]) {
          reconcilerState.enqueueEffect(effect);
          break;
        }
      }
    }
    hooks[currentIndex] = deps;
  }
  reconcilerState.currentIndex++;
};

export default useEffect;
