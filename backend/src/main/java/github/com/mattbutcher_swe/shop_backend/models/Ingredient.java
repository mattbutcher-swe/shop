package github.com.mattbutcher_swe.shop_backend.models;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;

@Entity
public class Ingredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name;

    @OneToMany(mappedBy = "ingredient", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RecipeIngredient> recipeUsages = new ArrayList<>();

    @Column(name = "pantry_quantity")
    private Integer pantryQuantity;

    @OneToOne(cascade = CascadeType.ALL, optional = true)
    @JoinColumn(name = "kroger_item_id")
    private KrogerItem krogerItem;

    @Column(name = "purchase_quantity")
    private Integer purchaseQuantity;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getPantryQuantity() {
        return this.pantryQuantity;
    }

    public void setPantryQuantity(Integer quantity) {
        this.pantryQuantity = quantity;
    }

    public List<RecipeIngredient> getRecipeUsages() {
        return recipeUsages;
    }

    public void setRecipeUsages(List<RecipeIngredient> recipeUsages) {
        this.recipeUsages = recipeUsages;
    }

    public KrogerItem getKrogerItem() {
        return krogerItem;
    }

    public void setKrogerItem(KrogerItem krogerItem) {
        this.krogerItem = krogerItem;
    }

    public Integer getPurchaseQuantity() {
        return this.purchaseQuantity;
    }

    public void setPurchaseQuantity(Integer quantity) {
        this.purchaseQuantity = quantity;
    }

}
