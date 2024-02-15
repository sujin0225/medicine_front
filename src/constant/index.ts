export const MAIN_PATH = () =>'/';
export const SIGN_IN_PATH = () => '/auth/signin';
export const SIGN_UP_PATH = () => '/auth/signup';
export const USER_PATH = (userId: string) => `/user/${userId}`;
export const MEDICINE_SEARCH_PATH = () => '/medicine';
export const SEARCH_PATH = (searchWord: string) => `/medicine/search/${searchWord}`;
export const MEDICINE_DETAIL_PATH = (ITEM_SEQ: string) => `/medicine/detail/${ITEM_SEQ}`;