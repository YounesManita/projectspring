package tn.esprit.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.entity.BlogComment;
import java.util.List;


@Repository
public interface BlogCommentRepository extends JpaRepository<BlogComment, Long> {
    List<BlogComment> findByBlogPost_PostId(Long postId);

    // Méthode pour récupérer tous les commentaires d'un utilisateur spécifique
    List<BlogComment> findByUserId(Long userId);
}

