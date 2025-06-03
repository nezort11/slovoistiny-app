// like encodeURIComponent but specifically for search params corder cases
// "!" = "%21"
// " " = "+"
export const encodeSearchParam = (value: string) => {
  return new URLSearchParams({ [""]: value }).toString().slice(1);
};

// like new URLSearchParams({ key: value }).toString() but without encoding values
export const buildSearchParams = (params: Record<string, string>) => {
  return Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${value}`)
    .join("&");
};
