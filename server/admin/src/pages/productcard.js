// ProductCard.js

import React from 'react';

const ProductCard = ({ product }) => {
  const { name, img, availability, price } = product;

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
      <img src={img} alt={name} style={{ maxWidth: '100%' }} />
      <h3>{name}</h3>
      <p>Availability: {availability}</p>
      <p>Price: {price}</p>
    </div>
  );
};

export default ProductCard;
