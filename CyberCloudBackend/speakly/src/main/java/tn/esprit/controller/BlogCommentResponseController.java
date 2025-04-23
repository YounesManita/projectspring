package tn.esprit.controller;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tn.esprit.entity.BlogCommentResponse;
import tn.esprit.service.IBlogCommentResponseService;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("blogcommentresponses")
public class BlogCommentResponseController {

    private final IBlogCommentResponseService blogCommentResponseService;

    @PostMapping("add/{commentId}/{user_id}")
    public BlogCommentResponse addResponse(@PathVariable Long commentId, @RequestBody BlogCommentResponse response,@PathVariable Long user_id) {
        return blogCommentResponseService.createResponse(commentId, response,user_id);
    }

    @PutMapping("update/{id}")
    public BlogCommentResponse updateResponse(@PathVariable Long id, @RequestBody BlogCommentResponse updatedResponse) {
        return blogCommentResponseService.updateResponse(id, updatedResponse);
    }

    @GetMapping("get/{id}")
    public BlogCommentResponse retrieveResponse(@PathVariable Long id) {
        return blogCommentResponseService.getResponseById(id);
    }

    @DeleteMapping("delete/{id}")
    public void deleteResponse(@PathVariable Long id) {
        blogCommentResponseService.deleteResponse(id);
    }

    @GetMapping("all")
    public List<BlogCommentResponse> getAllResponses() {
        return blogCommentResponseService.getAllResponses();
    }

    @GetMapping("comment/{commentId}")
    public List<BlogCommentResponse> getResponsesByCommentId(@PathVariable Long commentId) {
        return blogCommentResponseService.getResponsesByCommentId(commentId);
    }

    @GetMapping("user/{userId}")
    public List<BlogCommentResponse> getResponsesByUserId(@PathVariable Long userId) {
        return blogCommentResponseService.getResponsesByUserId(userId);
    }
}

