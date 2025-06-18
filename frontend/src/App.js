import './App.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Recipes from './pages/Recipes';
import RecipeForm from './pages/RecipeForm';
import EditRecipe from './pages/EditRecipe';
import Pantry from './pages/Pantry';
import NotFound from './pages/NotFound';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Recipes />} />
      <Route path="/recipes" element={<Recipes />} />
      <Route path="/recipes/add" element={<RecipeForm />} />
      <Route path="/recipes/edit/:id" element={<EditRecipe />} />
      <Route path="/pantry" element={<Pantry />} />
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
}

export default App;