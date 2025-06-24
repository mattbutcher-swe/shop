package github.com.mattbutcher_swe.shop_backend.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import github.com.mattbutcher_swe.shop_backend.dtos.IngredientDTO;
import github.com.mattbutcher_swe.shop_backend.dtos.KrogerItemDTO;
import github.com.mattbutcher_swe.shop_backend.dtos.NeededIngredientDTO;
import github.com.mattbutcher_swe.shop_backend.dtos.RecipeDTO;
import github.com.mattbutcher_swe.shop_backend.models.Ingredient;
import github.com.mattbutcher_swe.shop_backend.models.KrogerItem;
import github.com.mattbutcher_swe.shop_backend.models.Recipe;
import github.com.mattbutcher_swe.shop_backend.models.RecipeIngredient;
import github.com.mattbutcher_swe.shop_backend.repositories.IngredientRepository;
import github.com.mattbutcher_swe.shop_backend.repositories.RecipeRepository;
import jakarta.transaction.Transactional;

@RestController
@CrossOrigin(origins = "http://localhost")
@RequestMapping("/shopping-list")
public class ShoppingListController {

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private IngredientRepository ingredientRepository;

    @GetMapping("/")
    public List<NeededIngredientDTO> getNeededIngredients() {
        List<Recipe> recipes = recipeRepository.findByWantTrue();

        Map<Long, List<RecipeIngredient>> groupedByIngredientId = recipes.stream()
                .flatMap(recipe -> recipe.getIngredients().stream())
                .collect(Collectors.groupingBy(
                        ri -> ri.getId().getIngredientId()));

        List<NeededIngredientDTO> result = new ArrayList<>();

        for (Map.Entry<Long, List<RecipeIngredient>> entry : groupedByIngredientId.entrySet()) {
            List<RecipeIngredient> recipeIngredients = entry.getValue();
            RecipeIngredient firstRi = recipeIngredients.get(0);
            IngredientDTO ingredientDTO = IngredientDTO.toIngredientDTO(firstRi.getIngredient());

            List<String> recipeNames = recipeIngredients.stream()
                    .map(ri -> ri.getRecipe().getName())
                    .distinct()
                    .collect(Collectors.toList());

            double totalQuantity = recipeIngredients.stream()
                    .mapToInt(RecipeIngredient::getQuantity)
                    .sum();

            NeededIngredientDTO neededDTO = NeededIngredientDTO.toNeededIngredientDTO(
                    ingredientDTO,
                    recipeNames,
                    totalQuantity);

            result.add(neededDTO);
        }

        return result;
    }

    @PostMapping("/update")
    @Transactional
    public void updateShoppingList(@RequestBody List<RecipeDTO> recipeDTOs) {
        recipeRepository.setWantFalse();
        recipeRepository.flush();

        for (RecipeDTO recipeDTO : recipeDTOs) {
            Recipe recipe = recipeRepository.findById(recipeDTO.id).get();
            if (recipe != null) {
                recipe.setWant(true);
                recipeRepository.save(recipe);
            }
        }
    }

    @PostMapping("/link-item")
    public void linkItem(@RequestBody IngredientDTO ingredientDTO) {
       Ingredient ingredient = ingredientRepository.findById(ingredientDTO.id).get();
       KrogerItem krogerItem = new KrogerItem();
       KrogerItemDTO krogerItemDTO = ingredientDTO.krogerItemDTO;

       krogerItem.setId(krogerItemDTO.id);
       krogerItem.setIngredient(ingredient);
       krogerItem.setName(krogerItemDTO.name);
       krogerItem.setPrice(krogerItemDTO.price);
       krogerItem.setWeight(krogerItemDTO.weight);

       ingredient.setKrogerItem(krogerItem);

       ingredientRepository.save(ingredient);
    }

    @PostMapping("/update-purchase-quantity")
    public void updatePurchaseQuantity(@RequestBody IngredientDTO ingredientDTO) {
       Ingredient ingredient = ingredientRepository.findById(ingredientDTO.id).get();
       ingredient.setPurchaseQuantity(ingredientDTO.purchaseQuantity);
       ingredientRepository.save(ingredient);
    }

}
