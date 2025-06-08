package github.com.mattbutcher_swe.shop_backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import github.com.mattbutcher_swe.shop_backend.repositories.IngredientRepository;
import github.com.mattbutcher_swe.shop_backend.repositories.RecipeRepository;
import github.com.mattbutcher_swe.shop_backend.dtos.RecipeDTO;
import github.com.mattbutcher_swe.shop_backend.models.Ingredient;
import github.com.mattbutcher_swe.shop_backend.models.Recipe;
import github.com.mattbutcher_swe.shop_backend.models.RecipeIngredient;

@RestController
@RequestMapping("/recipes")
public class RecipeController {

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private IngredientRepository ingredientRepository;

    @PostMapping
    public Recipe createRecipe(@RequestBody RecipeDTO recipeDTO) {
        Recipe recipe = new Recipe();
        recipe.setName(recipeDTO.name);
        recipe.setDescription(recipeDTO.description);

        for (RecipeDTO.IngredientDTO ingDTO : recipeDTO.ingredients) {
            Ingredient ingredient = ingredientRepository.findByName(ingDTO.name).orElseGet(() -> {
                Ingredient newIng = new Ingredient();
                newIng.setName(ingDTO.name);
                return ingredientRepository.save(newIng);
            });

            RecipeIngredient recipeIngredient = new RecipeIngredient();
            recipeIngredient.setIngredient(ingredient);
            recipeIngredient.setAmount(ingDTO.quantity);
            recipe.addIngredient(recipeIngredient);
        }
            
            
        return recipeRepository.save(recipe);
    }
}
