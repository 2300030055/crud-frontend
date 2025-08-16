import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ConfirmModal from './ConfirmModal';

function App() {
  const [product, setProduct] = useState({
    id: '',
    name: '',
    os: '',
    price: ''
  });

  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const BASE_URL = 'http://localhost:8082';

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${BASE_URL}/update`, product);
        alert('Update successful');
        setIsEditing(false);
      } else {
        await axios.post(`${BASE_URL}/insert`, product);
        alert('Insert successful');
      }
      setProduct({ id: '', name: '', os: '', price: '' });
      fetchProducts();
    } catch (error) {
      console.error('Error:', error);
      alert('Operation failed');
    }
  };

  const fetchProducts = async () => {
    const res = await axios.get(`${BASE_URL}/display`);
    setProducts(res.data);
  };

  const editProduct = (p) => {
    setProduct(p);
    setIsEditing(true);
  };

  // Trigger Modal
  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  // Confirm Modal Delete
  const confirmDelete = async () => {
    try {
      const res = await axios.delete(`${BASE_URL}/delete/${selectedId}`);
      alert(res.data);
      fetchProducts();
    } catch (error) {
      alert('Failed to delete product');
    }
    setShowModal(false);
    setSelectedId(null);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="container mt-4">
      <div className="form-container">
        <h2 className="text-center mb-4">
          {isEditing ? 'Edit Product' : 'Add Product'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group row">
            <label htmlFor="id" className="col-sm-3 col-form-label form-label">ID:</label>
            <div className="col-sm-9">
              <input
                type="number"
                name="id"
                id="id"
                className="form-control"
                value={product.id}
                onChange={handleChange}
                required
                disabled={isEditing}
              />
            </div>
          </div>

          <div className="form-group row">
            <label htmlFor="name" className="col-sm-3 col-form-label form-label">Name:</label>
            <div className="col-sm-9">
              <input
                type="text"
                name="name"
                id="name"
                className="form-control"
                value={product.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group row">
            <label htmlFor="os" className="col-sm-3 col-form-label form-label">OS:</label>
            <div className="col-sm-9">
              <input
                type="text"
                name="os"
                id="os"
                className="form-control"
                value={product.os}
                onChange={handleChange}/>

            </div>
          </div>

          <div className="form-group row">
            <label htmlFor="price" className="col-sm-3 col-form-label form-label">Price:</label>
            <div className="col-sm-9">
              <input
                type="text"
                name="price"
                id="price"
                className="form-control"
                value={product.price}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="text-center mt-3">
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Update' : 'Insert'}
            </button>
            {isEditing && (
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => {
                  setIsEditing(false);
                  setProduct({ id: '', name: '', os: '', price: '' });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <h3 className="text-center">Product List</h3>
      <table className="table table-bordered table-striped mt-3">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>OS</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.os}</td>
              <td>{p.price}</td>
              <td className="actions-cell">
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => editProduct(p)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteClick(p.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Popup Modal */}
      {showModal && (
        <ConfirmModal
          message="Are you sure you want to delete this product?"
          onConfirm={confirmDelete}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default App;
