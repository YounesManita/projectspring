package tn.esprit.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.entity.BlogPost;

import java.util.List;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {
    // Méthode pour récupérer tous les posts d'un utilisateur spécifique
    List<BlogPost> findByUserId(Long userId);
}
