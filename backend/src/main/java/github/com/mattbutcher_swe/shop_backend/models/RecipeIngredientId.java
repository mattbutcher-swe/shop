package github.com.mattbutcher_swe.shop_backend.models;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class RecipeIngredientId implements Serializable {
    private Long recipeId;
    private Long ingredientId;

    public RecipeIngredientId() {}

    public RecipeIngredientId(Long recipeId, Long ingredientId) {
        this.recipeId = recipeId;
        this.ingredientId = ingredientId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o instanceof RecipeIngredientId) {
            RecipeIngredientId that = (RecipeIngredientId) o;
            return Objects.equals(this.recipeId, that.recipeId) && Objects.equals(this.ingredientId, that.ingredientId); 
        } else return false;
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.recipeId, this.ingredientId);
    }

    public void setRecipeId(Long recipeId) {
        this.recipeId = recipeId;
    }

    public void setIngredientId(Long ingredientId) {
        this.ingredientId = ingredientId;
    }

    public Long getRecipeId() {
        return this.recipeId;
    }

    public Long getIngredientId() {
        return this.ingredientId;
    }

}
