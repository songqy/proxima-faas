import reconcilerState from '../reconcilerState';
import type { EffectCallback, DependencyList } from '../interface';

const useEffect = (effect: EffectCallback, deps?: DependencyList) => {
  const { currentIndex, hooks, effectType } = reconcilerState;
  reconcilerState.currentIndex++;
  if (effectType === 'initial') {
    hooks[currentIndex] = deps;
    reconcilerState.enqueueEffect(effect);
  } else if (!deps) {
    reconcilerState.enqueueEffect(effect);
  } else {
    const prevDeps = hooks[currentIndex];
    for (let i = 0; i < deps.length; ++i) {
      if (deps[i] !== prevDeps[i]) {
        reconcilerState.enqueueEffect(effect);
        break;
      }
    }
    hooks[currentIndex] = deps;
  }
};

export default useEffect;
