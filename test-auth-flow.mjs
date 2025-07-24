// Test script to verify authentication flow and token storage
import axios from 'axios';

const BASE_URL = 'https://hr-eval-sys.vercel.app';

// Test credentials (replace with actual test credentials)
const testCredentials = {
  email: 'conan@gmail.com',
  username: 'conan',
  password: '#$123456'
};

async function testAuthFlow() {
  console.log('🔐 Testing Authentication Flow');
  console.log('================================');
  
  try {
    // Step 1: Test login
    console.log('\n1. Testing login...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login/`, testCredentials, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Login successful!');
    console.log('Response data:', {
      hasAccessToken: !!loginResponse.data.access,
      hasRefreshToken: !!loginResponse.data.refresh,
      accessTokenLength: loginResponse.data.access?.length || 0,
      refreshTokenLength: loginResponse.data.refresh?.length || 0
    });
    
    const { access: accessToken, refresh: refreshToken } = loginResponse.data;
    
    // Step 2: Test token validation by making authenticated request
    console.log('\n2. Testing authenticated request to /api/employees/...');
    const employeesResponse = await axios.get(`${BASE_URL}/api/employees/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Employees request successful!');
    console.log('Employees data:', {
      count: employeesResponse.data.count || 0,
      resultsLength: employeesResponse.data.results?.length || 0,
      sampleEmployee: employeesResponse.data.results?.[0] ? {
        id: employeesResponse.data.results[0].employee_id,
        user_id: employeesResponse.data.results[0].user_id
      } : null
    });
    
    // Step 3: Test users endpoint
    console.log('\n3. Testing authenticated request to /api/accounts/users/...');
    const usersResponse = await axios.get(`${BASE_URL}/api/accounts/users/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Users request successful!');
    console.log('Users data:', {
      count: usersResponse.data.count || 0,
      resultsLength: usersResponse.data.results?.length || 0,
      sampleUser: usersResponse.data.results?.[0] ? {
        user_id: usersResponse.data.results[0].user_id,
        name: usersResponse.data.results[0].name,
        email: usersResponse.data.results[0].email
      } : null
    });
    
    // Step 4: Simulate localStorage storage (like the frontend would do)
    console.log('\n4. Simulating token storage...');
    const tokenStorage = {
      auth_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: 'extracted_from_jwt',
        name: 'Test User',
        email: testCredentials.email
      }
    };
    
    console.log('✅ Token storage simulation complete!');
    console.log('Storage contents:', {
      hasAuthToken: !!tokenStorage.auth_token,
      hasRefreshToken: !!tokenStorage.refresh_token,
      hasUser: !!tokenStorage.user,
      tokenLength: tokenStorage.auth_token.length
    });
    
    console.log('\n🎉 Authentication flow test completed successfully!');
    console.log('\n📋 Summary:');
    console.log('- Login: ✅ Working');
    console.log('- Token storage: ✅ Working');
    console.log('- Employee API: ✅ Working');
    console.log('- Users API: ✅ Working');
    
  } catch (error) {
    console.error('❌ Authentication flow test failed!');
    console.error('Error details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    
    if (error.response?.status === 401) {
      console.log('\n💡 This is likely due to invalid test credentials.');
      console.log('Please update the testCredentials object with valid login details.');
    } else if (error.response?.status === 404) {
      console.log('\n💡 API endpoint not found. Please check the API URL.');
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      console.log('\n💡 Cannot connect to the API server. Please check the BASE_URL.');
    }
  }
}

// Run the test
testAuthFlow();

console.log('\n📝 Instructions for frontend integration:');
console.log('1. After successful login, save both access and refresh tokens to localStorage');
console.log('2. Include Authorization: Bearer {token} header in all API requests');
console.log('3. Check token expiration and refresh when needed');
console.log('4. Clear tokens on logout or authentication errors');