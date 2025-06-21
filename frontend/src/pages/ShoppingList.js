import React, { useState } from 'react';
import { useEffect } from 'react';
import Layout from '../components/Layout';

import '../App.css';

const Header = () => (
  <span>Shopping List</span>
);

const Main = () => {
  const [ingredients, setIngredients] = useState([]);

  const fetchIngredients = async () => {
    const url = "http://localhost:8080/shopping-list/";

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      setIngredients(json);
      console.log(ingredients);
    } catch (error) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    fetchIngredients();
  }, []);

  return (
    <div className="v-stack-fill">
      <div className="v-grow-scroll">
        <div className="row">
          <div className='col-lg-6'>
            <h3>Ingredient</h3>
          </div>
          <div className='col-lg-6'>
            <h3>Needed By</h3>
          </div>
        </div>
        {ingredients.length > 0 ? (
          ingredients.map((ingredient) => (
            <div className="row mb-4" key={ingredient.ingredientDTO.id}>
              <div className='col-lg-6'>
                {ingredient.ingredientDTO.name}
              </div>
              <div className='col-lg-6'>
                {ingredient.neededBy.map((recipe, index) => (
                  <div key={index}>{recipe}</div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>No ingredients available</p>
        )}
      </div>
    </div>
  );

}

const ShoppingList = () => {
  return (
    <Layout
      header={<Header />}
      main={<Main />}
    >
    </Layout>
  );
};

export default ShoppingList;
