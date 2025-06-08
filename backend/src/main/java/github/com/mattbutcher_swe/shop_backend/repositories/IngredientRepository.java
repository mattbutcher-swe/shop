package github.com.mattbutcher_swe.shop_backend.repositories;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import github.com.mattbutcher_swe.shop_backend.models.Ingredient;

public interface IngredientRepository extends JpaRepository<Ingredient, Long> {
    Optional<Ingredient> findByName(String name);
}
