package github.com.mattbutcher_swe.shop_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class Test {

  @RequestMapping("/")
  public String home() {
    int test = 5;
    return "Hello World123";
  }

  public static void main(String[] args) {
    SpringApplication.run(Test.class, args);
  }

}