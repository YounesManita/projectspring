export interface BlogComment {
  commentId: number;
  userId: number;
  content: string;
  createdAt: Date;
}

export enum Reaction {
  LIKE = 'LIKE',
  HAHA = 'HAHA',
  SAD = 'SAD',
  LOVE = 'LOVE',
  ANGRY = 'ANGRY',
  DISLIKE = 'DISLIKE'
}

export interface Image {
  imageId: number;
  url: string;
  description: string;
  orderIndex: number;
}

export interface BlogPost {
  postId: number;
  userId: number | null;
  title: string;
  content: string;
  reaction: Reaction | null;
  comments?: BlogComment[];
  images?: Image[];
  createdAt: Date;
  user:{
    firstName: string;
    lastName: string;
    id?: number;
  }
}
  
  
    