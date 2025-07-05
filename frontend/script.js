// Helper: API base URL
const API_BASE = 'http://localhost:3000/api';

// Toast notification function
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = 'toast show' + (type === 'error' ? ' error' : '');
  setTimeout(() => {
    toast.className = 'toast' + (type === 'error' ? ' error' : '');
  }, 2500);
}

// Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const phone = document.getElementById('loginPhone').value;
    const password = document.getElementById('loginPassword').value;
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      showToast('Login successful!');
      setTimeout(() => window.location.href = 'index.html', 1200);
    } else {
      showToast(data.message || 'Login failed', 'error');
    }
  });
}

// Toggle Login/Register Forms
const showLoginBtn = document.getElementById('showLoginBtn');
const showRegisterBtn = document.getElementById('showRegisterBtn');
const loginContainer = document.getElementById('loginContainer');
const registerContainer = document.getElementById('registerContainer');
if (showLoginBtn && showRegisterBtn && loginContainer && registerContainer) {
  showLoginBtn.addEventListener('click', () => {
    showLoginBtn.classList.add('active');
    showRegisterBtn.classList.remove('active');
    loginContainer.style.display = '';
    registerContainer.style.display = 'none';
  });
  showRegisterBtn.addEventListener('click', () => {
    showRegisterBtn.classList.add('active');
    showLoginBtn.classList.remove('active');
    loginContainer.style.display = 'none';
    registerContainer.style.display = '';
  });
}

// Register
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const phone = document.getElementById('registerPhone').value;
    const address = document.getElementById('registerAddress').value;
    const password = document.getElementById('registerPassword').value;
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, address, password })
    });
    const data = await res.json();
    if (res.ok) {
      registerForm.reset();
      showToast('Registration successful! Please login.');
      // Switch to login view after short delay
      setTimeout(() => {
        showLoginBtn.classList.add('active');
        showRegisterBtn.classList.remove('active');
        loginContainer.style.display = '';
        registerContainer.style.display = 'none';
      }, 1200);
    } else {
      showToast(data.message || 'Registration failed', 'error');
    }
  });
}

// --- State and City Data (short sample, can be extended) ---
const stateCityData = {
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Amravati', 'Kolhapur', 'Nanded', 'Sangli'],
  'Karnataka': ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubballi', 'Belagavi', 'Davanagere', 'Ballari', 'Tumakuru', 'Shivamogga', 'Bidar'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Meerut', 'Prayagraj', 'Ghaziabad', 'Noida', 'Bareilly', 'Aligarh'],
  'Delhi': ['New Delhi', 'Dwarka', 'Rohini', 'Pitampura', 'Saket', 'Karol Bagh', 'Vasant Kunj', 'Lajpat Nagar', 'Janakpuri', 'Connaught Place'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Vellore', 'Erode', 'Thoothukudi', 'Dindigul'],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Bardhaman', 'Malda', 'Baharampur', 'Kharagpur', 'Haldia'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Gandhinagar', 'Junagadh', 'Gandhidham', 'Nadiad'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur', 'Bhilwara', 'Alwar', 'Sikar', 'Pali'],
  'Madhya Pradesh': ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas', 'Satna', 'Ratlam', 'Rewa'],
  'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Arrah', 'Begusarai', 'Katihar', 'Munger'],
  // ... add all other states and union territories
};

// Populate state dropdown
const stateSelect = document.getElementById('state');
if (stateSelect) {
  stateSelect.innerHTML = '<option value="">Select State</option>' +
    Object.keys(stateCityData).map(state => `<option value="${state}">${state}</option>`).join('');
}

// City autocomplete logic
const cityInput = document.getElementById('city');
const citySuggestionsDiv = document.getElementById('citySuggestions');
let currentCitySuggestions = [];
if (stateSelect && cityInput && citySuggestionsDiv) {
  cityInput.addEventListener('input', function() {
    const state = stateSelect.value;
    const val = cityInput.value.trim().toLowerCase();
    citySuggestionsDiv.innerHTML = '';
    if (!state || !val) return;
    const cities = stateCityData[state] || [];
    currentCitySuggestions = cities.filter(city => city.toLowerCase().startsWith(val));
    if (currentCitySuggestions.length > 0) {
      const list = document.createElement('div');
      list.className = 'city-suggestions-list';
      currentCitySuggestions.forEach(city => {
        const item = document.createElement('div');
        item.className = 'city-suggestion-item';
        item.textContent = city;
        item.addEventListener('mousedown', function(e) {
          e.preventDefault();
          cityInput.value = city;
          citySuggestionsDiv.innerHTML = '';
        });
        list.appendChild(item);
      });
      citySuggestionsDiv.appendChild(list);
    }
  });
  // Hide suggestions on blur
  cityInput.addEventListener('blur', function() {
    setTimeout(() => { citySuggestionsDiv.innerHTML = ''; }, 150);
  });
}

// List Food (updated)
const listFoodForm = document.getElementById('listFoodForm');
if (listFoodForm) {
  listFoodForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const msgDiv = document.getElementById('listFoodMessage');
    if (!token) {
      showToast('You must be logged in to list food. Redirecting to login...', 'error');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1500);
      return;
    }
    const amount = document.getElementById('amount').value;
    const dishes = document.getElementById('dishes').value;
    const expiry = document.getElementById('expiry').value;
    const venue = document.getElementById('venue').value;
    const state = document.getElementById('state').value;
    const city = document.getElementById('city').value;
    const declaration = document.getElementById('declaration').checked;
    let custom_city = '';
    // If city is not in suggestions, treat as custom
    if (state && city && (!stateCityData[state] || !stateCityData[state].includes(city))) {
      custom_city = city;
    }
    const res = await fetch(`${API_BASE}/food/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ amount, dishes, expiry, venue, state, city: custom_city ? '' : city, custom_city, declaration })
    });
    const data = await res.json();
    if (res.ok) {
      showToast('Food listed successfully!');
      listFoodForm.reset();
    } else {
      showToast(data.message || 'Failed to list food', 'error');
    }
  });
}

// --- Food Table Display and Filtering ---
const foodTableBody = document.getElementById('foodTableBody');
const filterCityInput = document.getElementById('filterCity');
if (foodTableBody) {
  let allFoods = [];
  // Fetch available food with donor info
  fetch(`${API_BASE}/food`)
    .then(res => res.json())
    .then(foods => {
      allFoods = foods;
      renderFoodTable(foods);
    });

  function renderFoodTable(foods) {
    const isMobile = window.innerWidth <= 700;
    const mobileList = document.getElementById('mobileFoodList');
    if (isMobile && mobileList) {
      document.querySelector('.table-responsive').style.display = 'none';
      mobileList.style.display = 'block';
      mobileList.innerHTML = '';
      if (!foods.length) {
        mobileList.innerHTML = '<div class="mobile-card" style="text-align:center;">No food available right now.</div>';
        return;
      }
      foods.forEach(food => {
        const card = document.createElement('div');
        card.className = 'mobile-card';
        card.innerHTML = `
          <div><b>Donor Name:</b> ${food.donor_name || 'Unknown'}</div>
          <div><b>State:</b> ${food.state || ''}</div>
          <div><b>City:</b> ${food.city || food.custom_city || ''}</div>
          <div><b>Venue:</b> ${food.venue}</div>
          <div><b>Amount:</b> ${food.amount}</div>
          <div><b>Dishes:</b> ${food.dishes}</div>
          <div><b>Expiry:</b> ${food.expiry ? new Date(food.expiry).toLocaleString() : ''}</div>
          <div><b>Food Code:</b> ${food.food_code || ''}</div>
          <button class="btn claim-btn" data-id="${food.id}">Claim</button>
        `;
        mobileList.appendChild(card);
      });
      // Add claim handlers
      mobileList.querySelectorAll('.claim-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const id = btn.getAttribute('data-id');
          const token = localStorage.getItem('token');
          if (!token) {
            showToast('You must be logged in to claim food. Redirecting to login...', 'error');
            setTimeout(() => {
              window.location.href = 'login.html';
            }, 1500);
            return;
          }
          const res = await fetch(`${API_BASE}/food/claim/${id}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await res.json();
          if (res.ok) {
            showToast('Food claimed successfully!');
            setTimeout(() => window.location.reload(), 1000);
          } else {
            showToast(data.message || 'Failed to claim food', 'error');
          }
        });
      });
      return;
    } else if (mobileList) {
      mobileList.style.display = 'none';
      document.querySelector('.table-responsive').style.display = 'block';
    }
    // Desktop table rendering (unchanged)
    foodTableBody.innerHTML = '';
    if (!foods.length) {
      foodTableBody.innerHTML = '<tr><td colspan="9" style="text-align:center; color:#64748b;">No food available right now.</td></tr>';
      return;
    }
    foods.forEach(food => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td data-label="Donor Name">${food.donor_name || 'Unknown'}</td>
        <td data-label="State">${food.state || ''}</td>
        <td data-label="City">${food.city || food.custom_city || ''}</td>
        <td data-label="Venue">${food.venue}</td>
        <td data-label="Amount">${food.amount}</td>
        <td data-label="Dishes">${food.dishes}</td>
        <td data-label="Expiry">${food.expiry ? new Date(food.expiry).toLocaleString() : ''}</td>
        <td data-label="Food Code">${food.food_code || ''}</td>
        <td data-label="Claim"><button class="btn claim-btn" data-id="${food.id}">Claim</button></td>
      `;
      foodTableBody.appendChild(tr);
    });
    // Add claim handlers
    document.querySelectorAll('.claim-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = btn.getAttribute('data-id');
        const token = localStorage.getItem('token');
        if (!token) {
          showToast('You must be logged in to claim food. Redirecting to login...', 'error');
          setTimeout(() => {
            window.location.href = 'login.html';
          }, 1500);
          return;
        }
        const res = await fetch(`${API_BASE}/food/claim/${id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          showToast('Food claimed successfully!');
          setTimeout(() => window.location.reload(), 1000);
        } else {
          showToast(data.message || 'Failed to claim food', 'error');
        }
      });
    });
  }

  // City filter logic
  if (filterCityInput) {
    filterCityInput.addEventListener('input', function() {
      const val = filterCityInput.value.trim().toLowerCase();
      if (!val) {
        renderFoodTable(allFoods);
        return;
      }
      const filtered = allFoods.filter(food => {
        const city = (food.city || food.custom_city || '').toLowerCase();
        return city.includes(val);
      });
      renderFoodTable(filtered);
    });
  }
}

// Food History Page Logic (table version)
async function fetchFoodHistory() {
  const token = localStorage.getItem('token');
  const claimedTableBody = document.getElementById('claimedTableBody');
  const donatedTableBody = document.getElementById('donatedTableBody');
  const mobileClaimedList = document.getElementById('mobileClaimedList');
  const mobileDonatedList = document.getElementById('mobileDonatedList');
  const isMobile = window.innerWidth <= 700;
  const msgDiv = document.getElementById('historyMessage');
  if (!token) {
    if (claimedTableBody) claimedTableBody.innerHTML = '<tr><td colspan="5">Please login to view your history.</td></tr>';
    if (donatedTableBody) donatedTableBody.innerHTML = '<tr><td colspan="5">Please login to view your history.</td></tr>';
    if (mobileClaimedList) mobileClaimedList.innerHTML = '<div class="mobile-card">Please login to view your history.</div>';
    if (mobileDonatedList) mobileDonatedList.innerHTML = '<div class="mobile-card">Please login to view your history.</div>';
    return;
  }
  // Fetch claimed food
  if (claimedTableBody && mobileClaimedList) {
    if (isMobile) {
      claimedTableBody.parentElement.style.display = 'none';
      mobileClaimedList.style.display = 'block';
      mobileClaimedList.innerHTML = '<div class="mobile-card">Loading...</div>';
    } else {
      claimedTableBody.parentElement.style.display = 'block';
      mobileClaimedList.style.display = 'none';
      claimedTableBody.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';
    }
    try {
      const res = await fetch(`${API_BASE}/food/claimed`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (isMobile) {
        if (res.ok && data.length > 0) {
          mobileClaimedList.innerHTML = '';
          data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'mobile-card';
            card.innerHTML = `
              <div><b>Quantity:</b> ${item.amount}</div>
              <div><b>Venue:</b> ${item.venue}</div>
              <div><b>Donor Phone:</b> ${item.donor_phone || ''}</div>
              <div><b>Donated By:</b> ${item.donor_name}</div>
              <div><b>Claimed Date:</b> ${item.claimed_at ? new Date(item.claimed_at).toLocaleString() : ''}</div>
            `;
            mobileClaimedList.appendChild(card);
          });
        } else {
          mobileClaimedList.innerHTML = '<div class="mobile-card">No claimed food history.</div>';
        }
      } else {
        if (res.ok && data.length > 0) {
          claimedTableBody.innerHTML = data.map(item => `
            <tr>
              <td data-label="Quantity">${item.amount}</td>
              <td data-label="Venue">${item.venue}</td>
              <td data-label="Donor Phone">${item.donor_phone || ''}</td>
              <td data-label="Donated By">${item.donor_name}</td>
              <td data-label="Claimed Date">${item.claimed_at ? new Date(item.claimed_at).toLocaleString() : ''}</td>
            </tr>
          `).join('');
        } else {
          claimedTableBody.innerHTML = '<tr><td colspan="5">No claimed food history.</td></tr>';
        }
      }
    } catch (err) {
      if (isMobile) {
        mobileClaimedList.innerHTML = '<div class="mobile-card">Error loading claimed food history.</div>';
      } else {
        claimedTableBody.innerHTML = '<tr><td colspan="5">Error loading claimed food history.</td></tr>';
      }
    }
  }
  // Fetch donated food
  if (donatedTableBody && mobileDonatedList) {
    if (isMobile) {
      donatedTableBody.parentElement.style.display = 'none';
      mobileDonatedList.style.display = 'block';
      mobileDonatedList.innerHTML = '<div class="mobile-card">Loading...</div>';
    } else {
      donatedTableBody.parentElement.style.display = 'block';
      mobileDonatedList.style.display = 'none';
      donatedTableBody.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';
    }
    try {
      const res = await fetch(`${API_BASE}/food/donated`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (isMobile) {
        if (res.ok && data.length > 0) {
          mobileDonatedList.innerHTML = '';
          data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'mobile-card';
            card.innerHTML = `
              <div><b>Quantity:</b> ${item.amount}</div>
              <div><b>Venue:</b> ${item.venue}</div>
              <div><b>Claimer Phone:</b> ${item.claimer_phone || ''}</div>
              <div><b>Claimed By:</b> ${item.claimer_name || 'Not yet claimed'}</div>
              <div><b>Donated Date:</b> ${item.claimed_at ? new Date(item.claimed_at).toLocaleString() : 'N/A'}</div>
            `;
            mobileDonatedList.appendChild(card);
          });
        } else {
          mobileDonatedList.innerHTML = '<div class="mobile-card">No donated food history.</div>';
        }
      } else {
        if (res.ok && data.length > 0) {
          donatedTableBody.innerHTML = data.map(item => `
            <tr>
              <td data-label="Quantity">${item.amount}</td>
              <td data-label="Venue">${item.venue}</td>
              <td data-label="Claimer Phone">${item.claimer_phone || ''}</td>
              <td data-label="Claimed By">${item.claimer_name || 'Not yet claimed'}</td>
              <td data-label="Donated Date">${item.claimed_at ? new Date(item.claimed_at).toLocaleString() : 'N/A'}</td>
            </tr>
          `).join('');
        } else {
          donatedTableBody.innerHTML = '<tr><td colspan="5">No donated food history.</td></tr>';
        }
      }
    } catch (err) {
      if (isMobile) {
        mobileDonatedList.innerHTML = '<div class="mobile-card">Error loading donated food history.</div>';
      } else {
        donatedTableBody.innerHTML = '<tr><td colspan="5">Error loading donated food history.</td></tr>';
      }
    }
  }
}

if (document.getElementById('claimedTableBody') || document.getElementById('donatedTableBody')) {
  fetchFoodHistory();
  const refreshBtn = document.getElementById('refreshHistoryBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', fetchFoodHistory);
  }
}

// List Excess Food button (placeholder functionality)
const listFoodBtn = document.getElementById('listFoodBtn');
if (listFoodBtn) {
  listFoodBtn.addEventListener('click', function(e) {
    // Remove this alert if you add real functionality
    // e.preventDefault(); // Uncomment if you want to prevent navigation
    // alert('Feature coming soon!');
  });
}

// Hamburger menu (mobile only)
function setupHamburger() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.getElementById('mobileNav');
  if (!hamburger || !mobileNav) return;
  function toggleNav() {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    mobileNav.hidden = expanded;
    hamburger.setAttribute('aria-expanded', !expanded);
  }
  hamburger.onclick = toggleNav;
  // Hide mobile nav if resizing to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 700) {
      mobileNav.hidden = true;
      hamburger.setAttribute('aria-expanded', false);
    }
  });
}
if (window.innerWidth <= 700) setupHamburger();

// Animated stats counter
function animateStats() {
  const stats = document.querySelectorAll('.stat-number');
  let started = false;
  function runCounter() {
    if (started) return;
    stats.forEach(stat => {
      const target = parseInt(stat.textContent.replace(/[^\d]/g, ''));
      let count = 0;
      const increment = Math.ceil(target / 100);
      const plus = stat.textContent.includes('+');
      function update() {
        count += increment;
        if (count >= target) {
          stat.textContent = target.toLocaleString() + (plus ? '+' : '');
        } else {
          stat.textContent = count.toLocaleString() + (plus ? '+' : '');
          requestAnimationFrame(update);
        }
      }
      update();
    });
    started = true;
  }
  function onScroll() {
    const section = document.querySelector('.stats-section');
    if (!section) return;
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      runCounter();
      window.removeEventListener('scroll', onScroll);
    }
  }
  window.addEventListener('scroll', onScroll);
  onScroll();
}
animateStats();

// Fade-in for gallery and hero slider images
function fadeInOnView(selector) {
  const els = document.querySelectorAll(selector);
  function check() {
    els.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 50) {
        el.style.opacity = 1;
        el.style.transform = 'none';
      }
    });
  }
  window.addEventListener('scroll', check);
  window.addEventListener('resize', check);
  check();
}
fadeInOnView('.gallery-item img');
fadeInOnView('.slide.active img'); 