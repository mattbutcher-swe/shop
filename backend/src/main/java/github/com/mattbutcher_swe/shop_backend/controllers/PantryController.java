package github.com.mattbutcher_swe.shop_backend.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import github.com.mattbutcher_swe.shop_backend.repositories.IngredientRepository;
import github.com.mattbutcher_swe.shop_backend.dtos.IngredientDTO;
import github.com.mattbutcher_swe.shop_backend.models.Ingredient;

@RestController
@CrossOrigin(origins = "http://localhost")
@RequestMapping("/pantry")
public class PantryController {

    @Autowired
    private IngredientRepository ingredientRepository;

    @GetMapping
    public List<IngredientDTO> getAllIngredients() {
        return ingredientRepository.findAll().stream()
        .map(IngredientDTO::toIngredientDTO)
        .collect(Collectors.toList());
    }

    @PostMapping("/create")
    public IngredientDTO createIngredient(@RequestBody IngredientDTO ingredientDTO) {
        Ingredient ingredient = new Ingredient();
        ingredient.setName(ingredientDTO.name);
        ingredient.setPantryQuantity(ingredientDTO.quantity);
        ingredientRepository.save(ingredient);

        return IngredientDTO.toIngredientDTO(ingredient);
    }

    @PostMapping("/update")
    public IngredientDTO updateIngredient(@RequestBody IngredientDTO ingredientDTO) {
        Ingredient ingredient = ingredientRepository.findById(ingredientDTO.id)
        .orElseThrow(() -> new RuntimeException("Ingredient not found with name: " + ingredientDTO.name));

        ingredient.setName(ingredientDTO.name);
        ingredient.setPantryQuantity(ingredientDTO.quantity);
        ingredientRepository.save(ingredient);

        return IngredientDTO.toIngredientDTO(ingredient);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteIngredient(@PathVariable Long id) {
        ingredientRepository.deleteById(id);
    }
}
