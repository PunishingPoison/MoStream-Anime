export const parseAsSet = {
  parse: (value: string): Set<string> => {
    if (!value) return new Set();
    return new Set(value.split(',').filter(Boolean));
  },
  serialize: (value: Set<string>): string => {
    if (!value || value.size === 0) return '';
    return Array.from(value).join(',');
  },
  withDefault: (defaultValue: Set<string>) => ({
    parse: (value: string | null): Set<string> => {
      if (value === null) return defaultValue;
      return new Set(value.split(',').filter(Boolean));
    },
    serialize: (value: Set<string>): string => {
      if (!value || value.size === 0) return '';
      return Array.from(value).join(',');
    },
  }),
};
