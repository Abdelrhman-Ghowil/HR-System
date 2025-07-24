// Simple test script to test employees API with a manually provided JWT token

const API_BASE_URL = 'https://hr-eval-sys.vercel.app';

// Replace this with your actual JWT token
const JWT_TOKEN = 'YOUR_ACTUAL_JWT_TOKEN_HERE';

async function testEmployeesWithToken() {
  console.log('='.repeat(70));
  console.log('🔑 TESTING EMPLOYEES API WITH BEARER TOKEN');
  console.log('='.repeat(70));
  console.log('\n📋 API Details:');
  console.log('Base URL:', API_BASE_URL);
  console.log('Endpoint:', '/api/employees/');
  console.log('Method: GET');
  console.log('Headers:');
  console.log('  - Authorization: Bearer <token>');
  console.log('  - Content-Type: application/json');
  console.log('='.repeat(70));
  
  if (JWT_TOKEN === 'YOUR_ACTUAL_JWT_TOKEN_HERE') {
    console.log('\n⚠️  WARNING: Please replace JWT_TOKEN with your actual token!');
    console.log('\n📝 How to get a JWT token:');
    console.log('1. Open the HR Evaluation app in your browser');
    console.log('2. Login with valid credentials');
    console.log('3. Open Developer Tools (F12)');
    console.log('4. Go to Application tab > Local Storage');
    console.log('5. Look for auth token or similar key');
    console.log('6. Copy the token value and replace JWT_TOKEN in this script');
    console.log('\n🔧 Alternative - Use curl command:');
    console.log(`curl -X GET "${API_BASE_URL}/api/employees/" \\`);
    console.log('     -H "Authorization: Bearer YOUR_TOKEN" \\');
    console.log('     -H "Content-Type: application/json"');
    console.log('\n='.repeat(70));
    return;
  }
  
  try {
    console.log('\n🚀 Making API request...');
    console.log('Token (first 20 chars):', JWT_TOKEN.substring(0, 20) + '...');
    
    const response = await fetch(`${API_BASE_URL}/api/employees/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('\n📡 Response received:');
    console.log('Status:', response.status, response.statusText);
    console.log('Content-Type:', response.headers.get('content-type'));
    
    if (response.ok) {
      const data = await response.json();
      console.log('\n✅ SUCCESS! Employees data retrieved:');
      console.log('='.repeat(50));
      
      // Display summary
      console.log('📊 Data Summary:');
      console.log('- Total employees:', data.count || 'Unknown');
      console.log('- Employees in this page:', data.results ? data.results.length : 0);
      console.log('- Has next page:', !!data.next);
      console.log('- Has previous page:', !!data.previous);
      
      // Display first few employees
      if (data.results && data.results.length > 0) {
        console.log('\n👥 Employee Records:');
        data.results.slice(0, 3).forEach((employee, index) => {
          console.log(`\n${index + 1}. Employee ID: ${employee.employee_id}`);
          console.log(`   User ID: ${employee.user_id}`);
          console.log(`   Status: ${employee.status}`);
          console.log(`   Departments: ${JSON.stringify(employee.departments)}`);
          console.log(`   Managerial Level: ${employee.managerial_level}`);
          console.log(`   Join Date: ${employee.join_date}`);
          console.log(`   Company: ${employee.company}`);
        });
        
        if (data.results.length > 3) {
          console.log(`\n... and ${data.results.length - 3} more employees`);
        }
      }
      
      // Display pagination info
      if (data.next || data.previous) {
        console.log('\n🔗 Pagination URLs:');
        if (data.next) console.log('Next page:', data.next);
        if (data.previous) console.log('Previous page:', data.previous);
      }
      
      console.log('\n='.repeat(50));
      console.log('🎉 API test completed successfully!');
      
    } else {
      const errorText = await response.text();
      console.log('\n❌ API Error:');
      console.log('Status:', response.status, response.statusText);
      console.log('Response body:', errorText);
      
      // Provide specific guidance based on error
      switch (response.status) {
        case 401:
          console.log('\n💡 Authentication failed:');
          console.log('- Token may be expired or invalid');
          console.log('- Try logging in again to get a fresh token');
          break;
        case 403:
          console.log('\n💡 Access forbidden:');
          console.log('- User may not have permission to view employees');
          console.log('- Check user role and permissions');
          break;
        case 404:
          console.log('\n💡 Endpoint not found:');
          console.log('- Check if the API URL is correct');
          console.log('- Verify the endpoint exists on the server');
          break;
        case 500:
          console.log('\n💡 Server error:');
          console.log('- There may be an issue with the backend');
          console.log('- Try again later or contact support');
          break;
        default:
          console.log('\n💡 Unexpected error occurred');
      }
    }
    
  } catch (error) {
    console.log('\n❌ Network Error:');
    console.log('Error message:', error.message);
    console.log('\n💡 Possible causes:');
    console.log('- Network connectivity issues');
    console.log('- CORS policy restrictions');
    console.log('- Server is down or unreachable');
    console.log('- Invalid URL or endpoint');
  }
  
  console.log('\n' + '='.repeat(70));
}

// Also test the users endpoint
async function testUsersWithToken() {
  if (JWT_TOKEN === 'YOUR_ACTUAL_JWT_TOKEN_HERE') {
    return; // Skip if no token provided
  }
  
  try {
    console.log('\n🔄 Testing Users API endpoint...');
    
    const response = await fetch(`${API_BASE_URL}/api/accounts/users/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Users API Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Users API successful!');
      console.log('Users found:', data.results ? data.results.length : 0);
      
      if (data.results && data.results.length > 0) {
        console.log('\n👤 Sample user data:');
        const user = data.results[0];
        console.log(JSON.stringify({
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role,
          title: user.title
        }, null, 2));
      }
    } else {
      console.log('❌ Users API failed:', response.status);
    }
  } catch (error) {
    console.log('❌ Users API error:', error.message);
  }
}

// Run the tests
async function runTests() {
  await testEmployeesWithToken();
  await testUsersWithToken();
}

runTests();