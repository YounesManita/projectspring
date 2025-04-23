package tn.esprit.service;

import jakarta.annotation.PostConstruct;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.util.Calendar;

@Slf4j
@Service
public class EmailService {

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${spring.mail.password}")
    private String emailPassword;

    @Value("${verification-code.expiration.account-activation}")
    private int activationCodeExpirationTimeInMinutes;

    @Value("${verification-code.expiration.reset-password}")
    private int resetPasswordCodeExpirationTimeInMinutes;

    @Value("${jwt.expiration.enable-account}")
    private long enableAccountExpirationTimeInMs;

    @Value("${jwt.expiration.reset-password}")
    private long resetPasswordExpirationTimeInMs;

    private final JavaMailSender mailSender;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @PostConstruct
    public void init() {
        System.out.println("Email password length: " + emailPassword.length());
        System.out.println("Password: '" + emailPassword + "'");
    }

    // ========== Basic Email Sending ==========
    public void sendSimpleEmail(String toEmail, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(this.fromEmail);
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }

    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        MimeMessage message = mailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            helper.setFrom(fromEmail);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Erreur lors de l'envoi de l'email", e);
        }
    }

    // ========== Code-Based Emails ==========
    public void sendActivationCode(String email, String firstName, String code) {
        String template = "templates/activate-account-code.html";
        String subject = "Verify Your Account";
        sendEmailWithVerificationCode(email, firstName, subject, code, template, activationCodeExpirationTimeInMinutes);
    }

    public void sendResetPasswordCode(String email, String firstName, String code) {
        String template = "templates/reset-password-code.html";
        String subject = "Reset Your Password";
        sendEmailWithVerificationCode(email, firstName, subject, code, template, resetPasswordCodeExpirationTimeInMinutes);
    }

    private void sendEmailWithVerificationCode(String email, String firstName, String subject, String code,
                                               String template, int expirationMinutes) {

        String currentYear = String.valueOf(Calendar.getInstance().get(Calendar.YEAR));
        String senderName = "Spring Boot 3 Team";

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, senderName);
            helper.setTo(email);
            helper.setSubject(subject);

            ClassPathResource resource = new ClassPathResource(template);
            String content = new String(Files.readAllBytes(resource.getFile().toPath()));

            content = content.replace("{{firstName}}", firstName)
                    .replace("{{verificationCode}}", code)
                    .replace("{{currentYear}}", currentYear)
                    .replace("{{expirationTimeInMinutes}}", String.valueOf(expirationMinutes));

            helper.setText(content, true);
            mailSender.send(message);

            log.info("Verification email sent to {}", email);

        } catch (MessagingException | IOException e) {
            log.error("Failed to send verification email to {}", email, e);
        }
    }

    // ========== Link-Based Emails ==========
    public void sendActivationLink(String email, String firstName, String activationLink) {
        String template = "templates/activate-account.html";
        String subject = "Activate Your Account";
        sendEmailWithTemplate(email, firstName, subject, activationLink, template, enableAccountExpirationTimeInMs);
    }

    public void sendResetPasswordRequestToUser(String email, String firstName, String resetPasswordLink) {
        String template = "templates/reset-password.html";
        String subject = "Reset Your Password";
        sendEmailWithTemplate(email, firstName, subject, resetPasswordLink, template, resetPasswordExpirationTimeInMs);
    }

    private void sendEmailWithTemplate(String email, String firstName, String subject, String url,
                                       String template, long expirationTimeInMs) {

        String currentYear = String.valueOf(Calendar.getInstance().get(Calendar.YEAR));
        int expirationTimeInMinutes = (int) (expirationTimeInMs / 60000);
        String senderName = "Spring Boot 3 Team";

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, senderName);
            helper.setTo(email);
            helper.setSubject(subject);

            ClassPathResource resource = new ClassPathResource(template);
            String content = new String(Files.readAllBytes(resource.getFile().toPath()));

            content = content.replace("{{firstName}}", firstName)
                    .replace("{{activationLink}}", url)
                    .replace("{{currentYear}}", currentYear)
                    .replace("{{expirationTimeInMinutes}}", String.valueOf(expirationTimeInMinutes));

            helper.setText(content, true);
            mailSender.send(message);

            log.info("Email with link sent to {}", email);

        } catch (MessagingException | IOException e) {
            log.error("Failed to send email to {}", email, e);
        }
    }
}
