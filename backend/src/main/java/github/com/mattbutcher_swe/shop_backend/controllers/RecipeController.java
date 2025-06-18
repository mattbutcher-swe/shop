package github.com.mattbutcher_swe.shop_backend.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import github.com.mattbutcher_swe.shop_backend.repositories.IngredientRepository;
import github.com.mattbutcher_swe.shop_backend.repositories.RecipeIngredientRepository;
import github.com.mattbutcher_swe.shop_backend.repositories.RecipeRepository;
import jakarta.transaction.Transactional;
import github.com.mattbutcher_swe.shop_backend.dtos.RecipeDTO;
import github.com.mattbutcher_swe.shop_backend.dtos.IngredientDTO;

import github.com.mattbutcher_swe.shop_backend.models.Ingredient;
import github.com.mattbutcher_swe.shop_backend.models.Recipe;
import github.com.mattbutcher_swe.shop_backend.models.RecipeIngredient;

@RestController
@CrossOrigin(origins = "http://localhost")
@RequestMapping("/recipes")
public class RecipeController {

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private IngredientRepository ingredientRepository;

    @Autowired
    private RecipeIngredientRepository recipeIngredientRepository;

    @GetMapping
    public List<RecipeDTO> getAllRecipes() {
        List<Recipe> recipes = recipeRepository.findAll();

        return recipes.stream()
                .map(RecipeDTO::toRecipeDTO)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecipeDTO> getRecipeById(@PathVariable Long id) {
        Optional<Recipe> recipeOptional = recipeRepository.findById(id);

        if (recipeOptional.isPresent()) {
            RecipeDTO dto = RecipeDTO.toRecipeDTO(recipeOptional.get());
            return ResponseEntity.ok(dto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/create")
    public Recipe createRecipe(@RequestBody RecipeDTO recipeDTO) {
        Recipe recipe = new Recipe();
        recipe.setName(recipeDTO.name);
        recipe.setDescription(recipeDTO.description);

        for (IngredientDTO ingDTO : recipeDTO.ingredients) {
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

    @Transactional
    @PostMapping("/update")
    public Recipe updateRecipe(@RequestBody RecipeDTO recipeDTO) {
        Recipe recipe = recipeRepository.findById(recipeDTO.id)
                .orElseThrow(() -> new RuntimeException("Recipe not found with ID: " + recipeDTO.id));

        recipe.setName(recipeDTO.name);
        recipe.setDescription(recipeDTO.description);

        recipeIngredientRepository.deleteByRecipeId(recipe.getId());
        recipe.getIngredients().clear();

        for (IngredientDTO ingDTO : recipeDTO.ingredients) {
            Ingredient ingredient = ingredientRepository.findByName(ingDTO.name)
                    .orElseGet(() -> {
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
