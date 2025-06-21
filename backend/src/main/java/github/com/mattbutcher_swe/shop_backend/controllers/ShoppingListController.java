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
import github.com.mattbutcher_swe.shop_backend.dtos.NeededIngredientDTO;
import github.com.mattbutcher_swe.shop_backend.dtos.RecipeDTO;
import github.com.mattbutcher_swe.shop_backend.models.Recipe;
import github.com.mattbutcher_swe.shop_backend.models.RecipeIngredient;

import github.com.mattbutcher_swe.shop_backend.repositories.RecipeRepository;

@RestController
@CrossOrigin(origins = "http://localhost")
@RequestMapping("/shopping-list")
public class ShoppingListController {

    @Autowired
    private RecipeRepository recipeRepository;

    @GetMapping("/")
    public List<NeededIngredientDTO> getNeededIngredients() {
        // Get all recipes where order is true
        List<Recipe> recipes = recipeRepository.findByWantTrue();

        // Create a map to group RecipeIngredients by ingredientId
        Map<Long, List<RecipeIngredient>> groupedByIngredientId = recipes.stream()
                .flatMap(recipe -> recipe.getIngredients().stream())
                .collect(Collectors.groupingBy(
                        ri -> ri.getId().getIngredientId()));

        // Convert grouped ingredients to NeededIngredientDTO list
        List<NeededIngredientDTO> result = new ArrayList<>();

        for (Map.Entry<Long, List<RecipeIngredient>> entry : groupedByIngredientId.entrySet()) {
            List<RecipeIngredient> recipeIngredients = entry.getValue();

            // Get the first RecipeIngredient to access the Ingredient
            RecipeIngredient firstRi = recipeIngredients.get(0);

            // Convert Ingredient to IngredientDTO (assuming you have a conversion method)
            IngredientDTO ingredientDTO = IngredientDTO.toIngredientDTO(firstRi.getIngredient());

            // Collect recipe names
            List<String> recipeNames = recipeIngredients.stream()
                    .map(ri -> ri.getRecipe().getName())
                    .distinct() // Ensure no duplicate recipe names
                    .collect(Collectors.toList());

            // Create NeededIngredientDTO
            NeededIngredientDTO neededDTO = NeededIngredientDTO.toNeededIngredientDTO(
                    ingredientDTO,
                    recipeNames);

            result.add(neededDTO);
        }

        return result;
    }

    @PostMapping("/update")
    public void updateShoppingList(@RequestBody List<RecipeDTO> recipeDTOs) {
        for (RecipeDTO recipeDTO : recipeDTOs) {
            Recipe recipe = recipeRepository.findById(recipeDTO.id).get();
            if (recipe != null) {
                recipe.setWant(true);
                recipeRepository.save(recipe);
            }
        }
    }

}
