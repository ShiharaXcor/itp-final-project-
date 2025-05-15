import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const { logout } = useContext(AuthContext);  // Use logout function from context
  const navigate = useNavigate();

  
  return navigate('/login');
};

export default Logout;
