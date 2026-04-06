// Test de connexion direct
export const testConnection = async () => {
  try {
    console.log('Testing direct connection to Learning Service...');
    
    const response = await fetch('http://localhost:3002/api/texts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Connection successful!', data);
      return true;
    } else {
      console.error('❌ Connection failed:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.error('❌ Network error:', error);
    return false;
  }
};

// Auto-test au chargement
if (typeof window !== 'undefined') {
  setTimeout(() => {
    console.log('🔧 Testing connection...');
    testConnection();
  }, 1000);
}
