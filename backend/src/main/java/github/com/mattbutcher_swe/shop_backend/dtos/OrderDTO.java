package github.com.mattbutcher_swe.shop_backend.dtos;

import java.util.List;

public class OrderDTO {
    private List<KrogerItemEntryDTO> items;

    public OrderDTO() {}

    public OrderDTO(List<KrogerItemEntryDTO> items) {
        this.items = items;
    }

    public List<KrogerItemEntryDTO> getItems() {
        return items;
    }

    public void setItems(List<KrogerItemEntryDTO> items) {
        this.items = items;
    }

    public static class KrogerItemEntryDTO {
        private String upc;
        private Integer quantity;
        private String modality;

        public KrogerItemEntryDTO() {
            this.modality = "PICKUP";
        }

        public KrogerItemEntryDTO(String upc, int quantity, String modality) {
            this.upc = upc;
            this.quantity = quantity;
            this.modality = modality;
        }

        public String getUpc() {
            return upc;
        }

        public void setUpc(String upc) {
            if (upc != null) {
                this.upc = String.format("%013d", Long.parseLong(upc));
            } else {
                this.upc = null;
            }
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }

        public String getModality() {
            return modality;
        }

        public void setModality(String modality) {
            this.modality = modality;
        }

        

    }
}
