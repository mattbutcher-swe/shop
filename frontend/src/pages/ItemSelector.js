import React, { useState, useEffect } from 'react';

const ItemSelector = ({ isOpen, activeIngredient, linkKrogerItem }) => {
  const [krogerItems, setKrogerItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchKrogerItems = async () => {
    const url = "http://localhost:8080/kroger/search/" + activeIngredient;

    try {
      setLoading(true);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      setKrogerItems(json.data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  const formatPrice = (price) => {
    if (price == null) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  useEffect(() => {
    if (!isOpen || !activeIngredient) return;
    fetchKrogerItems();
  }, [isOpen, activeIngredient]);

  return (
    <>
      <div className="modal-content v-grow-scroll" onClick={(e) => e.stopPropagation()}>
        <div className='container-lg h-100'>
          {loading ? (
            <div className='d-flex h-100 justify-content-center align-items-center' style={{ textAlign: 'center', padding: '2rem' }}>
              <div className="spinner-border text-primary" role="status">
              </div>
            </div>
          ) : (
            <form id="item-selection-form" onSubmit={(e) => {
              e.preventDefault();
              if (selectedProduct) {
                linkKrogerItem(selectedProduct);
              }
            }}>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {krogerItems.map((product) => {
                  const frontImage = product.images?.find(img => img.perspective === 'front' && img.featured);
                  const thumbnail = frontImage?.sizes?.find(size => size.size === 'medium')?.url
                    || 'https://via.placeholder.com/75';

                  const item = product.items[0];
                  const size = item?.size || '-';
                  const price = item?.price?.regular || "-";
                  const promo = item?.price?.promo || null;

                  const enrichedProduct = {
                    id: product.productId,
                    size,
                    price,
                    promo,
                    name: product.description
                  };

                  if (!selectedProduct) {
                    setSelectedProduct(enrichedProduct);
                  }

                  return (
                    <li key={product.productId} style={{ marginBottom: '1rem' }}>
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center', // Vertically centers input, image, and text
                          gap: '1rem',
                        }}
                      >
                        <input
                          type="radio"
                          name="product"
                          onChange={() => setSelectedProduct(enrichedProduct)}
                          style={{ alignSelf: 'center' }} // Ensures vertical centering
                        />
                        <img
                          src={thumbnail}
                          alt={product.description}
                          style={{
                            width: '75px',
                            height: '75px',
                            objectFit: 'contain',
                            flexShrink: 0,
                          }}
                        />
                        <div style={{ lineHeight: '1.4' }}>
                          <strong>{product.description}</strong><br />
                          <span>Size: {size}</span><br />
                          <span>
                            Price:{' '}
                            {promo ? (
                              <>
                                <del>{formatPrice(price)}</del>{' '}
                                <strong style={{ color: 'green' }}>{formatPrice(promo)}</strong>
                              </>
                            ) : formatPrice(price)}
                          </span>
                        </div>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </form>
          )}
        </div>
      </div>
      <div className='d-flex bg-white p-2'>
        <button className="btn btn-primary ms-auto" form='item-selection-form'>Submit</button>
      </div>
    </>
  );
};

export default ItemSelector;
