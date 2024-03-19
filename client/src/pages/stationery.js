import React, { useState, useEffect } from 'react';
import axios from 'axios';

function StationeryPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/product/fetchavail');
      const productsWithImageUrl = await Promise.all(response.data.map(async product => {
        const imgResponse = await axios.get(`http://localhost:5000/api/product/downloadimg/${product.name}`, { responseType: 'blob' });
        const imageUrl = URL.createObjectURL(imgResponse.data);
        return { ...product, img: imageUrl };
      }));
      setProducts(productsWithImageUrl);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const openPopup = (productName, productPrice) => {
    // Display popup message
    var popupContainer = document.createElement('div');
    popupContainer.classList.add('popup-container');
    popupContainer.innerHTML = `
      <div className="green-tick">&#10004;</div>
      <div>Order added to the cart successfully!</div>
    `;
    document.body.appendChild(popupContainer);
    setTimeout(function() {
      document.body.removeChild(popupContainer);
    }, 3000);

    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    let existingItem = cart.find(item => item.name === productName);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ name: productName, quantity: 1, price: productPrice });
    }

    sessionStorage.setItem('cart', JSON.stringify(cart));
  };

  const DisplayProductImage = ({ productName, img }) => {
    const [loading, setLoading] = useState(!img); 

    useEffect(() => {
      if (!img && !sessionStorage.getItem(productName)) {
        
        axios.get(`http://localhost:5000/api/product/downloadimg/${productName}`, { responseType: 'blob' })
          .then(response => {
            const imageUrl = URL.createObjectURL(response.data);
            sessionStorage.setItem(productName, imageUrl);
            setLoading(false); 
          })
          .catch(error => {
            console.error('Error downloading image:', error);
            setLoading(false); 
          });
      } else {
        setLoading(false); 
      }
    }, [productName, img]); 

    return loading ? <div>Loading...</div> : (
      <img
        src={img || sessionStorage.getItem(productName)} // 
        alt={productName}
        style={productCardStyle}
      />
    );
  };

  const productCardStyle = {
    width: '200px',
    height: '200px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <section className="product-list">
      <div className="product-grid">
        {products.map(product => (
          <div key={product._id} className="product-card">
            <DisplayProductImage productName={product.name} img={product.img} />
            <p>Name: {product.name}</p>
            <p>Price: {product.price}</p>
            <button onClick={() => openPopup(product.name, product.price)} className="add_btn">Add to Cart</button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default StationeryPage;
