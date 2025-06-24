package github.com.mattbutcher_swe.shop_backend.dtos;

import github.com.mattbutcher_swe.shop_backend.models.Ingredient;

public class IngredientDTO {
    public Long id;
    public String name;
    public Integer quantity;
    public KrogerItemDTO krogerItemDTO;
    public Integer purchaseQuantity;

    public static IngredientDTO toIngredientDTO(Ingredient ingredient) {
        IngredientDTO dto = new IngredientDTO();
        
        dto.id = ingredient.getId();
        dto.name = ingredient.getName();
        dto.quantity = ingredient.getPantryQuantity();
        if (ingredient.getKrogerItem() != null) {
            dto.krogerItemDTO = KrogerItemDTO.toKrogerItemDTO(ingredient.getKrogerItem());
        }
        dto.purchaseQuantity = ingredient.getPurchaseQuantity();

        return dto;
    }
}
