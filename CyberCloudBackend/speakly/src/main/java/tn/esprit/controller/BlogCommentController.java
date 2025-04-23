package tn.esprit.controller;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tn.esprit.entity.BlogComment;
import tn.esprit.service.IBlogCommentService;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/blogcomments")
public class BlogCommentController {

    private final IBlogCommentService blogCommentService;

    @PostMapping("add/{postId}/{user_id}")
    public BlogComment addComment(@PathVariable Long postId, @RequestBody BlogComment comment,@PathVariable Long user_id) {
        return blogCommentService.createComment(postId, comment,user_id);
    }

    @PutMapping("update/{id}")
    public BlogComment updateComment(@PathVariable Long id, @RequestBody BlogComment updatedComment) {
        return blogCommentService.updateComment(id, updatedComment);
    }

    @GetMapping("get/{id}")
    public BlogComment retrieveComment(@PathVariable Long id) {
        return blogCommentService.getCommentById(id);
    }

    @DeleteMapping("delete/{id}")
    public void deleteComment(@PathVariable Long id) {
        blogCommentService.deleteComment(id);
    }

    @GetMapping("all")
    public List<BlogComment> getAllComments() {
        return blogCommentService.getAllComments();
    }

    @GetMapping("/post/{postId}")
    public List<BlogComment> getCommentsByPostId(@PathVariable Long postId) {
        return blogCommentService.getCommentsByPostId(postId);
    }

    @GetMapping("/user/{userId}")
    public List<BlogComment> getCommentsByUserId(@PathVariable Long userId) {
        return blogCommentService.getCommentsByUserId(userId);
    }
}
