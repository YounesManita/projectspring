package tn.esprit.filter;

import tn.esprit.entity.UserDetailsImpl;
import tn.esprit.service.JwtService;
import tn.esprit.service.TokenService;
import tn.esprit.service.UserService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Enumeration;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

import static jakarta.servlet.http.HttpServletResponse.SC_UNAUTHORIZED;

@Component
@Slf4j
@AllArgsConstructor
public class JwtAuthorizationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserService userService;
    private final TokenService tokenService;
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    private static final List<String> PUBLIC_ENDPOINTS = List.of(
            "/api/v1/auth/register",
            "/api/v1/auth/refresh-token",
            "/api/v1/auth/verify-user",
            "/api/v1/auth/authenticate",
            "/api/v1/auth/forgot-password",
            "/api/v1/auth/reset-password",
            "/v2/api-docs", "/v3/api-docs", "/v3/api-docs/**",
            "/swagger-resources", "/swagger-resources/**",
            "/configuration/ui", "/configuration/security",
            "/swagger-ui/**", "/webjars/**", "/swagger-ui.html"
    );

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        if (isPublicEndpoint(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader(AUTHORIZATION_HEADER);
        if (authHeader == null || !authHeader.startsWith(BEARER_PREFIX)) {
            handleMissingToken(response, request);
            return;
        }

        String jwt = authHeader.substring(7);
        String username = extractUsernameFromJwt(jwt);

        if (username == null) {
            handleInvalidToken(response);
            return;
        }

        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            filterChain.doFilter(request, response);
            return;
        }

        UserDetailsImpl userDetails = userService.loadUserByUsername(username);

        if (!isTokenValid(jwt, userDetails)) {
            handleInvalidToken(response);
            return;
        }

        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities()
        );

        // Ajout des détails incluant l'ID utilisateur
        Map<String, Object> authenticationDetails = new HashMap<>();
        authenticationDetails.put("userId", userDetails.user().getId());
        authenticationDetails.put("remoteAddress", request.getRemoteAddr());
        authToken.setDetails(authenticationDetails);

        SecurityContextHolder.getContext().setAuthentication(authToken);
        filterChain.doFilter(request, response);
    }

    private boolean isPublicEndpoint(HttpServletRequest request) {
        String path = request.getServletPath();
        return PUBLIC_ENDPOINTS.stream().anyMatch(pattern -> pathMatcher.match(pattern, path));
    }

    private boolean isTokenValid(String jwt, UserDetailsImpl userDetails) {
        return tokenService.isTokenValid(jwt) && jwtService.isTokenValid(jwt, userDetails);
    }

    private void handleMissingToken(HttpServletResponse response, HttpServletRequest request) throws IOException {
        log.error("Authorization header missing for URL: {}", request.getServletPath());
        response.sendError(SC_UNAUTHORIZED, "Authorization header is missing or invalid");
    }

    private void handleInvalidToken(HttpServletResponse response) throws IOException {
        log.warn("Invalid JWT token");
        response.setStatus(SC_UNAUTHORIZED);
        response.getWriter().write("Invalid JWT token");
    }

    private String extractUsernameFromJwt(String jwt) {
        try {
            return jwtService.extractUsername(jwt);
        } catch (ExpiredJwtException ex) {
            log.warn("JWT expired: {}", ex.getMessage());
            return null;
        } catch (MalformedJwtException ex) {
            log.warn("Malformed JWT: {}", ex.getMessage());
            return null;
        } catch (SignatureException ex) {
            log.warn("Invalid JWT signature: {}", ex.getMessage());
            return null;
        } catch (UnsupportedJwtException ex) {
            log.warn("Unsupported JWT: {}", ex.getMessage());
            return null;
        }
    }
}