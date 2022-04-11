import reconcilerState from './reconcilerState';

const events = ['onClick', 'onChange'];

const _processElement = async (obj, getEventName, action) => {
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
        // dispatch,
      });
    }
  }
  obj.props.actions = actions;

  return obj;
};

const processElement = async (ele, action) => {
  const { type, props } = ele;
  const obj = type(props);

  let count = 0;
  const getEventName = (event) => {
    return `${event}.${count++}`;
  };
  return await _processElement(obj, getEventName, action);
};

const renderApp =
  (ele) =>
  async ({ state, action } = {}) => {
    // console.log(ele);
    reconcilerState.reset(state ? JSON.parse(state) : null);
    let res = await processElement(ele, action);
    reconcilerState.effectType = 'effect';

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
