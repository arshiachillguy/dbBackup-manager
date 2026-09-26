package com.backupmanager.config;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.backupmanager.Model.User;
import com.backupmanager.Repository.UserRepository;
import com.backupmanager.Service.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component 
public class JwtAuthenticationFilter extends OncePerRequestFilter{

    private final JwtService jwtService;
    private  final UserRepository userRepository;

    public JwtAuthenticationFilter(JwtService jwtService, UserRepository userRepository){
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(
        HttpServletRequest request ,
        HttpServletResponse response,
        FilterChain filterChain)
        throws ServletException , IOException{

            String authHeader = request.getHeader("Authorization");
            // Auth headers was exist and have bearer we can save it into token
            if (authHeader != null && authHeader.startsWith("Bearer ")){
                String token = authHeader.substring(7);

                String username = jwtService.extractUsername(token);
    
                User user = userRepository.findByUsername(username);

                SimpleGrantedAuthority authority = new SimpleGrantedAuthority(user.getRole());

                if (jwtService.validateToken(token, user)){
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(user, null , List.of(authority));

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    
                }
            }
            filterChain.doFilter(request, response);
    }
}
