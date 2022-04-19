import reconcilerState from './reconcilerState';
import type { ElementData } from './interface';

const events = ['onClick', 'onChange'];

const _processElement = async (ele, getEventName, action) => {
  const { type, props } = ele;
  const obj = typeof type === 'function' ? type(props) : ele;

  if (obj.props?.children?.length) {
    const childrens = [];
    for (const item of obj.props.children) {
      if (typeof item === 'object') {
        const result = await _processElement(item, getEventName, action);
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
      const name = getEventName(event);
      if (name === action?.name) {
        await dispatch(...action.payload);
      }
      actions.push({
        event,
        name,
      });
    }
  }
  if (actions.length > 0) {
    obj.props.actions = actions;
  }

  return obj;
};

const processElement = async (ele: ElementData, action?: string) => {
  const { type, props } = ele;
  const obj = typeof type === 'function' ? type(props) : ele;

  let count = 0;
  const getEventName = (event) => {
    return `${event}.${count++}`;
  };
  return await _processElement(obj, getEventName, action);
};

interface RenderBody {
  state?: string;
  action?: string;
}

const renderApp =
  (ele: ElementData) =>
  async ({ state, action }: RenderBody = {}) => {
    // console.log(ele);
    reconcilerState.reset(state ? JSON.parse(state) : null);
    let res = await processElement(ele, action);
    reconcilerState.effectType = 'effect';

    log('renderApp');

    while (reconcilerState.effects.length !== 0) {
      reconcilerState.resetCurrentIndex();
      const effect = reconcilerState.shiftEffect();
      await effect();
      res = await processElement(ele);
    }

    return {
      ele: res,
      state: reconcilerState.stateData,
    };
  };

export default renderApp;
