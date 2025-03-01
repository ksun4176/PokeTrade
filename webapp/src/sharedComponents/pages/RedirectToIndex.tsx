import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Redirect other routes to '/'
 */
export default function RedirectToIndex() {
  const navigate = useNavigate();
  useEffect(()=>{
    navigate('/', { replace: true });
  }, [navigate]);
  return null; 
}
