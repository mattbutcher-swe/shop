import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ItemSelector from './ItemSelector';
import Modal from '../components/Modal';
import { useSearchParams } from "react-router-dom";

import '../App.css';

const Header = () => <span>List</span>;

const Main = ({ setSubmitOrderFn }) => {
  const [ingredients, setIngredients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIngredient, setActiveIngredient] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [pendingAuthCode, setPendingAuthCode] = useState(null);

  const fetchIngredients = async () => {
    const url = 'http://localhost:8080/shopping-list/';

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      setIngredients(json);

      const initialQuantities = {};
      json.forEach((ingredient) => {
        const id = ingredient.ingredientDTO.id;
        const purchaseQuantity = ingredient.ingredientDTO.purchaseQuantity || 0;
        initialQuantities[id] = purchaseQuantity;
      });
      setQuantities(initialQuantities);
      setLoading(false);
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
          id: selectedProduct.upc,
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
        };

        return ingredientToUpdate;
      }

      return ingredient;
    });

    const url = 'http://localhost:8080/shopping-list/link-item';

    await fetch(url, {
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
  };

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
        upc: ingredient.ingredientDTO.krogerItemDTO.id.toString(),
        quantity: quantities[ingredient.ingredientDTO.id],
        modality: "PICKUP"
      }));

    if (orderItems.length === 0) {
      alert("No items selected for ordering.");
      return;
    }

    const authCode = searchParams.get("code");
    if (authCode) {
      try {
        const response = await fetch(`http://localhost:8080/kroger/add/${authCode}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ items: orderItems })
        });

        if (!response.ok) {
          throw new Error(`Submission failed: ${response.status}`);
        }

        console.log('Order submitted successfully:');
        window.history.replaceState(null, '', window.location.pathname);
        alert('Order submitted!');
      } catch (error) {
        console.error('Error submitting order:', error);
        alert('Error submitting order. Check console for details.');
      }
    } else {
      window.location.href = "https://api.kroger.com/v1/connect/oauth2/authorize?scope=cart.basic:write&response_type=code&client_id=shopprod-bbc64t5q&redirect_uri=http://localhost/list";
    }
  };

  useEffect(() => {
    const authCode = searchParams.get("code");
    if (authCode) {
      setPendingAuthCode(authCode);
    }
    fetchIngredients();
  }, []);

  useEffect(() => {
    if (pendingAuthCode && ingredients.length > 0 && !loading) {
      submitOrder();
      setPendingAuthCode(null);
    }
  }, [pendingAuthCode, ingredients, loading]);

  useEffect(() => {
    if (typeof setSubmitOrderFn === 'function') {
      setSubmitOrderFn(() => submitOrder);
    }
  }, [ingredients, quantities]);

  return (
    <div className="v-stack-fill">
      <div className="v-grow-scroll allow-horizontal-scroll">
        {loading ? (
          <div className='d-flex h-100 justify-content-center align-items-center' style={{ textAlign: 'center', padding: '2rem' }}>
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : (
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
