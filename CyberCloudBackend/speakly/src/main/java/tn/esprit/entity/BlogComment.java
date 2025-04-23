package tn.esprit.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class BlogComment implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long commentId;


    private String content;

    @ManyToOne
    @JoinColumn(name = "postId", nullable = false)
    @JsonIgnore
    private BlogPost blogPost;

    @OneToMany(mappedBy = "blogComment", cascade = CascadeType.ALL, orphanRemoval = true)

    private List<BlogCommentResponse> responses;


    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false, updatable = false)
    private Date createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = new Date();
    }

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

}

