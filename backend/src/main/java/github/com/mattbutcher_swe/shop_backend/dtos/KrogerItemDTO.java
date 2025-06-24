package github.com.mattbutcher_swe.shop_backend.dtos;

import github.com.mattbutcher_swe.shop_backend.models.KrogerItem;

public class KrogerItemDTO {
    public Long id;
    public String name;
    public Double weight;
    public Double price;

    public static KrogerItemDTO toKrogerItemDTO(KrogerItem krogerItem) {
        KrogerItemDTO dto = new KrogerItemDTO();
        
        dto.id = krogerItem.getId();
        dto.name = krogerItem.getName();
        dto.weight = krogerItem.getWeight();
        dto.price = krogerItem.getPrice();

        return dto;
    }
}
