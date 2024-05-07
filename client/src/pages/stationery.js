import React, { useState, useEffect,useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function StationeryPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [filterSubtype, setFilterSubtype] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    type: 'all',
    subtype: 'all'
  });
  const navigate = useNavigate();
  const [typesWithSubtypes, setTypesWithSubtypes] = useState([]);

  const filterProducts = useCallback(() => {
    let filtered = products;
    if (appliedFilters.type !== 'all') {
      filtered = filtered.filter(product => product.type === appliedFilters.type);
    }
    if (appliedFilters.subtype !== 'all') {
      filtered = filtered.filter(product => product.subtype === appliedFilters.subtype);
    }
    setFilteredProducts(filtered);
  }, [products, appliedFilters]);
  useEffect(() => {
    fetchProducts();
  }, []);
  
  useEffect(() => {
    filterProducts();
  }, [appliedFilters,filterProducts]);
  
  useEffect(() => {
    setFilterSubtype('all');
  },[filterType]);
  
  

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://bookmart-website.onrender.com/api/product/available');
      const productsWithImageUrl = await Promise.all(response.data.map(async product => {
        const imgResponse = await axios.get(`https://bookmart-website.onrender.com/api/product/${product.name}/image`, { responseType: 'blob' });
        const imageUrl = URL.createObjectURL(imgResponse.data);
        return { ...product, img: imageUrl };
      }));
      setProducts(productsWithImageUrl);
      setFilteredProducts(productsWithImageUrl);
      
      
      const types = [...new Set(productsWithImageUrl.map(product => product.type))];
      const typesWithSubtypes = types.map(type => {
        const subtypes = [...new Set(productsWithImageUrl.filter(product => product.type === type).map(product => product.subtype))];
        return [type, subtypes];
      });
      setTypesWithSubtypes(typesWithSubtypes);
      
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  

  useEffect(() => {
    if (showFilters) {
      filterProducts();
    }
  }, [showFilters, appliedFilters,filterProducts]);

  const openPopup = (productName, productPrice) => {

    var popupContainer = document.createElement('div');
    popupContainer.classList.add('popup-container');
    popupContainer.innerHTML = `
  <div class='green-tick'>&#10004;</div>
  <div>Order added to the cart successfully!</div>
  <a class='btn-1' id="goToCart">Go to Cart</a>
`;
popupContainer.querySelector('#goToCart').addEventListener('click', () => {
   navigate('/cart');
});
    document.body.appendChild(popupContainer);
    setTimeout(function() {
      document.body.removeChild(popupContainer);
    }, 2000);

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let existingItem = cart.find(item => item.name === productName);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ name: productName, quantity: 1, price: productPrice });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
  };

  const handleApplyFilters = () => {
    
    setAppliedFilters({ type: filterType, subtype: filterSubtype });
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    setShowFilters(false);
    setFilterType('all');
    setAppliedFilters({ type: 'all', subtype: 'all' });
    
  };

  const DisplayProductImage = ({ productName, img }) => {
    const [loading, setLoading] = useState(!img); 

    useEffect(() => {
      if (!img && !localStorage.getItem(productName)) {
        
        axios.get(`https://bookmart-website.onrender.com/api/product/${productName}/image`, { responseType: 'blob' })
          .then(response => {
            const imageUrl = URL.createObjectURL(response.data);
            localStorage.setItem(productName, imageUrl);
            setLoading(false); 
          })
          .catch(error => {
            
            setLoading(false); 
          });
      } else {
        setLoading(false); 
      }
    }, [productName, img]); 

    return loading ? <div>Loading...</div> : (
      <img
        src={img || localStorage.getItem(productName)} 
        alt={productName}
        className='product-card-img'
      />
    );
  };

  return (
    <>
    <div className='filter-div'>
      {!showFilters ? (
  <button className='btn-1' id='filter-btn'  onClick={() => setShowFilters(!showFilters)}>Filter</button>
) : (
  <></>
)}

        
        {showFilters && (
          <div>
            <div>
              <label htmlFor="type">Type:</label>
              <select id="type" value={filterType} onChange={e => setFilterType(e.target.value)}>
                
                <option value="all">All</option>
                {typesWithSubtypes.map(([type, _]) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="subtype">Subtype:</label>
              <select id="subtype" value={filterSubtype} onChange={e => setFilterSubtype(e.target.value)}>
              
                <option value="all">All</option>
                {typesWithSubtypes.find(([type, _]) => type === filterType)?.[1].map(subtype => (
                  <option key={subtype} value={subtype}>{subtype}</option>
                ))}
              </select>
            </div>
            
            
            <button className='btn-1'  style={{marginRight:'0.5rem'}} onClick={handleApplyFilters}>Apply Filters</button>
            <button className='btn-1' style={{marginLeft:'0.5rem'}}  onClick={handleResetFilters}>Reset</button>
          </div>
        )}
        </div>
      <div className="product-list">
        <div className="product-grid">
          {filteredProducts.map(product => (
            <div key={product._id} className="product-card">
              <DisplayProductImage productName={product.name} img={product.img} />
              <div>
                <p>{product.name}</p>
                <b><p>Rs. {product.price}</p></b>
                <p style={{fontSize:'0.55rem'}}>({product.type} - {product.subtype})</p>
              </div>
              <div style={{height:'',alignItems:'center',paddingBottom:'0%'}}>
              <button id='add_btn' onClick={() => openPopup(product.name, product.price)} className="btn-1">Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      </>
    
  );
}

export default StationeryPage;
