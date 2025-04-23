package tn.esprit.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.entity.BlogComment;
import tn.esprit.entity.BlogCommentResponse;
import tn.esprit.entity.User;
import tn.esprit.repository.BlogCommentRepository;
import tn.esprit.repository.BlogCommentResponseRepository;
import tn.esprit.repository.UserRepository;

import java.util.List;
@Service
@RequiredArgsConstructor
public class BlogCommentResponseService implements IBlogCommentResponseService {

    private final BlogCommentResponseRepository blogCommentResponseRepository;
    private final BlogCommentRepository blogCommentRepository;
    @Autowired private UserRepository userRepository;

    @Override
    public List<BlogCommentResponse> getAllResponses() {
        return blogCommentResponseRepository.findAll();
    }

    @Override
    public BlogCommentResponse getResponseById(Long id) {
        return blogCommentResponseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Response not found with id: " + id));
    }

    @Override
    public BlogCommentResponse createResponse(Long commentId, BlogCommentResponse response,Long user_id) {
        User datOfUSer = userRepository.findById(user_id)
                .orElseThrow(() -> new RuntimeException("BlogComment not found with id: " + user_id));
        BlogComment blogComment = blogCommentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("BlogComment not found with id: " + commentId));
response.setUser(datOfUSer);
        response.setBlogComment(blogComment);  // Lier la réponse au commentaire spécifique
        return blogCommentResponseRepository.save(response);
    }

    @Override
    public BlogCommentResponse updateResponse(Long id, BlogCommentResponse updatedResponse) {
        return blogCommentResponseRepository.findById(id)
                .map(response -> {
                    response.setContent(updatedResponse.getContent());
                    return blogCommentResponseRepository.save(response);
                })
                .orElseThrow(() -> new RuntimeException("Response not found with id: " + id));
    }

    @Override
    public void deleteResponse(Long id) {
        blogCommentResponseRepository.deleteById(id);
    }

    @Override
    public List<BlogCommentResponse> getResponsesByCommentId(Long commentId) {
        return blogCommentResponseRepository.findByBlogComment_CommentId(commentId);
    }

    @Override
    public List<BlogCommentResponse> getResponsesByUserId(Long userId) {
        return blogCommentResponseRepository.findByUserId(userId);
    }
}
