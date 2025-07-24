// Complete test script to login and fetch employees with Bearer token authentication

const API_BASE_URL = 'https://hr-eval-sys.vercel.app';

// Test credentials - replace with actual credentials
const TEST_CREDENTIALS = {
  email: 'test@example.com',
  username: 'testuser',
  password: 'testpassword'
};

async function loginAndGetToken() {
  try {
    console.log('\n🔐 Attempting to login and get JWT token...');
    console.log('Login URL:', `${API_BASE_URL}/api/auth/login/`);
    
    const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(TEST_CREDENTIALS)
    });
    
    console.log('Login Response Status:', loginResponse.status);
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login successful!');
      console.log('Token received:', loginData.access ? 'Yes' : 'No');
      
      if (loginData.access) {
        console.log('Access Token (first 50 chars):', loginData.access.substring(0, 50) + '...');
        return loginData.access;
      } else {
        console.log('Login response:', JSON.stringify(loginData, null, 2));
        return null;
      }
    } else {
      const errorText = await loginResponse.text();
      console.error('❌ Login failed:');
      console.error('Status:', loginResponse.status, loginResponse.statusText);
      console.error('Response:', errorText);
      return null;
    }
  } catch (error) {
    console.error('❌ Login error:', error.message);
    return null;
  }
}

async function testEmployeesAPI(jwtToken) {
  try {
    console.log('\n👥 Testing employees API endpoint...');
    console.log('URL:', `${API_BASE_URL}/api/employees/`);
    console.log('Using Bearer token:', jwtToken ? 'Yes' : 'No');
    
    const response = await fetch(`${API_BASE_URL}/api/employees/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response Status:', response.status);
    console.log('Response Headers:', {
      'content-type': response.headers.get('content-type'),
      'cache-control': response.headers.get('cache-control'),
      'www-authenticate': response.headers.get('www-authenticate')
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('\n✅ Success! Employee data received:');
      console.log('Response structure:', {
        hasResults: !!data.results,
        resultsCount: data.results ? data.results.length : 0,
        totalCount: data.count,
        hasNext: !!data.next,
        hasPrevious: !!data.previous
      });
      
      if (data.results && Array.isArray(data.results)) {
        console.log(`\n📊 Found ${data.results.length} employees out of ${data.count} total`);
        
        // Show first employee as example
        if (data.results.length > 0) {
          console.log('\n👤 First employee example:');
          const firstEmployee = data.results[0];
          console.log(JSON.stringify({
            employee_id: firstEmployee.employee_id,
            user_id: firstEmployee.user_id,
            status: firstEmployee.status,
            departments: firstEmployee.departments,
            managerial_level: firstEmployee.managerial_level,
            join_date: firstEmployee.join_date,
            company: firstEmployee.company
          }, null, 2));
        }
        
        console.log('\n🔗 Pagination:');
        console.log('Next page:', data.next || 'None');
        console.log('Previous page:', data.previous || 'None');
      }
      
      return data;
    } else {
      const errorText = await response.text();
      console.error('\n❌ API Error:');
      console.error('Status:', response.status, response.statusText);
      console.error('Response:', errorText);
      
      if (response.status === 401) {
        console.error('\n💡 Authentication failed. Token may be expired or invalid.');
      } else if (response.status === 403) {
        console.error('\n💡 Access forbidden. User may not have permission to view employees.');
      } else if (response.status === 404) {
        console.error('\n💡 Endpoint not found. Check if the API URL is correct.');
      }
      
      return null;
    }
  } catch (error) {
    console.error('\n❌ Network or parsing error:', error.message);
    console.error('Full error:', error);
    return null;
  }
}

async function testUsersAPI(jwtToken) {
  try {
    console.log('\n👤 Testing users API endpoint...');
    console.log('URL:', `${API_BASE_URL}/api/accounts/users/`);
    
    const response = await fetch(`${API_BASE_URL}/api/accounts/users/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Users API successful!');
      console.log('Users found:', data.results ? data.results.length : 0);
      
      if (data.results && data.results.length > 0) {
        console.log('\n👤 First user example:');
        const firstUser = data.results[0];
        console.log(JSON.stringify({
          user_id: firstUser.user_id,
          name: firstUser.name,
          email: firstUser.email,
          role: firstUser.role,
          title: firstUser.title
        }, null, 2));
      }
      
      return data;
    } else {
      const errorText = await response.text();
      console.error('❌ Users API Error:', response.status, errorText);
      return null;
    }
  } catch (error) {
    console.error('❌ Users API error:', error.message);
    return null;
  }
}

async function runCompleteTest() {
  console.log('='.repeat(80));
  console.log('🚀 COMPLETE EMPLOYEE API TEST WITH AUTHENTICATION');
  console.log('='.repeat(80));
  console.log('\n📋 This script will:');
  console.log('1. Attempt to login and get a JWT token');
  console.log('2. Use the token to fetch employees from /api/employees/');
  console.log('3. Also test /api/accounts/users/ endpoint');
  console.log('\n⚠️  Note: Update TEST_CREDENTIALS with valid login details');
  console.log('='.repeat(80));
  
  // Step 1: Login and get token
  const jwtToken = await loginAndGetToken();
  
  if (!jwtToken) {
    console.log('\n❌ Cannot proceed without a valid JWT token.');
    console.log('\n💡 To test manually with a token:');
    console.log('1. Login through the web app');
    console.log('2. Open browser dev tools > Application > Local Storage');
    console.log('3. Find the auth token and replace JWT_TOKEN in this script');
    console.log('4. Or use curl:');
    console.log(`   curl -H "Authorization: Bearer YOUR_TOKEN" \\`);
    console.log(`        -H "Content-Type: application/json" \\`);
    console.log(`        "${API_BASE_URL}/api/employees/"`);
    return;
  }
  
  // Step 2: Test employees API
  const employeesData = await testEmployeesAPI(jwtToken);
  
  // Step 3: Test users API
  const usersData = await testUsersAPI(jwtToken);
  
  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(80));
  console.log('Login:', jwtToken ? '✅ Success' : '❌ Failed');
  console.log('Employees API:', employeesData ? '✅ Success' : '❌ Failed');
  console.log('Users API:', usersData ? '✅ Success' : '❌ Failed');
  
  if (employeesData && usersData) {
    console.log('\n🎉 All tests passed! The API is working correctly with Bearer token authentication.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the error messages above.');
  }
  console.log('='.repeat(80));
}

// Run the complete test
runCompleteTest();