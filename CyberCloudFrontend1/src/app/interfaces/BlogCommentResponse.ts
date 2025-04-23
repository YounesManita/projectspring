export interface BlogCommentResponse {
    responseId?: number;
    content: string;
    createdAt: Date;
    commentId: number;
    userId: number;
    userName?: string;
}