import reconcilerState from './reconcilerState';
import type { ElementData, Action } from './interface';

const events = ['onClick', 'onChange'];

const _processElement = async (
  ele: ElementData,
  getUniqueName: (name: string) => string,
  action?: Action,
) => {
  const { type, props } = ele;
  let key = '';
  let obj;
  if (typeof type === 'function') {
    obj = type(props);
    key = getUniqueName(type.name);
  } else {
    obj = ele;
    key = getUniqueName(type);
  }

  if (obj.props?.children?.length) {
    const childrens = [];
    for (const item of obj.props.children) {
      if (typeof item === 'object') {
        const result = await _processElement(item, getUniqueName, action);
        childrens.push(result);
      } else {
        childrens.push(item);
      }
    }
    obj.props.children = childrens;
  }

  const actions = [];
  for (const event of events) {
    if (obj.props[event]) {
      const dispatch = obj.props[event];
      const name = `${event}.${key}`;
      if (name === action?.name) {
        await dispatch(...(action.payload || []));
      }
      actions.push({
        event,
        name,
      });
    }
  }
  if (actions.length) {
    obj.props.actions = actions;
  }

  obj.props.key = key;

  return obj;
};

const processElement = async (ele: ElementData, action?: Action) => {
  let visitedNames: Record<string, number> = {};
  const getUniqueName = (name: string) => {
    if (!visitedNames[name]) {
      visitedNames[name] = 0;
    }
    return `${name}.${visitedNames[name]++}`;
  };
  return await _processElement(ele, getUniqueName, action);
};

interface RenderBody {
  state?: string;
  action?: Action;
  props?: Record<string, any>;
}

const renderApp =
  (ele: ElementData) =>
  async ({ state, action, props }: RenderBody = {}) => {
    ele.props = { ...ele.props, ...props };
    reconcilerState.reset(state ? JSON.parse(state) : null);
    let latestEle = await processElement(ele, action);
    reconcilerState.effectType = 'effect';

    while (reconcilerState.effects.length !== 0) {
      reconcilerState.resetCurrentIndex();
      const effect = reconcilerState.shiftEffect()!;
      await effect();
      latestEle = await processElement(ele);
    }

    return {
      ele: latestEle,
      state: reconcilerState.stateData,
    };
  };

export default renderApp;
