type Fetch = () => any;

// @ts-ignore
export const fetch = global.fetch as Fetch;
