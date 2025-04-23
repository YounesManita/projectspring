package tn.esprit.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.entity.BlogCommentResponse;

import java.util.List;

@Repository
public interface BlogCommentResponseRepository extends JpaRepository<BlogCommentResponse, Long> {
    // Méthode pour récupérer toutes les réponses d'un commentaire spécifique
    List<BlogCommentResponse> findByBlogComment_CommentId(Long commentId);

    // Méthode pour récupérer toutes les réponses d'un utilisateur spécifique
    List<BlogCommentResponse> findByUserId(Long userId);
}
