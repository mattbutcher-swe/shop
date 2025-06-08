package github.com.mattbutcher_swe.shop_backend.dtos;

import java.util.List;

public class RecipeDTO {
    public String name;
    public String description;
    public List<IngredientDTO> ingredients;

    public static class IngredientDTO {
        public String name;
        public String quantity;
    }
    
}
