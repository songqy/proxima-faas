import reconcilerState from './reconcilerState';

const createElement = (type, props, ...children) => {
  return {
    type,
    props: {
      ...props,
      children,
    },
  };
};

export const Fragment = 'Fragment';

const getAction = (eleObj, actionCount) => {
  let count = 0;
  const _getA = (obj) => {
    if (obj?.props?.onClick) {
      if (count === actionCount) {
        return obj.props.onClick;
      }
      count++;
    }
    if (obj?.props?.children?.length) {
      for (let i = 0; i < obj.props.children.length; ++i) {
        const action = _getA(obj.props.children[i]);
        if (action) return action;
      }
    }
    return undefined;
  };
  return _getA(eleObj);
};

const parseAction = (eleObj) => {
  let count = 0;
  const _parse = (obj) => {
    if (obj.props?.children?.length) {
      obj.props.children = obj.props.children.map((v) => {
        if (typeof v === 'object') {
          return _parse(v);
        }
        return v;
      });
    }
    if (obj.props.onClick) {
      obj.props.onClick = `action.${count++}`;
    }
    return obj;
  };
  return _parse(eleObj);
};

export const renderApp =
  (ele) =>
  async ({ state, action }) => {
    // console.log(ele);
    const actions = action?.split('.');
    reconcilerState.reset(state ? JSON.parse(state) : null);
    const { type, props } = ele;
    let res = type(props);
    reconcilerState.setEffectType('effect');

    if (actions?.length >= 2) {
      const actionFun = getAction(res, +actions[1]);
      if (actionFun) {
        await actionFun();
      }
    }

    while (reconcilerState.getEffects().length !== 0) {
      reconcilerState.resetCurrentIndex();
      const effect = reconcilerState.shiftEffect();
      await effect();
      res = type(props);
    }

    return {
      ele: parseAction(res),
      state: reconcilerState.getStateData(),
    };
  };

export default { createElement, Fragment };
export { default as useState } from './useState';
export { default as useEffect } from './useEffect';
