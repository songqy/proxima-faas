import reconcilerState from './reconcilerState';
import type { EffectFun } from './interface';

const useEffect = (fun: EffectFun, deps: any[]) => {
  const { currentIndex, hooks, effectType } = reconcilerState;
  reconcilerState.currentIndex++;
  if (effectType === 'initial') {
    hooks[currentIndex] = deps;
    reconcilerState.enqueueEffect(fun);
  } else {
    const prevDeps = hooks[currentIndex];
    for (let i = 0; i < deps.length; ++i) {
      if (deps[i] !== prevDeps[i]) {
        reconcilerState.enqueueEffect(fun);
        break;
      }
    }
    hooks[currentIndex] = deps;
  }
};

export default useEffect;
