import reconcilerState from './reconcilerState';

const useEffect = (fun, deps) => {
  return reconcilerState.useEffect(fun, deps);
};

export default useEffect;
