package github.com.mattbutcher_swe.shop_backend.controllers;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import github.com.mattbutcher_swe.shop_backend.repositories.SettingRepository;

@RestController
@CrossOrigin(origins = "http://localhost")
@RequestMapping("/kroger")
public class KrogerController {

    @Autowired
    private SettingRepository settingRepository;

    @GetMapping("/token")
    public ResponseEntity<String> getAccessToken() {
        try {
            String environment = settingRepository.findBySettingKey("environment")
                    .orElseThrow(() -> new RuntimeException("Missing 'environment' setting"))
                    .getSettingValue();

            String baseUrl = environment.equals("dev") ? "https://api-ce.kroger.com/v1/" : "https://api.kroger.com/v1/";

            String tokenUrl = baseUrl + "connect/oauth2/token";
            String clientId = settingRepository.findBySettingKey(environment + "ClientId")
                    .orElseThrow(() -> new RuntimeException("Missing ClientId setting"))
                    .getSettingValue();

            String clientSecret = settingRepository.findBySettingKey(environment + "ClientSecret")
                    .orElseThrow(() -> new RuntimeException("Missing ClientSecret setting"))
                    .getSettingValue();

            String credentials = clientId + ":" + clientSecret;
            String encodedCredentials = Base64.getEncoder().encodeToString(credentials.getBytes());
            String requestBody = "grant_type=client_credentials";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(tokenUrl))
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .header("Authorization", "Basic " + encodedCredentials)
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpClient client = HttpClient.newHttpClient();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode jsonNode = objectMapper.readTree(response.body());
                String token = jsonNode.get("access_token").asText();
                return ResponseEntity.ok(token);
            } else {
                return ResponseEntity
                        .status(response.statusCode())
                        .body("Failed to get access token. Status: " + response.statusCode());
            }

        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Exception occurred while requesting access token.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
