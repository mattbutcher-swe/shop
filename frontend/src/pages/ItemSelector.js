import React, { useState, useEffect } from 'react';

const ItemSelector = ({ isOpen, activeIngredient }) => {
  const [krogerItems, setKrogerItems] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
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

  useEffect(() => {
    if (!isOpen || !activeIngredient) return;
    fetchKrogerItems();
  }, [isOpen, activeIngredient]);

  return (
    <div className='container-lg h-100'>
      {loading ? (
        <div className='d-flex h-100 justify-content-center align-items-center' style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="spinner-border text-primary" role="status">
          </div>
        </div>
      ) : (
        <form>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {krogerItems.map((product) => {
              const frontImage = product.images?.find(img => img.perspective === 'front' && img.featured);
              const thumbnail = frontImage?.sizes?.find(size => size.size === 'medium')?.url
                || 'https://via.placeholder.com/75';

              const item = product.items[0];
              const size = item?.size || '-';

              const price = item?.price?.regular || "-";
              const promo = item?.price?.promo || null;

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
                      value={product.productId}
                      checked={selectedProductId === product.productId}
                      onChange={() => setSelectedProductId(product.productId)}
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
                            <del>{price}</del>{' '}
                            <strong style={{ color: 'green' }}>{promo}</strong>
                          </>
                        ) : price}
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
  );
};

export default ItemSelector;
