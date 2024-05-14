export default interface ReviewListItem {
    reviewNumber: number;
    userId: string;
    itemSeq: string;
    content: string;
    writeDatetime: string;
    helpfulCount: number;
    starRating: number;
    reviewImageList: string[];
}