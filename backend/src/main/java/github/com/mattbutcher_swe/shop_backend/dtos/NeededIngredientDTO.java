package github.com.mattbutcher_swe.shop_backend.dtos;

import java.util.List;

public class NeededIngredientDTO {
    public IngredientDTO ingredientDTO;
    public List<String> neededBy;
    public Double quantity;

    public static NeededIngredientDTO toNeededIngredientDTO(IngredientDTO ingredientDTO, List<String> neededBy, Double quantity) {
        NeededIngredientDTO dto = new NeededIngredientDTO();
        
        dto.ingredientDTO = ingredientDTO;
        dto.neededBy = neededBy;
        dto.quantity = quantity;

        return dto;
    }
}
