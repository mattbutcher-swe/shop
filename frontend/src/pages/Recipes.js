import React, { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import Layout from '../components/Layout';
import RecipeTile from '../components/RecipeTile';

import '../App.css';

const Header = () => (
  <span>Meals</span>
);

const Main = () => {
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
            <RecipeTile recipe={recipe} />
          </div>
        ))}
      </div>
    </div>
  );
}

const Footer = () => (
  <div className='d-flex flex-row'>
    <button type="submit" disabled className='ms-auto btn btn-primary'>Order</button>
  </div>
);

const Recipes = () => {
  return (
    <Layout
      header={<Header />}
      main={<Main />}
      footer={<Footer />}
    >
    </Layout>
  );
};

export default Recipes;
