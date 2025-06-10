import React, { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import Layout from '../components/layout';

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
    recipes.map((recipe) => (
      <div className="form-check" key={recipe.id}>
        <label className="form-check-label" htmlFor="flexCheckChecked">
          {recipe.name}
        </label>
        <input className="form-check-input" type="checkbox"></input>
      </div>
    ))
  );  
}

const Footer = () => (
  <div className='d-flex flex-row'>
    <Link to="/recipes/add">
      <button className='btn btn-primary'>
        Create meal
      </button>
    </Link>
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
