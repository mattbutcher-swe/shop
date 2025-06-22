import React, { useState } from 'react';
import { useEffect } from 'react';
import Layout from '../components/Layout';
import ItemSelector from './ItemSelector';
import Modal from '../components/Modal';

import '../App.css';

const Header = () => (
  <span>List</span>
);

const Main = () => {
  const [ingredients, setIngredients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIngredient, setActiveIngredient] = useState(null);

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
        {ingredients.length > 0 ? (
          <div>
            <table className="table table-bordered">
              <thead className="thead-light sticky-top top-0">
                <tr>
                  <th>Needed Item</th>
                  <th>Needed Quantity</th>
                  <th>Purchase Item</th>
                  <th>Purchase Quantity</th>
                  <th>Recipes</th>
                </tr>
              </thead>
              <tbody>
                {ingredients.map((ingredient) => {
                  const storedQuantity = ingredient.ingredientDTO.quantity ?? 0;
                  const difference = ingredient.quantity - storedQuantity;

                  return (
                    <tr key={ingredient.ingredientDTO.id}>
                      <td>{ingredient.ingredientDTO.name}</td>
                      <td>
                        {difference <= 0 ? "Enough in stock" : difference}
                      </td>
                      <td>
                        {ingredient.krogerItem?.name || '-'}<br />
                        <span className="fake-link" onClick={() => {
                          setActiveIngredient(ingredient.ingredientDTO.name);
                          setIsModalOpen(true);
                        }}>Options</span>
                      </td>
                      <td><input type="number" /></td>
                      <td>
                        {ingredient.neededBy.map((recipe, index) => (
                          <div key={index}>{recipe}</div>
                        ))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No ingredients available</p>
        )}

      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ItemSelector isOpen={isModalOpen} activeIngredient={activeIngredient} />
      </Modal>
    </div>
  );
}

const Footer = ({ id }) => {
  return (
    <div className='d-flex flex-row justify-content-between'>
      <button className='btn btn-danger'>Back</button>
      <button type="submit" className='btn btn-primary'>Order</button>
    </div>
  );
};

const List = () => {
  return (
    <Layout
      header={<Header />}
      main={<Main />}
      footer={<Footer />}
    >
    </Layout>
  );
};

export default List;
