export const MAIN_PATH = () =>'/';
export const SIGN_IN_PATH = () => '/auth/signin';
export const SIGN_UP_PATH = () => '/auth/signup';
export const USER_PATH = (userId: string) => `/user/${userId}`;
export const USER_UPDATE = (userId: string) => `/user/update/${userId}`;
export const MY_REVIEW = (userId: string) => `/user/review/${userId}`;
export const MEDICINE_SEARCH_PATH = () => '/medicine';
export const SEARCH_PATH = (searchWord: string) => `/medicine/search/${searchWord}`;
export const MEDICINE_LOCATIONS_STORE_PATH = (searchWord: string) => `/medicine/store/${searchWord}`
export const MEDICINE_DETAIL_PATH = (ITEM_SEQ: string) => `/medicine/detail/${ITEM_SEQ}`;
export const MEDICINE_STORE_PATH = () => '/medicine/store';