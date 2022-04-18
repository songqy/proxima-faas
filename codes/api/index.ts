type Fetch = () => void;

// @ts-ignore
export const fetch = global.fetch as Fetch;
