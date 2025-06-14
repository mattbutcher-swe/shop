import React, { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import Layout from '../components/Layout';
import RecipeTile from '../components/RecipeTile';

import '../App.css';

const Header = () => (
  <span>Meals</span>
);

const Main = ({recipesToOrder, setRecipesToOrder}) => {
  const [recipes, setRecipes] = useState([]);

  const updateRecipesToOrder = (recipeId, order) => {
    if (order) {
      const recipe = recipes.find(r => r.id === recipeId);
      if (recipe && !recipesToOrder.some(r => r.id === recipeId)) {
        setRecipesToOrder(prev => [...prev, recipe]);
      }
    } else {
      setRecipesToOrder(prev => prev.filter(r => r.id !== recipeId));
    }
  }

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
    <div className='v-stack-fill'>
      <div className='d-flex justify-content-end mb-4'>
        <Link to="/recipes/add">
          <button className='btn btn-primary'>
            +
          </button>
        </Link>
      </div>
      <div className='row v-grow-scroll'>
        {recipes.map((recipe) => (
          <div className='col-lg-3 col-md-4 col-6 mb-4' key={recipe.id}>
            <RecipeTile recipe={recipe} updateRecipesToOrder={updateRecipesToOrder} />
          </div>
        ))}
      </div>
    </div>
  );
}

const Footer = ({recipesToOrder}) => (
  <div className='d-flex flex-row'>
    <button type="submit"       
      disabled={recipesToOrder.length === 0}
      className='ms-auto btn btn-primary'>
        Order ({recipesToOrder.length})
    </button>
  </div>
);

const Recipes = () => {
  const [recipesToOrder, setRecipesToOrder] = useState([]);

  return (
    <Layout
      header={<Header />}
      main={<Main recipesToOrder={recipesToOrder} setRecipesToOrder={setRecipesToOrder}/>}
      footer={<Footer recipesToOrder={recipesToOrder}/>}
    >
    </Layout>
  );
};

export default Recipes;
