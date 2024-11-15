const isObject = (item: any): boolean => {
  return item && typeof item === 'object' && !Array.isArray(item);
};

const deepMerge = <T extends Record<string, any>>(
  target: T,
  ...sources: Partial<T>[]
): T => {
  if (!sources.length) return target;

  for (const source of sources) {
    if (isObject(target) && isObject(source)) {
      for (const key in source) {
        if (isObject(source[key])) {
          if (!target[key]) {
            Object.assign(target, { [key]: {} });
          }
          deepMerge(target[key] as T, source[key] as T);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }
  }

  return target;
};

export default deepMerge;
