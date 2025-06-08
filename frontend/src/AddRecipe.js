import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './App.css';

function AddRecipe() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const navigate = useNavigate();

  const appendNewIngredientInput = () => {
    setIngredients([...ingredients, { name: '', quantity: '' }]);
  };

  const removeIngredientInput = (indexToRemove) => {
    setIngredients(ingredients.filter((_, index) => index !== indexToRemove));
  };

  const handleIngredientChange = (index, field, value) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const recipeData = {
      name,
      description,
      ingredients
    };

    try {
      const response = await fetch('http://localhost:8080/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(recipeData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error submitting recipe:', errorData);
        alert('Failed to submit recipe.');
        return;
      }

      navigate('/');
    } catch (error) {
      console.error('Error submitting recipe:', error);
      alert('Failed to submit recipe. Is the backend running?');
    }
  };

  return (
    <div className="App container">
      <h3 className="my-4">Add Recipe</h3>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="form-group row">
          <label htmlFor="name" className="col-sm-2 col-form-label">Name</label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Description */}
        <div className="form-group row">
          <label htmlFor="description" className="col-sm-2 col-form-label">Description</label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Ingredients Header */}
        <div className="form-group row align-items-center">
          <label className="col-sm-2 col-form-label">Ingredients</label>
          <div className="col-sm-10 text-end">
            <button type="button" onClick={appendNewIngredientInput} className="btn btn-success">
              +
            </button>
          </div>
        </div>

        {/* Ingredient Rows */}
        {ingredients.map((ingredient, index) => (
          <div className="form-group row align-items-center mb-2" key={index}>
            <div className="col-sm-4">
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                value={ingredient.name}
                onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                required
              />
            </div>
            <div className="col-sm-4">
              <input
                type="text"
                className="form-control"
                placeholder="Quantity"
                value={ingredient.quantity}
                onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                required
              />
            </div>
            <div className="col-sm-2">
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => removeIngredientInput(index)}
              >
                –
              </button>
            </div>
          </div>
        ))}

        {/* Submit Button */}
        <div className="form-group row mt-4">
          <div className="col-sm-10 offset-sm-2">
            <button type="submit" className="btn btn-primary">Submit Recipe</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddRecipe;
