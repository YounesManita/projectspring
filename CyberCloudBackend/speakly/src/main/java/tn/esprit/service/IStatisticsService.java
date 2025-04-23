package tn.esprit.service;

import java.util.Date;
import java.util.Map;

public interface IStatisticsService {

    /**
     * Récupère le nombre de publications par mois pour une période donnée
     * @param startDate Date de début (peut être null pour ne pas avoir de limite inférieure)
     * @param endDate Date de fin (peut être null pour utiliser la date actuelle)
     * @return Map avec les mois comme clés (format "YYYY-MM") et le nombre de publications comme valeurs
     */
    Map<String, Long> getPostsCountByMonth(Date startDate, Date endDate);

    /**
     * Récupère le nombre de publications par jour pour une période donnée
     * @param startDate Date de début (peut être null pour ne pas avoir de limite inférieure)
     * @param endDate Date de fin (peut être null pour utiliser la date actuelle)
     * @return Map avec les jours comme clés (format "YYYY-MM-DD") et le nombre de publications comme valeurs
     */
    Map<String, Long> getPostsCountByDay(Date startDate, Date endDate);

    /**
     * Récupère le nombre de publications par année pour une période donnée
     * @param startDate Date de début (peut être null pour ne pas avoir de limite inférieure)
     * @param endDate Date de fin (peut être null pour utiliser la date actuelle)
     * @return Map avec les années comme clés (format "YYYY") et le nombre de publications comme valeurs
     */
    Map<String, Long> getPostsCountByYear(Date startDate, Date endDate);

    /**
     * Récupère le nombre de commentaires par mois pour une période donnée
     * @param startDate Date de début (peut être null pour ne pas avoir de limite inférieure)
     * @param endDate Date de fin (peut être null pour utiliser la date actuelle)
     * @return Map avec les mois comme clés (format "YYYY-MM") et le nombre de commentaires comme valeurs
     */
    Map<String, Long> getCommentsCountByMonth(Date startDate, Date endDate);

    /**
     * Récupère le nombre de commentaires par jour pour une période donnée
     * @param startDate Date de début (peut être null pour ne pas avoir de limite inférieure)
     * @param endDate Date de fin (peut être null pour utiliser la date actuelle)
     * @return Map avec les jours comme clés (format "YYYY-MM-DD") et le nombre de commentaires comme valeurs
     */
    Map<String, Long> getCommentsCountByDay(Date startDate, Date endDate);

    /**
     * Récupère le nombre de commentaires par année pour une période donnée
     * @param startDate Date de début (peut être null pour ne pas avoir de limite inférieure)
     * @param endDate Date de fin (peut être null pour utiliser la date actuelle)
     * @return Map avec les années comme clés (format "YYYY") et le nombre de commentaires comme valeurs
     */
    Map<String, Long> getCommentsCountByYear(Date startDate, Date endDate);

    /**
     * Récupère la distribution des réactions sur les publications
     * @return Map avec les types de réactions comme clés et leur nombre comme valeurs
     */
    Map<String, Long> getReactionsDistribution();

    /**
     * Récupère les publications les plus commentées
     * @param limit Nombre de publications à récupérer
     * @return Map avec les IDs des publications comme clés et le nombre de commentaires comme valeurs
     */
    Map<Long, Integer> getMostCommentedPosts(int limit);

    /**
     * Récupère l'activité des utilisateurs (nombre de publications et commentaires)
     * @param limit Nombre d'utilisateurs à récupérer
     * @return Map avec les IDs des utilisateurs comme clés et leur activité comme valeurs
     */
    Map<Long, Map<String, Integer>> getUsersActivity(int limit);
}