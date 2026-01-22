
import { useNavigate } from 'react-router-dom';

export function clearSession() {
    localStorage.removeItem('token');
    sessionStorage.clear();
}

export function handleLogout(navigate) {
    clearSession();
    if (typeof navigate === 'function') {
        navigate('/login');
    } else {
        window.location.href = '/login';
    }
}

export function useLogout() {
    const navigate = useNavigate();
    return () => handleLogout(navigate);
}