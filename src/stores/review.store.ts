import { create } from 'zustand';

interface ReviewStore {
    reviewcontent: string;
    starRating:number;
    reviewImageFileList: File[];
    setContent: (reviewcontent: string) => void;
    setStarRating: (starRating: number) => void;
    setReviewImageFileList: (reviewImageFileList: File[]) => void;
    resetReview: () => void;
};

const useReviewStore = create<ReviewStore>(set => ({
    reviewcontent:'',
    starRating:0,
    reviewImageFileList: [],
    setContent: (reviewcontent) => set(state => ({ ...state, reviewcontent})),
    setStarRating: (starRating) => set(state => ({ ...state, starRating})),
    setReviewImageFileList: (reviewImageFileList) => set(state => ({ ...state, reviewImageFileList})),
    resetReview: () => set(state => ({...state, reviewcontent: '', reviewImageFileList: []})),
}))

export default useReviewStore;