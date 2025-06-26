package github.com.mattbutcher_swe.shop_backend.controllers;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpRequest.BodyPublisher;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import github.com.mattbutcher_swe.shop_backend.dtos.OrderDTO;
import github.com.mattbutcher_swe.shop_backend.repositories.SettingRepository;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;

@RestController
@CrossOrigin(origins = "http://localhost")
@RequestMapping("/kroger")
public class KrogerController {

    @Autowired
    private SettingRepository settingRepository;

    private String fetchAccessToken() throws IOException, InterruptedException {
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
        String requestBody = "grant_type=client_credentials&scope=product.compact";

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(tokenUrl))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .header("Authorization", "Basic " + encodedCredentials)
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("Failed to retrieve token. Status: " + response.statusCode());
        }

        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(response.body());
        return jsonNode.get("access_token").asText();
    }

    public String fetchAuthorizedToken(String auth_code) {
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
        String requestBody = "grant_type=authorization_code&code=" + auth_code
                + "&scope=cart.basic:write&redirect_uri=http://localhost/list";

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(tokenUrl))
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .header("Authorization", "Basic " + encodedCredentials)
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpClient client = HttpClient.newHttpClient();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                throw new RuntimeException("Failed to retrieve token. Status: " + response.statusCode());
            }

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(response.body());

            return jsonNode.get("access_token").asText();
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            return "";
        } catch (RuntimeException e) {
            return "";
        }
    }

    @GetMapping("/token")
    public ResponseEntity<String> getAccessToken() {
        try {
            String token = fetchAccessToken();
            return ResponseEntity.ok(token);
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Exception occurred while requesting access token.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/search/{name}")
    public ResponseEntity<String> searchKrogerForItem(@PathVariable String name) {
        try {
            String encodedName = URLEncoder.encode(name, StandardCharsets.UTF_8.toString());

            String environment = settingRepository.findBySettingKey("environment")
                    .orElseThrow(() -> new RuntimeException("Missing 'environment' setting"))
                    .getSettingValue();

            String baseUrl = environment.equals("dev") ? "https://api-ce.kroger.com/v1/" : "https://api.kroger.com/v1/";
            String accessToken = fetchAccessToken();

            String searchUrl = baseUrl + "products?filter.term=" + encodedName +
                    "&filter.locationId=01100210&filter.limit=40&filter.fulfillment=ais";

            HttpRequest searchRequest = HttpRequest.newBuilder()
                    .uri(URI.create(searchUrl))
                    .header("Authorization", "Bearer " + accessToken)
                    .GET()
                    .build();

            HttpClient client = HttpClient.newHttpClient();
            HttpResponse<String> searchResponse = client.send(searchRequest, HttpResponse.BodyHandlers.ofString());

            return ResponseEntity
                    .status(searchResponse.statusCode())
                    .body(searchResponse.body());

        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error occurred during Kroger product search.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/add/{auth_code}")
    public ResponseEntity<String> addToCartWithAuthCode(
            @PathVariable("auth_code") String authCode,
            @RequestBody OrderDTO requestBody) {
        try {
            String environment = settingRepository.findBySettingKey("environment")
                    .orElseThrow(() -> new RuntimeException("Missing 'environment' setting"))
                    .getSettingValue();

            String baseUrl = environment.equals("dev")
                    ? "https://api-ce.kroger.com/v1/"
                    : "https://api.kroger.com/v1/";

            String cartUrl = baseUrl + "cart/add";
            String accessToken = fetchAuthorizedToken(authCode);

            ObjectMapper mapper = new ObjectMapper();
            String jsonPayload = mapper.writeValueAsString(requestBody);

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(cartUrl))
                    .header("Authorization", "Bearer " + accessToken)
                    .header("Accept", "application/json")
                    .header("Content-Type", "application/json")
                    .PUT(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            System.out.println("Kroger API response: " + response.body());

            // Forward Kroger API status code and body
            return ResponseEntity.status(response.statusCode()).body(response.body());

        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body("Error communicating with Kroger API.");
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Server configuration error: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error: " + e.getMessage());
        }
    }

}
