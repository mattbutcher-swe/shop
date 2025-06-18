package github.com.mattbutcher_swe.shop_backend.dtos;

import github.com.mattbutcher_swe.shop_backend.models.Ingredient;

public class IngredientDTO {
    public Long id;
    public String name;
    public String quantity;

    public static IngredientDTO toIngredientDTO(Ingredient ingredient) {
        IngredientDTO dto = new IngredientDTO();
        
        dto.id = ingredient.getId();
        dto.name = ingredient.getName();
        dto.quantity = ingredient.getPantryQuantity();

        return dto;
    }
}
