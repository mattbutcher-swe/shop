package github.com.mattbutcher_swe.shop_backend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import github.com.mattbutcher_swe.shop_backend.models.RecipeIngredient;
import github.com.mattbutcher_swe.shop_backend.models.RecipeIngredientId;

public interface RecipeIngredientRepository extends JpaRepository<RecipeIngredient, RecipeIngredientId> {
    Optional<RecipeIngredient> findByIdRecipeIdAndIdIngredientId(Long recipeId, Long ingredientId);

    @Modifying
    @Query("DELETE FROM RecipeIngredient ri WHERE ri.id.recipeId = :recipeId")
    void deleteByRecipeId(Long recipeId);
}


