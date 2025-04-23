package tn.esprit.service;

import tn.esprit.entity.BlogCommentResponse;

import java.util.List;

public interface IBlogCommentResponseService {
    List<BlogCommentResponse> getAllResponses();
    BlogCommentResponse getResponseById(Long id);
    BlogCommentResponse createResponse(Long commentId, BlogCommentResponse response,Long user_id);
    BlogCommentResponse updateResponse(Long id, BlogCommentResponse updatedResponse);
    void deleteResponse(Long id);


    List<BlogCommentResponse> getResponsesByCommentId(Long commentId);
    List<BlogCommentResponse> getResponsesByUserId(Long userId);
}

