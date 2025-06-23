import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useEffect } from 'react';

const Header = ({ id }) => {
  if (!id) {
    return (
      <span>Create meal</span>
    )
  } else {
    return (
      <span>Edit meal</span>
    )
  }
};

const Main = ({ id }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchRecipe = async () => {
        const url = "http://localhost:8080/recipes/" + id;

        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
          }

          const json = await response.json();
          setName(json.name);
          setDescription(json.description);
          setIngredients(json.ingredients || []);
        } catch (error) {
          console.error(error.message);
        }
      };

      fetchRecipe();
    }
  }, [id]);


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
      id,
      name,
      description,
      ingredients
    };

    try {
      let url = "http://localhost:8080/recipes/create";
      if (id) {
        url = "http://localhost:8080/recipes/update";
      }
      const response = await fetch(url, {
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
    <form id="addMeal" onSubmit={handleSubmit}>
      <div className="form-group row mb-2">
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
      <div className="form-group row mb-2">
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

      <div className="form-group row align-items-center mb-2">
        <label className="col-sm-2 col-form-label">Ingredients</label>
        <div className="col-sm-10 text-end">
          <button type="button" className='btn btn-primary' onClick={appendNewIngredientInput}>
            +
          </button>
        </div>
      </div>
      <div className='v-grow-scroll'>
        {ingredients.map((ingredient, index) => (
          <div className="form-group row justify-content-end mb-2" key={index}>
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
            <div className="col-sm-2 text-end">
              <button
                type="button"
                className='btn btn-danger'
                onClick={() => removeIngredientInput(index)}
              >
                –
              </button>
            </div>
          </div>
        ))}
      </div>
    </form>
  )
};

const Footer = ({ id }) => {
  const navigate = useNavigate();

  const deleteMeal = async () => {
    if (window.confirm('Please confirm deletion.')) {
      let url = "http://localhost:8080/recipes/delete/" + id;
      const response = await fetch(url, { method: 'DELETE' });

      if (response.ok) {
        navigate('/');
      }
    }
  }
  if (id) {
    return (
      <div className='d-flex flex-row justify-content-between'>
        <button className='btn btn-danger' onClick={() => deleteMeal()}>Delete</button>
        <button type="submit" form='addMeal' className='btn btn-primary'>Save</button>
      </div>
    );
  } else {
    return (
      <div className='d-flex'>
        <button type="submit" form='addMeal' className='ms-auto btn btn-primary'>Save</button>
      </div>
    )
  }
};

function RecipeForm({ id }) {
  return (
    <Layout
      header={<Header id={id} />}
      main={<Main id={id} />}
      footer={<Footer id={id} />}
    >
    </Layout>
  );
}

export default RecipeForm;
