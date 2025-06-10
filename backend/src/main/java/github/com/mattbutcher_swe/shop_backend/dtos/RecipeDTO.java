package github.com.mattbutcher_swe.shop_backend.dtos;

import java.util.List;

import github.com.mattbutcher_swe.shop_backend.models.Recipe;

public class RecipeDTO {
    public Long id;
    public String name;
    public String description;
    public List<IngredientDTO> ingredients;

    public static class IngredientDTO {
        public String name;
        public String quantity;
    }

    public static RecipeDTO toRecipeDTO(Recipe recipe) {
        RecipeDTO dto = new RecipeDTO();
        
        dto.id = recipe.getId();
        dto.name = recipe.getName();
        dto.description = recipe.getDescription();
        dto.ingredients = recipe.getIngredients().stream().map(ri -> {
            RecipeDTO.IngredientDTO ingDTO = new RecipeDTO.IngredientDTO();
            ingDTO.name = ri.getIngredient().getName();
            ingDTO.quantity = ri.getAmount();
            return ingDTO;
        }).toList();

        return dto;
    }
    
}
