import { create } from 'zustand';

interface ReviewStore {
    content: string;
    reviewImageFileList: File[];
    setContent: (content: string) => void;
    setReviewImageFileList: (reviewImageFileList: File[]) => void;
    resetReview: () => void;
};

const useReviewStore = create<ReviewStore>(set => ({
    content:'',
    reviewImageFileList: [],
    setContent: (content) => set(state => ({ ...state, content})),
    setReviewImageFileList: (reviewImageFileList) => set(state => ({ ...state, reviewImageFileList})),
    resetReview: () => set(state => ({...state, content: '', reviewImageFileList: []})),
}))

export default useReviewStore;