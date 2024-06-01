export default interface MyReview {
    reviewNumber: number;
    userId: string;
    itemSeq: string;
    content: string;
    reviewImageList: string[];
    writeDatetime: string;
    helpfulCount: number;
    starRating: number;
}