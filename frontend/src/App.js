import './App.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Recipes from './Recipes';
import AddRecipe from './AddRecipe';
import NotFound from './NotFound';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Recipes />} />
      <Route path="/recipes" element={<Recipes />} />
      <Route path="/recipes/add" element={<AddRecipe />} />
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
}

export default App;