package com.backupmanager.Service;

import com.backupmanager.Model.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    private final String SECRET_KEY = "fc7e4271-fa2c-4fb3-a169-31e7d1f6e94f";

    // generate token with usename
    public String generateToken(String username) {
        return Jwts.builder()
            .setSubject(username)
            .setIssuedAt(new Date())
            .setExpiration(
                new Date(System.currentTimeMillis() + 1000L * 60 * 60 * 24)
            )
            .signWith(getSignKey())
            .compact();
    }

    private Key getSignKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
    }

    // with token we can get username
    public String extractUsername(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(getSignKey())
            .build()
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
    }

    public boolean isTokenExpired(String token) {
        Date expiration = Jwts.parserBuilder()
            .setSigningKey(getSignKey())
            .build()
            .parseClaimsJws(token)
            .getBody()
            .getExpiration();

        return expiration.before(new Date());
    }

    // validate token with username check signature - username - token Expiration
    public boolean validateToken(String token, User user) {
        String username = extractUsername(token);

        return username.equals(user.getUsername()) && !isTokenExpired(token);
    }
}
