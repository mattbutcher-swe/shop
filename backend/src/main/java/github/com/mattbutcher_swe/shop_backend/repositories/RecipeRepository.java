package github.com.mattbutcher_swe.shop_backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import github.com.mattbutcher_swe.shop_backend.models.Recipe;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    List<Recipe> findByWantTrue();
    
    @Modifying
    @Query("UPDATE Recipe SET want = false")
    void setWantFalse();
}
