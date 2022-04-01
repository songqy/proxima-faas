import reconcilerState from './reconcilerState';

const useState = (initialValue) => {
  return reconcilerState.useState(initialValue);
};

export default useState;
