export default interface Review {
    reviewNumber: number;
    userId: string;
    itemSeq: string;
    content: string;
    writeDatetime: string;
    starRating: number;
    reviewImageList: string[];
}