package tn.esprit.service;

import org.springframework.beans.factory.annotation.Autowired;
import tn.esprit.entity.BlogComment;
import tn.esprit.entity.BlogPost;
import tn.esprit.entity.User;
import tn.esprit.repository.BlogCommentRepository;
import tn.esprit.repository.BlogPostRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.repository.UserRepository;

import java.util.List;

@Service
@AllArgsConstructor
public class BlogCommentService implements IBlogCommentService {

    private final BlogCommentRepository blogCommentRepository;
    private final BlogPostRepository blogPostRepository;
    @Autowired
    private final UserRepository userRepository;

    @Override
    public List<BlogComment> getAllComments() {
        return blogCommentRepository.findAll();
    }

    @Override
    public BlogComment getCommentById(Long id) {
        return blogCommentRepository.findById(id).orElse(null);
    }

    @Override
    public List<BlogComment> getCommentsByPostId(Long postId) {
        return blogCommentRepository.findByBlogPost_PostId(postId);
    }

    @Override
    public BlogComment createComment(Long postId, BlogComment comment,Long userId) {
        User dataOfUSer = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("BlogPost not found"));
        BlogPost blogPost = blogPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("BlogPost not found"));
        comment.setUser(dataOfUSer);
        comment.setBlogPost(blogPost);
        return blogCommentRepository.save(comment);
    }

    @Override
    public BlogComment updateComment(Long id, BlogComment updatedComment) {
        BlogComment existingComment = blogCommentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        existingComment.setContent(updatedComment.getContent());
        return blogCommentRepository.save(existingComment);
    }

    @Override
    public void deleteComment(Long id) {
        BlogComment comment = blogCommentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        blogCommentRepository.delete(comment);
    }

    @Override
    public List<BlogComment> getCommentsByUserId(Long userId) {
        return blogCommentRepository.findByUserId(userId);
    }
}
