import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ItemSelector from './ItemSelector';
import Modal from '../components/Modal';

import '../App.css';

const Header = () => <span>List</span>;

const Main = ({ setSubmitOrderFn }) => {
  const [ingredients, setIngredients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIngredient, setActiveIngredient] = useState(null);
  const [quantities, setQuantities] = useState({});

  const fetchIngredients = async () => {
    const url = 'http://localhost:8080/shopping-list/';

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      console.log(json);
      setIngredients(json);

      const initialQuantities = {};
      json.forEach((ingredient) => {
        const id = ingredient.ingredientDTO.id;
        const purchaseQuantity = ingredient.ingredientDTO.purchaseQuantity || 0;
        initialQuantities[id] = purchaseQuantity;
      });
      setQuantities(initialQuantities);
    } catch (error) {
      console.error(error.message);
    }
  };

  const linkKrogerItem = async (selectedProduct) => {
    if (!activeIngredient) return;

    let ingredientToUpdate = null;

    const updatedIngredients = ingredients.map((ingredient) => {
      if (ingredient.ingredientDTO.name === activeIngredient) {
        const krogerItemDTO = {
          id: selectedProduct.id,
          name: selectedProduct.name,
          price: selectedProduct.promo ? selectedProduct.promo : selectedProduct.price,
          weight: selectedProduct.weight,
        };

        ingredientToUpdate = {
          ...ingredient,
          ingredientDTO: {
            ...ingredient.ingredientDTO,
            krogerItemDTO: krogerItemDTO,
          },
        }

        return ingredientToUpdate;
      }

      return ingredient;
    });

    const url = 'http://localhost:8080/shopping-list/link-item';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ingredientToUpdate.ingredientDTO)
    });

    setIngredients(updatedIngredients);
    setIsModalOpen(false);
  };

  const updateItemQuantity = async (quantity, ingredientDTO) => {
    ingredientDTO.purchaseQuantity = quantity;

    const url = 'http://localhost:8080/shopping-list/update-purchase-quantity';

    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ingredientDTO)
    });
  }

  const formatPrice = (price) => {
    if (price == null) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const subtotal = ingredients.reduce((acc, ingredient) => {
    const id = ingredient.ingredientDTO.id;
    const quantity = quantities[id] || 0;
    const price = ingredient.ingredientDTO.krogerItemDTO?.price || 0;
    return acc + price * quantity;
  }, 0);

  const submitOrder = async () => {
    const orderItems = ingredients
      .filter((ingredient) => ingredient.ingredientDTO.krogerItemDTO && quantities[ingredient.ingredientDTO.id] > 0)
      .map((ingredient) => ({
        krogerItemId: ingredient.ingredientDTO.krogerItemDTO.id,
        quantity: quantities[ingredient.ingredientDTO.id],
      }));

    if (orderItems.length === 0) {
      alert("No items selected for ordering.");
      return;
    }

    try {
      const response = await fetch('https://your-external-endpoint.com/submit-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: orderItems }),
      });

      if (!response.ok) {
        throw new Error(`Submission failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('Order submitted successfully:', result);
      alert('Order submitted!');
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Error submitting order. Check console for details.');
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  useEffect(() => {
    if (typeof setSubmitOrderFn === 'function') {
      setSubmitOrderFn(() => submitOrder);
    }
  }, [ingredients, quantities]);

  return (
    <div className="v-stack-fill">
      <div className="v-grow-scroll allow-horizontal-scroll">
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
                  const id = ingredient.ingredientDTO.id;

                  return (
                    <tr key={id}>
                      <td>{ingredient.ingredientDTO.name}</td>
                      <td>{difference <= 0 ? 'Enough in stock' : difference}</td>
                      <td>
                        {ingredient.ingredientDTO.krogerItemDTO ? (
                          <>
                            {ingredient.ingredientDTO.krogerItemDTO.name} ({formatPrice(ingredient.ingredientDTO.krogerItemDTO.price)})
                          </>
                        ) : (
                          'No item selected'
                        )}
                        <br />
                        <span
                          className="fake-link"
                          onClick={() => {
                            setActiveIngredient(ingredient.ingredientDTO.name);
                            setIsModalOpen(true);
                          }}
                        >
                          Options
                        </span>
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          value={ingredient.ingredientDTO.purchaseQuantity}
                          onChange={(e) => {
                            const newQuantities = {
                              ...quantities,
                              [id]: Number(e.target.value),
                            };
                            updateItemQuantity(e.target.value, ingredient.ingredientDTO);
                            setQuantities(newQuantities);
                          }}
                        />
                      </td>
                      <td>
                        {ingredient.neededBy.map((recipe, index) => (
                          <div key={index}>{recipe}</div>
                        ))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className='sticky-bottom bottom-0'>
                <tr>
                  <td colSpan="4" className="text-end"><strong>Estimated Subtotal:</strong></td>
                  <td><strong>{formatPrice(subtotal)}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <p>Loading ...</p>
        )}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ItemSelector
          isOpen={isModalOpen}
          activeIngredient={activeIngredient}
          linkKrogerItem={linkKrogerItem}
        />
      </Modal>
    </div>
  );
};

const Footer = ({ submitOrder }) => {
  return (
    <div className="d-flex flex-row justify-content-end">
      <button type="button" className="btn btn-primary" onClick={submitOrder}>
        Order
      </button>
    </div>
  );
};

const List = () => {
  const [submitOrderFn, setSubmitOrderFn] = useState(null);

  return (
    <Layout
      header={<Header />}
      main={<Main setSubmitOrderFn={setSubmitOrderFn} />}
      footer={<Footer submitOrder={submitOrderFn} />}
    />
  );
};

export default List;
