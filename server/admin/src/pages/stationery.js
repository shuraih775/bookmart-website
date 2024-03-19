import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ProductGrid = () => {
  const imgref = useRef(null);
  const nameref = useRef(null);
  const priceref = useRef(null);
  const availref = useRef(null);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/product/fetch');
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

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const saveEdit = async () => {
    try {
      const updatedProduct = {
        _id: editingProduct._id,
        name: nameref.current.value.trim(),
        price: priceref.current.value.trim(),
        availability: availref.current.value.trim(),
        img: editingProduct.img 
      };

      const response = await axios.put(`http://localhost:5000/api/product/update/${updatedProduct._id}`, updatedProduct);

      fetchProducts();
      cancelEdit();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const cancelEdit = () => {
    setEditingProduct(null);
  };

  const productCardStyle = {
    width: '200px',
    height: '200px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <div>
      <h1>Product Grid</h1>
      <div className="product-grid">
        {products.map(product => (
          <div key={product._id} className="product-card">
            {editingProduct && editingProduct._id === product._id ? (
              <div>
                <img src={product.img} alt={product.name} style={productCardStyle} />
                <input type="text" defaultValue={product.name} ref={nameref} />
                <input type="text" defaultValue={product.availability} ref={availref} />
                <input type="text" defaultValue={product.price} ref={priceref} />
                <button onClick={saveEdit}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
              </div>
            ) : (
              <div>
                <img src={product.img} alt={product.name} style={productCardStyle} />
                <p>Name: {product.name}</p>
                <p>Avail: {product.availability.toString()}</p>
                <p>Price: {product.price}</p>
                <button onClick={() => handleEdit(product)}>Edit</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
