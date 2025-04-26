export interface Comment {
    commentId?: number;
    content: string;
    createdAt: Date;
    postId: number;
    userId: number;
    userName?: string;
    user?:{
        firstName?: string;
        lastName?: string;
        id?: number;
    }
}