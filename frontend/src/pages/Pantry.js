import React, { useState } from 'react';
import { useEffect } from 'react';
import { distance } from 'fastest-levenshtein';
import Layout from '../components/Layout';
import '../App.css';

const Header = () => (
    <span>Pantry</span>
);

const Main = () => {
    const [ingredients, setIngredients] = useState([]);
    const [filteredIngredients, setFilteredIngredients] = useState([]);

    useEffect(() => {
        fetchIngredients();
    }, []);

    const isSimilar = (word, filter) => {
        word = word.toLowerCase();
        const maxDistance = Math.floor(word.length * 0.5);
        const close = distance(word, filter) <= maxDistance;
        const substring = word.includes(filter.toLowerCase());
        
        return close || substring;
    }

    const filterIngredients = (e) => {
        let filter = e.target.value;

        if (filter) {
            setFilteredIngredients(ingredients.filter(i => {
                return isSimilar(i.name, filter);
            }));
        } else {
            setFilteredIngredients(ingredients);
        }
    }

    const deleteIngredient = async (ingredient) => {
        if (window.confirm('Please confirm deletion')) {
            const url = "http://localhost:8080/pantry/delete/" + ingredient.id;
            try {
                const response = await fetch(url, { method: 'DELETE' });
                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`);
                }

                setIngredients((prev) => prev.filter(i => i.id !== ingredient.id));
                setFilteredIngredients((prev) => prev.filter(i => i.id !== ingredient.id));
            } catch (error) {
                console.error(error.message);
            }
        }
    }

    const updateIngredient = async (ingredient, e) => {
        const ingredientForm = e.target.closest('.ingredient-form');

        const ingredientData = {
            id: ingredient.id,
            name: ingredientForm.querySelector('[name="name"]').value,
            quantity: ingredientForm.querySelector('[name="quantity"]').value
        }

        try {
            const url = "http://localhost:8080/pantry/update";

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ingredientData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error updating ingredient', errorData);
                alert('Failed to update ingredient.');
                return;
            }

            const filter = document.getElementById('filter-input').value;

            setIngredients((prev) => prev.map(i =>
                i.id === ingredientData.id
                    ? { ...i, name: ingredientData.name, quantity: ingredientData.quantity }
                    : i
            ));
            if (filter) {
                setFilteredIngredients((ingredients) => ingredients.filter(i => {
                    if (i.id == ingredientData.id) {
                        return isSimilar(ingredientData.name, filter)
                    } else {
                        return true;
                    }
                }
                ));
            } else {
                setFilteredIngredients(ingredients);
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    const createIngredient = async (e) => {
        e.preventDefault();
        const ingredientForm = e.target.closest('.ingredient-form');

        let ingredientData = {
            name: ingredientForm.querySelector('[name="name"]').value,
            quantity: ingredientForm.querySelector('[name="quantity"]').value
        }

        try {
            const url = "http://localhost:8080/pantry/create";

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ingredientData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error creating ingredient', errorData);
                alert('Failed to create ingredient.');
                return;
            } else {
                ingredientData = await response.json();
                setIngredients((prev) => prev.concat(ingredientData));
                setFilteredIngredients((prev) => prev.concat(ingredientData));
            }

            ingredientForm.querySelector('[name="name"]').value = "";
            ingredientForm.querySelector('[name="quantity"]').value = "";

        } catch (error) {
            console.error(error.message);
        }
    }

    const fetchIngredients = async () => {
        const url = "http://localhost:8080/pantry";

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const json = await response.json();
            setIngredients(json);
            setFilteredIngredients(json);
        } catch (error) {
            console.error(error.message);
        }
    }

    return (
        <div className='v-stack-fill'>
            <div className="form-group row mb-2">
                <div className="col-sm-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Filter"
                        onChange={(e) => filterIngredients(e)}
                        id='filter-input'
                    />
                </div>
            </div>
            <form className="form-group row ingredient-form mb-4" onSubmit={createIngredient}>
                <div className="col-sm-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Name"
                        name='name'
                        required
                    />
                </div>
                <div className="col-sm-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Quantity"
                        name='quantity'
                        required
                    />
                </div>
                <div className="col-sm-4 d-flex justify-content-end">
                    <button
                        type="submit"
                        className='btn btn-primary'
                    >
                        Create
                    </button>
                </div>
            </form>
            <div className='v-grow-scroll'>
                {filteredIngredients.map((ingredient) => (
                    <div className="form-group row ingredient-form mb-2" key={ingredient.id}>
                        <div className="col-sm-4">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Name"
                                name='name'
                                defaultValue={ingredient.name}
                                required
                            />
                        </div>
                        <div className="col-sm-4">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Out of stock"
                                name='quantity'
                                defaultValue={ingredient.quantity}
                            />
                        </div>
                        <div className="col-sm-4 d-flex justify-content-end">
                            <button
                                type="button"
                                className='btn btn-danger'
                                onClick={() => deleteIngredient(ingredient)}
                            >
                                Delete
                            </button>
                            <button
                                type="button"
                                className='btn btn-primary ms-2'
                                onClick={(e) => updateIngredient(ingredient, e)}
                            >
                                Update
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const Pantry = () => {
    return (
        <Layout
            header={<Header />}
            main={<Main />}
        >
        </Layout>
    );
};

export default Pantry;
