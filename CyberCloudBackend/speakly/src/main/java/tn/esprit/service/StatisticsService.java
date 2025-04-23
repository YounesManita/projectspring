package tn.esprit.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.entity.BlogComment;
import tn.esprit.entity.BlogPost;
import tn.esprit.entity.Reaction;
import tn.esprit.repository.BlogCommentRepository;
import tn.esprit.repository.BlogPostRepository;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StatisticsService implements IStatisticsService {

    @Autowired
    private BlogPostRepository blogPostRepository;

    @Autowired
    private BlogCommentRepository blogCommentRepository;

    @Override
    public Map<String, Long> getPostsCountByMonth(Date startDate, Date endDate) {

        List<BlogPost> allPosts = blogPostRepository.findAll();


        if (startDate != null || endDate != null) {
            Date finalStartDate = startDate != null ? startDate : new Date(0); // Date minimale si null
            Date finalEndDate = endDate != null ? endDate : new Date(); // Date actuelle si null

            allPosts = allPosts.stream()
                    .filter(post -> {
                        Date postDate = post.getCreatedAt();
                        return postDate.after(finalStartDate) && postDate.before(finalEndDate) ||
                                postDate.equals(finalStartDate) || postDate.equals(finalEndDate);
                    })
                    .collect(Collectors.toList());
        }


        if (allPosts.isEmpty()) {
            return new LinkedHashMap<>();
        }


        SimpleDateFormat monthFormat = new SimpleDateFormat("yyyy-MM");
        Map<String, Long> postsPerMonth = allPosts.stream()
                .collect(Collectors.groupingBy(
                        post -> monthFormat.format(post.getCreatedAt()),
                        Collectors.counting()
                ));


        return postsPerMonth.entrySet().stream()
                .filter(entry -> entry.getValue() > 0) // Ne garder que les mois avec des données
                .sorted(Map.Entry.comparingByKey())
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (e1, e2) -> e1,
                        LinkedHashMap::new
                ));
    }

    @Override
    public Map<String, Long> getPostsCountByDay(Date startDate, Date endDate) {

        List<BlogPost> allPosts = blogPostRepository.findAll();


        if (startDate != null || endDate != null) {
            Date finalStartDate = startDate != null ? startDate : new Date(0); // Date minimale si null
            Date finalEndDate = endDate != null ? endDate : new Date(); // Date actuelle si null

            allPosts = allPosts.stream()
                    .filter(post -> {
                        Date postDate = post.getCreatedAt();
                        return postDate.after(finalStartDate) && postDate.before(finalEndDate) ||
                                postDate.equals(finalStartDate) || postDate.equals(finalEndDate);
                    })
                    .collect(Collectors.toList());
        }


        if (allPosts.isEmpty()) {
            return new LinkedHashMap<>();
        }


        SimpleDateFormat dayFormat = new SimpleDateFormat("yyyy-MM-dd");
        Map<String, Long> postsPerDay = allPosts.stream()
                .collect(Collectors.groupingBy(
                        post -> dayFormat.format(post.getCreatedAt()),
                        Collectors.counting()
                ));


        return postsPerDay.entrySet().stream()
                .filter(entry -> entry.getValue() > 0) // Ne garder que les jours avec des données
                .sorted(Map.Entry.comparingByKey())
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (e1, e2) -> e1,
                        LinkedHashMap::new
                ));
    }

    @Override
    public Map<String, Long> getPostsCountByYear(Date startDate, Date endDate) {

        List<BlogPost> allPosts = blogPostRepository.findAll();


        if (startDate != null || endDate != null) {
            Date finalStartDate = startDate != null ? startDate : new Date(0); // Date minimale si null
            Date finalEndDate = endDate != null ? endDate : new Date(); // Date actuelle si null

            allPosts = allPosts.stream()
                    .filter(post -> {
                        Date postDate = post.getCreatedAt();
                        return postDate.after(finalStartDate) && postDate.before(finalEndDate) ||
                                postDate.equals(finalStartDate) || postDate.equals(finalEndDate);
                    })
                    .collect(Collectors.toList());
        }


        if (allPosts.isEmpty()) {
            return new LinkedHashMap<>();
        }


        SimpleDateFormat yearFormat = new SimpleDateFormat("yyyy");
        Map<String, Long> postsPerYear = allPosts.stream()
                .collect(Collectors.groupingBy(
                        post -> yearFormat.format(post.getCreatedAt()),
                        Collectors.counting()
                ));


        return postsPerYear.entrySet().stream()
                .filter(entry -> entry.getValue() > 0)
                .sorted(Map.Entry.comparingByKey())
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (e1, e2) -> e1,
                        LinkedHashMap::new
                ));
    }

    @Override
    public Map<String, Long> getCommentsCountByMonth(Date startDate, Date endDate) {

        List<BlogComment> allComments = blogCommentRepository.findAll();


        if (startDate != null || endDate != null) {
            Date finalStartDate = startDate != null ? startDate : new Date(0); // Date minimale si null
            Date finalEndDate = endDate != null ? endDate : new Date(); // Date actuelle si null

            allComments = allComments.stream()
                    .filter(comment -> {
                        Date commentDate = comment.getCreatedAt();
                        return commentDate.after(finalStartDate) && commentDate.before(finalEndDate) ||
                                commentDate.equals(finalStartDate) || commentDate.equals(finalEndDate);
                    })
                    .collect(Collectors.toList());
        }


        if (allComments.isEmpty()) {
            return new LinkedHashMap<>();
        }


        SimpleDateFormat monthFormat = new SimpleDateFormat("yyyy-MM");
        Map<String, Long> commentsPerMonth = allComments.stream()
                .collect(Collectors.groupingBy(
                        comment -> monthFormat.format(comment.getCreatedAt()),
                        Collectors.counting()
                ));


        return commentsPerMonth.entrySet().stream()
                .filter(entry -> entry.getValue() > 0) // Ne garder que les mois avec des données
                .sorted(Map.Entry.comparingByKey())
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (e1, e2) -> e1,
                        LinkedHashMap::new
                ));
    }

    @Override
    public Map<String, Long> getCommentsCountByDay(Date startDate, Date endDate) {

        List<BlogComment> allComments = blogCommentRepository.findAll();


        if (startDate != null || endDate != null) {
            Date finalStartDate = startDate != null ? startDate : new Date(0); // Date minimale si null
            Date finalEndDate = endDate != null ? endDate : new Date(); // Date actuelle si null

            allComments = allComments.stream()
                    .filter(comment -> {
                        Date commentDate = comment.getCreatedAt();
                        return commentDate.after(finalStartDate) && commentDate.before(finalEndDate) ||
                                commentDate.equals(finalStartDate) || commentDate.equals(finalEndDate);
                    })
                    .collect(Collectors.toList());
        }


        if (allComments.isEmpty()) {
            return new LinkedHashMap<>();
        }


        SimpleDateFormat dayFormat = new SimpleDateFormat("yyyy-MM-dd");
        Map<String, Long> commentsPerDay = allComments.stream()
                .collect(Collectors.groupingBy(
                        comment -> dayFormat.format(comment.getCreatedAt()),
                        Collectors.counting()
                ));


        return commentsPerDay.entrySet().stream()
                .filter(entry -> entry.getValue() > 0)
                .sorted(Map.Entry.comparingByKey())
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (e1, e2) -> e1,
                        LinkedHashMap::new
                ));
    }

    @Override
    public Map<String, Long> getCommentsCountByYear(Date startDate, Date endDate) {

        List<BlogComment> allComments = blogCommentRepository.findAll();


        if (startDate != null || endDate != null) {
            Date finalStartDate = startDate != null ? startDate : new Date(0);
            Date finalEndDate = endDate != null ? endDate : new Date();

            allComments = allComments.stream()
                    .filter(comment -> {
                        Date commentDate = comment.getCreatedAt();
                        return commentDate.after(finalStartDate) && commentDate.before(finalEndDate) ||
                                commentDate.equals(finalStartDate) || commentDate.equals(finalEndDate);
                    })
                    .collect(Collectors.toList());
        }


        if (allComments.isEmpty()) {
            return new LinkedHashMap<>();
        }


        SimpleDateFormat yearFormat = new SimpleDateFormat("yyyy");
        Map<String, Long> commentsPerYear = allComments.stream()
                .collect(Collectors.groupingBy(
                        comment -> yearFormat.format(comment.getCreatedAt()),
                        Collectors.counting()
                ));


        return commentsPerYear.entrySet().stream()
                .filter(entry -> entry.getValue() > 0)
                .sorted(Map.Entry.comparingByKey())
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (e1, e2) -> e1,
                        LinkedHashMap::new
                ));
    }

    @Override
    public Map<String, Long> getReactionsDistribution() {

        List<BlogPost> allPosts = blogPostRepository.findAll();


        Map<String, Long> reactionCounts = Arrays.stream(Reaction.values())
                .collect(Collectors.toMap(
                        Reaction::name,
                        reaction -> 0L
                ));


        allPosts.stream()
                .filter(post -> post.getReaction() != null)
                .forEach(post -> {
                    String reactionName = post.getReaction().name();
                    reactionCounts.put(reactionName, reactionCounts.getOrDefault(reactionName, 0L) + 1);
                });

        return reactionCounts;
    }

    @Override
    public Map<Long, Integer> getMostCommentedPosts(int limit) {

        List<BlogComment> allComments = blogCommentRepository.findAll();


        Map<Long, Integer> commentsPerPost = allComments.stream()
                .collect(Collectors.groupingBy(
                        comment -> comment.getBlogPost().getPostId(),
                        Collectors.summingInt(comment -> 1)
                ));


        return commentsPerPost.entrySet().stream()
                .sorted(Map.Entry.<Long, Integer>comparingByValue().reversed())
                .limit(limit)
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (e1, e2) -> e1,
                        LinkedHashMap::new
                ));
    }

    @Override
    public Map<Long, Map<String, Integer>> getUsersActivity(int limit) {

        List<BlogPost> allPosts = blogPostRepository.findAll();
        List<BlogComment> allComments = blogCommentRepository.findAll();


        Map<Long, Integer> postsPerUser = allPosts.stream()
                .filter(post -> post.getUser() != null)
                .collect(Collectors.groupingBy(
                        post -> post.getUser().getId(),
                        Collectors.summingInt(post -> 1)
                ));


        Map<Long, Integer> commentsPerUser = allComments.stream()
                .filter(comment -> comment.getUser() != null)
                .collect(Collectors.groupingBy(
                        comment -> comment.getUser().getId(),
                        Collectors.summingInt(comment -> 1)
                ));


        Map<Long, Integer> totalActivityPerUser = new HashMap<>();

        postsPerUser.forEach((userId, postCount) -> totalActivityPerUser.put(userId, postCount));
        commentsPerUser.forEach((userId, commentCount) ->
                totalActivityPerUser.merge(userId, commentCount, Integer::sum));


        List<Long> mostActiveUsers = totalActivityPerUser.entrySet().stream()
                .sorted(Map.Entry.<Long, Integer>comparingByValue().reversed())
                .limit(limit)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());


        Map<Long, Map<String, Integer>> result = new LinkedHashMap<>();
        for (Long userId : mostActiveUsers) {
            Map<String, Integer> userActivity = new HashMap<>();
            userActivity.put("posts", postsPerUser.getOrDefault(userId, 0));
            userActivity.put("comments", commentsPerUser.getOrDefault(userId, 0));
            userActivity.put("total", totalActivityPerUser.get(userId));
            result.put(userId, userActivity);
        }

        return result;
    }

}
