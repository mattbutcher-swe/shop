import './App.css';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

function Recipes() {
  const [recipes, setRecipes] = useState([]);

  const fetchRecipes = async () => {
    const url = "http://localhost:8080/recipes";

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }      

      const json = await response.json();
      setRecipes(json);
    } catch (error) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <div className="App">
    <Link to="/recipes/add">
        <button>
            Add
        </button>
    </Link>
      Recipes
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Order</th>
          </tr>
        </thead>
        <tbody>
        {recipes.map((recipe, index) => (
          <tr>
            <td>{recipe.name}</td>
            <td><input type='checkbox'/></td>
          </tr>
        ))}

        </tbody>
      </table>
    </div>
  );
}

export default Recipes;
