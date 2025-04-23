package tn.esprit.service;

import tn.esprit.entity.BlogComment;

import java.util.List;

public interface IBlogCommentService {
    List<BlogComment> getAllComments();
    List<BlogComment> getCommentsByPostId(Long postId);
    BlogComment getCommentById(Long id);
    BlogComment createComment(Long postId, BlogComment comment,Long user_id);
    BlogComment updateComment(Long id, BlogComment updatedComment);
    void deleteComment(Long id);


    List<BlogComment> getCommentsByUserId(Long userId);
}

