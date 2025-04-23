package tn.esprit.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.entity.BlogPost;
import tn.esprit.entity.User;
import tn.esprit.exception.ResourceNotFoundException;
import tn.esprit.repository.BlogPostRepository;
import tn.esprit.repository.UserRepository;
import tn.esprit.service.IBlogPostService;

import java.io.IOException;
import java.util.List;

@Service
public class BlogPostService implements IBlogPostService {


    @Autowired
    private BlogPostRepository blogPostRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    public List<BlogPost> getAllPosts() {
        return blogPostRepository.findAll();
    }

    @Override
    public BlogPost getPostById(Long id) {
        return blogPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("BlogPost not found with id: " + id));
    }

    @Override
    public BlogPost createPost(BlogPost post,Long user_id) throws Exception {
        User dataOfUSer=userRepository.findById(user_id).orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + user_id));
        post.setUser(dataOfUSer);
        return blogPostRepository.save(post);
    }

    @Override
    public BlogPost updatePost(Long id, BlogPost updatedPost) {
        BlogPost existingPost = getPostById(id);
        existingPost.setTitle(updatedPost.getTitle());
        existingPost.setContent(updatedPost.getContent());
        existingPost.setReaction(updatedPost.getReaction());
        return blogPostRepository.save(existingPost);
    }

    @Override
    public void deletePost(Long id) {
        BlogPost post = getPostById(id);
        blogPostRepository.delete(post);
    }

    @Override
    public List<BlogPost> getPostsByUserId(Long userId) {
        return blogPostRepository.findByUserId(userId);
    }
}

