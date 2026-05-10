const IS_BROWSER = typeof window !== 'undefined';
const IS_SERVER = !IS_BROWSER;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

const DISCLAIMER_STORAGE_KEY = 'disclaimer-agreed';
const ADS_WARNING_STORAGE_KEY = 'ads-warning-seen';
const LIBRARY_STORAGE_KEY = 'mostream-lib';
const SEARCH_HISTORY_STORAGE_KEY = 'mostream-search-histories';

const ITEMS_PER_PAGE = 20;

const SpacingClasses = {
  main: 'px-4 py-6 sm:px-8 sm:py-8',
  reset: '-mx-4 -my-6 sm:-mx-8 sm:-my-8',
};

export {
  IS_BROWSER,
  IS_SERVER,
  IS_PRODUCTION,
  IS_DEVELOPMENT,
  DISCLAIMER_STORAGE_KEY,
  ADS_WARNING_STORAGE_KEY,
  LIBRARY_STORAGE_KEY,
  SEARCH_HISTORY_STORAGE_KEY,
  ITEMS_PER_PAGE,
  SpacingClasses,
};
