/**
 * Authentication Debug Utility
 * 
 * This utility helps debug authentication issues by providing
 * detailed logging and cookie inspection.
 */

export function debugAuthState() {
  if (typeof window === 'undefined') return;

  console.log('=== Authentication Debug Info ===');
  
  // Check cookies
  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
  
  console.log('Available cookies:', cookies);
  console.log('Auth token cookie:', cookies['auth-token'] ? 'Present' : 'Missing');
  
  // Check localStorage
  console.log('LocalStorage auth data:', localStorage.getItem('auth-data'));
  
  // Check sessionStorage
  console.log('SessionStorage auth data:', sessionStorage.getItem('auth-data'));
  
  // Check if we're in an iframe (which can cause cookie issues)
  console.log('Is in iframe:', window !== window.top);
  
  // Check current domain
  console.log('Current domain:', window.location.hostname);
  console.log('Current protocol:', window.location.protocol);
  
  console.log('=== End Debug Info ===');
}

export function clearAllAuthData() {
  if (typeof window === 'undefined') return;

  console.log('Clearing all authentication data...');
  
  // Clear cookies
  document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname + ';';
  
  // Clear localStorage
  localStorage.removeItem('auth-data');
  localStorage.removeItem('user');
  
  // Clear sessionStorage
  sessionStorage.removeItem('auth-data');
  sessionStorage.removeItem('user');
  
  console.log('All authentication data cleared');
}

export function testAuthEndpoint() {
  if (typeof window === 'undefined') return;

  console.log('Testing authentication endpoint...');
  
  fetch('/api/auth/me', {
    credentials: 'include',
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  })
  .then(response => {
    console.log('Auth endpoint response status:', response.status);
    console.log('Auth endpoint response headers:', Object.fromEntries(response.headers.entries()));
    return response.json();
  })
  .then(data => {
    console.log('Auth endpoint response data:', data);
  })
  .catch(error => {
    console.error('Auth endpoint test failed:', error);
  });
}
