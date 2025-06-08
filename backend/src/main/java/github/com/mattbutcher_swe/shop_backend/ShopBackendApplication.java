package github.com.mattbutcher_swe.shop_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class ShopBackendApplication {

  public static void main(String[] args) {
    SpringApplication.run(ShopBackendApplication.class, args);
  }

}