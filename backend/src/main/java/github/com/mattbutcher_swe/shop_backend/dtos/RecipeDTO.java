package github.com.mattbutcher_swe.shop_backend.dtos;

import java.util.List;

import github.com.mattbutcher_swe.shop_backend.models.Recipe;

public class RecipeDTO {
    public Long id;
    public String name;
    public String description;
    public List<IngredientDTO> ingredients;
    public Boolean want;

    public static RecipeDTO toRecipeDTO(Recipe recipe) {
        RecipeDTO dto = new RecipeDTO();
        
        dto.id = recipe.getId();
        dto.name = recipe.getName();
        dto.description = recipe.getDescription();
        dto.ingredients = recipe.getIngredients().stream().map(ri -> {
            IngredientDTO ingDTO = new IngredientDTO();
            ingDTO.name = ri.getIngredient().getName();
            ingDTO.quantity = ri.getAmount();
            return ingDTO;
        }).toList();
        dto.want = recipe.getWant();

        return dto;
    }
    
}
