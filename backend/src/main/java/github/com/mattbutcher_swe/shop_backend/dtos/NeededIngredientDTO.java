package github.com.mattbutcher_swe.shop_backend.dtos;

import java.util.List;

public class NeededIngredientDTO {
    public IngredientDTO ingredientDTO;
    public List<String> neededBy;

    public static NeededIngredientDTO toNeededIngredientDTO(IngredientDTO ingredientDTO, List<String> neededBy) {
        NeededIngredientDTO dto = new NeededIngredientDTO();
        
        dto.ingredientDTO = ingredientDTO;
        dto.neededBy = neededBy;

        return dto;
    }
}
