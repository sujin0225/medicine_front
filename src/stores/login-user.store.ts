import { User } from 'types/interface'
import { create } from 'zustand';

interface LoginUserStore {
    loginUser: User | null;
    setLoginUser: (loginUser: User) => void;
    resetLoginUser: () => void;
};

const useLoginUserStore = create<LoginUserStore>(set => ({
    loginUser:null,
    setLoginUser: (loginUser) => set(state => ({...state, loginUser})),
    resetLoginUser: () => set(state => ({ ...state, loginUser:null}))
}));

// const useLoginUserStore = create<LoginUserStore>(set => ({
//     loginUser: null,
//     setLoginUser: (loginUser) => {
//         console.log('setLoginUser 함수가 호출되었습니다.', loginUser);
//         set(state => ({ ...state, loginUser }));
//     },
//     resetLoginUser: () => {
//         console.log('resetLoginUser 함수가 호출되었습니다.');
//         set(state => ({ ...state, loginUser: null }));
//     }
// }));


export default useLoginUserStore;