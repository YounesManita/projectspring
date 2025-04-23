package tn.esprit.service;

import tn.esprit.entity.BlogPost;

import java.util.List;

public interface IBlogPostService {
    List<BlogPost> getAllPosts();
    BlogPost getPostById(Long id);
    BlogPost createPost(BlogPost post, Long user_id) throws Exception;
    BlogPost updatePost(Long id, BlogPost updatedPost);
    void deletePost(Long id);


    List<BlogPost> getPostsByUserId(Long userId);
}
