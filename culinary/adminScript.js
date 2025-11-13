const defaultConfig = {
  background_color: "#667eea",
  surface_color: "#ffffff",
  text_color: "#2d3748",
  primary_action_color: "#667eea",
  secondary_action_color: "#48bb78",
  font_family: "sans-serif",
  font_size: 16,
  app_title: "Teacher Food Orders",
  subtitle: "Order delicious meals from our culinary program",
  menu_heading: "Today's Menu",
  orders_heading: "Current Orders"
};

const menuItems = [
  {
    id: "1",
    name: "Grilled Chicken Caesar Salad",
    description: "Fresh romaine lettuce tossed with our house-made Caesar dressing, topped with perfectly grilled chicken breast, aged parmesan cheese, and crispy croutons. A classic favorite that's both satisfying and nutritious.",
    price: "$8.50",
    emoji: "🥗"
  },
  {
    id: "2",
    name: "Margherita Pizza",
    description: "Traditional Italian pizza featuring fresh mozzarella cheese, ripe tomatoes, and aromatic basil leaves on our signature homemade dough. Baked to perfection in our wood-fired oven.",
    price: "$7.00",
    emoji: "🍕"
  },
  {
    id: "3",
    name: "Turkey Club Sandwich",
    description: "Premium sliced turkey breast layered with crispy bacon, fresh lettuce, and vine-ripened tomatoes on toasted artisan bread. Served with our house-made mayo and a side of chips.",
    price: "$6.50",
    emoji: "🥪"
  },
  {
    id: "4",
    name: "Vegetable Stir Fry",
    description: "A colorful medley of seasonal vegetables including bell peppers, broccoli, carrots, and snap peas, wok-tossed with our signature teriyaki sauce and served over steamed jasmine rice.",
    price: "$7.50",
    emoji: "🥘"
  },
  {
    id: "5",
    name: "Pasta Primavera",
    description: "Al dente penne pasta tossed with fresh seasonal vegetables in a light garlic cream sauce. Finished with herbs and parmesan cheese for a delightful vegetarian option.",
    price: "$8.00",
    emoji: "🍝"
  }
];

let currentOrders = [];
let activeOrderForm = null;
let nextOrderId = 1;

function initializeApp() {
    insertPartial("header.html", "header");
    insertPartial("interface.html", "interface");      
    insertPartial("teacher.html", "teacher");
    insertPartial("item.html", "item");
    insertPartial("kitchen.html", "kitchen");
    
    renderMenu();
    renderOrders();
    showInterfaceSelector();
}

async function insertPartial(file, elementId) {
  const response = await fetch(file);
  const data = await response.text();
  document.getElementById(elementId).innerHTML = data;
}

function showInterfaceSelector() {
  document.getElementById('interface-selector').style.display = 'flex';
  document.getElementById('teacher-interface').style.display = 'none';
  document.getElementById('culinary-interface').style.display = 'none';
}

function showTeacherInterface() {
  document.getElementById('interface-selector').style.display = 'none';
  document.getElementById('teacher-interface').style.display = 'block';
  document.getElementById('culinary-interface').style.display = 'none';
  document.getElementById('item-detail-interface').style.display = 'none';
}

function showCulinaryInterface() {
  document.getElementById('interface-selector').style.display = 'none';
  document.getElementById('teacher-interface').style.display = 'none';
  document.getElementById('culinary-interface').style.display = 'block';
  document.getElementById('item-detail-interface').style.display = 'none';
}

function showItemDetail(itemId) {
  document.getElementById('interface-selector').style.display = 'none';
  document.getElementById('teacher-interface').style.display = 'none';
  document.getElementById('culinary-interface').style.display = 'none';
  document.getElementById('item-detail-interface').style.display = 'block';
  renderItemDetail(itemId);
}

function renderItemDetail(itemId) {
  const item = menuItems.find(i => i.id === itemId);
  if (!item) return;

  const container = document.getElementById('item-detail-container');
  container.innerHTML = `
    <div class="item-detail">
      <div class="item-image">
        ${item.emoji}
      </div>
      <div class="item-info">
        <h3>${item.name}</h3>
        <div class="item-price">${item.price}</div>
        <div class="item-description">${item.description}</div>
        
        <div class="order-form-detail">
          <h4>Place Your Order</h4>
          <form onsubmit="submitOrderFromDetail(event, '${item.id}')">
            <div class="form-group">
              <label for="teacher-name-detail">Your Name</label>
              <input type="text" id="teacher-name-detail" required>
            </div>
            <div class="form-group">
              <label for="quantity-detail">Quantity</label>
              <input type="number" id="quantity-detail" min="1" value="1" required>
            </div>
            <div class="form-group">
              <label for="special-requests-detail">Special Requests (Optional)</label>
              <textarea id="special-requests-detail" placeholder="Any dietary restrictions or modifications?"></textarea>
            </div>
            <div class="form-actions">
              <button type="submit" class="submit-btn" id="submit-btn-detail">
                Place Order
              </button>
              <button type="button" class="cancel-btn" onclick="showTeacherInterface()">
                Back to Menu
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
}

function renderMenu() {
  const container = document.getElementById('menu-container');
  console.log(container)
  container.innerHTML = '';
  
  menuItems.forEach(item => {
    const menuItemEl = document.createElement('div');
    menuItemEl.className = 'menu-item';
    menuItemEl.innerHTML = `
      <div class="menu-item-header">
        <h3>${item.name}</h3>
        <span class="menu-item-price">${item.price}</span>
      </div>
      <p>${item.description}</p>
      <button class="order-btn" onclick="showItemDetail('${item.id}')">View & Order</button>
    `;
    container.appendChild(menuItemEl);
  });
}

function showOrderForm(itemId) {
  if (activeOrderForm) {
    hideOrderForm(activeOrderForm);
  }
  
  const form = document.getElementById(`order-form-${itemId}`);
  form.classList.add('active');
  activeOrderForm = itemId;
}

function hideOrderForm(itemId) {
  const form = document.getElementById(`order-form-${itemId}`);
  form.classList.remove('active');
  
  const formElement = form.querySelector('form');
  formElement.reset();
  
  if (activeOrderForm === itemId) {
    activeOrderForm = null;
  }
}

function submitOrder(event, itemId) {
  event.preventDefault();
  
  const submitBtn = document.getElementById(`submit-btn-${itemId}`);
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="loading-spinner"></span> Placing Order...';
  
  // Simulate loading delay
  setTimeout(() => {
    const menuItem = menuItems.find(item => item.id === itemId);
    const teacherName = document.getElementById(`teacher-name-${itemId}`).value;
    const quantity = parseInt(document.getElementById(`quantity-${itemId}`).value);
    const specialRequests = document.getElementById(`special-requests-${itemId}`).value;
    
    const orderData = {
      id: nextOrderId.toString(),
      menu_item_id: itemId,
      teacher_name: teacherName,
      item_name: menuItem.name,
      quantity: quantity,
      special_requests: specialRequests,
      order_date: new Date().toISOString(),
      status: "pending"
    };
    
    currentOrders.push(orderData);
    nextOrderId++;
    
    submitBtn.disabled = false;
    submitBtn.textContent = 'Place Order';
    
    hideOrderForm(itemId);
    renderOrders();
  }, 800);
}

function submitOrderFromDetail(event, itemId) {
  event.preventDefault();
  
  const submitBtn = document.getElementById('submit-btn-detail');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="loading-spinner"></span> Placing Order...';
  
  // Simulate loading delay
  setTimeout(() => {
    const menuItem = menuItems.find(item => item.id === itemId);
    const teacherName = document.getElementById('teacher-name-detail').value;
    const quantity = parseInt(document.getElementById('quantity-detail').value);
    const specialRequests = document.getElementById('special-requests-detail').value;
    
    const orderData = {
      id: nextOrderId.toString(),
      menu_item_id: itemId,
      teacher_name: teacherName,
      item_name: menuItem.name,
      quantity: quantity,
      special_requests: specialRequests,
      order_date: new Date().toISOString(),
      status: "pending"
    };
    
    currentOrders.push(orderData);
    nextOrderId++;
    
    submitBtn.disabled = false;
    submitBtn.textContent = 'Place Order';
    
    // Show success message and return to menu
    showTeacherInterface();
    renderOrders();
  }, 800);
}

function renderOrders() {
  const container = document.getElementById('orders-container');
  
  if (currentOrders.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No orders yet. Place your first order!</p></div>';
    return;
  }
  
  const sortedOrders = [...currentOrders].sort((a, b) => {
    if (a.status === 'pending' && b.status === 'completed') return -1;
    if (a.status === 'completed' && b.status === 'pending') return 1;
    return new Date(b.order_date) - new Date(a.order_date);
  });
  
  container.innerHTML = '';
  
  sortedOrders.forEach(order => {
    const orderEl = document.createElement('div');
    orderEl.className = `order-card ${order.status}`;
    
    const orderDate = new Date(order.order_date);
    const formattedDate = orderDate.toLocaleDateString() + ' ' + orderDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    orderEl.innerHTML = `
      <div class="order-header">
        <div class="order-info">
          <h4>${order.item_name}</h4>
          <p>${order.teacher_name} • ${formattedDate}</p>
        </div>
        <span class="order-status ${order.status}">${order.status === 'pending' ? 'Pending' : 'Completed'}</span>
      </div>
      <div class="order-details">
        <strong>Quantity:</strong> ${order.quantity}
        ${order.special_requests ? `<br><strong>Special Requests:</strong> ${order.special_requests}` : ''}
      </div>
      <div class="order-actions">
        ${order.status === 'pending' ? `
          <button class="complete-btn" onclick="completeOrder('${order.id}')" id="complete-btn-${order.id}">
            Mark Complete
          </button>
        ` : ''}
        <button class="delete-btn" onclick="deleteOrder('${order.id}')" id="delete-btn-${order.id}">
          Delete
        </button>
      </div>
    `;
    
    container.appendChild(orderEl);
  });
}

function completeOrder(orderId) {
  const completeBtn = document.getElementById(`complete-btn-${orderId}`);
  completeBtn.disabled = true;
  completeBtn.innerHTML = '<span class="loading-spinner"></span>';
  
  // Simulate loading delay
  setTimeout(() => {
    const orderIndex = currentOrders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
      currentOrders[orderIndex].status = "completed";
      renderOrders();
    }
  }, 500);
}

function deleteOrder(orderId) {
  const deleteBtn = document.getElementById(`delete-btn-${orderId}`);
  deleteBtn.disabled = true;
  deleteBtn.innerHTML = '<span class="loading-spinner"></span>';
  
  // Simulate loading delay
  setTimeout(() => {
    const orderIndex = currentOrders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
      currentOrders.splice(orderIndex, 1);
      renderOrders();
    }
  }, 500);
}



async function onConfigChange(config) {
  const appTitle = document.getElementById('app-title');
  const subtitle = document.getElementById('subtitle');
  const menuHeading = document.getElementById('menu-heading');
  const ordersHeading = document.getElementById('orders-heading');
  
  appTitle.textContent = config.app_title || defaultConfig.app_title;
  subtitle.textContent = config.subtitle || defaultConfig.subtitle;
  menuHeading.textContent = config.menu_heading || defaultConfig.menu_heading;
  ordersHeading.textContent = config.orders_heading || defaultConfig.orders_heading;
  
  const backgroundColor = config.background_color || defaultConfig.background_color;
  const surfaceColor = config.surface_color || defaultConfig.surface_color;
  const textColor = config.text_color || defaultConfig.text_color;
  const primaryActionColor = config.primary_action_color || defaultConfig.primary_action_color;
  const secondaryActionColor = config.secondary_action_color || defaultConfig.secondary_action_color;
  const fontFamily = config.font_family || defaultConfig.font_family;
  const fontSize = config.font_size || defaultConfig.font_size;
  
  document.body.style.background = `linear-gradient(135deg, ${backgroundColor} 0%, ${backgroundColor} 100%)`;
  
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.style.backgroundColor = surfaceColor;
  });
  
  const headers = document.querySelectorAll('.card h2');
  headers.forEach(header => {
    header.style.color = textColor;
    header.style.fontSize = `${fontSize * 1.5}px`;
  });
  
  const menuItemHeaders = document.querySelectorAll('.menu-item h3');
  menuItemHeaders.forEach(header => {
    header.style.color = textColor;
    header.style.fontSize = `${fontSize * 1.1}px`;
  });
  
  const orderButtons = document.querySelectorAll('.order-btn');
  orderButtons.forEach(btn => {
    btn.style.backgroundColor = primaryActionColor;
    btn.style.fontSize = `${fontSize * 0.9}px`;
  });
  
  const submitButtons = document.querySelectorAll('.submit-btn');
  submitButtons.forEach(btn => {
    btn.style.backgroundColor = secondaryActionColor;
    btn.style.fontSize = `${fontSize}px`;
  });
  
  const completeButtons = document.querySelectorAll('.complete-btn');
  completeButtons.forEach(btn => {
    btn.style.backgroundColor = secondaryActionColor;
    btn.style.fontSize = `${fontSize * 0.85}px`;
  });
  
  document.body.style.fontFamily = `${fontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
  
  const headerTitle = document.querySelector('.header h1');
  const headerSubtitle = document.querySelector('.header p');
  headerTitle.style.fontSize = `${fontSize * 2.5}px`;
  headerSubtitle.style.fontSize = `${fontSize * 1.1}px`;
}

if (window.elementSdk) {
  window.elementSdk.init({
    defaultConfig,
    onConfigChange,
    mapToCapabilities: (config) => ({
      recolorables: [
        {
          get: () => config.background_color || defaultConfig.background_color,
          set: (value) => {
            config.background_color = value;
            window.elementSdk.setConfig({ background_color: value });
          }
        },
        {
          get: () => config.surface_color || defaultConfig.surface_color,
          set: (value) => {
            config.surface_color = value;
            window.elementSdk.setConfig({ surface_color: value });
          }
        },
        {
          get: () => config.text_color || defaultConfig.text_color,
          set: (value) => {
            config.text_color = value;
            window.elementSdk.setConfig({ text_color: value });
          }
        },
        {
          get: () => config.primary_action_color || defaultConfig.primary_action_color,
          set: (value) => {
            config.primary_action_color = value;
            window.elementSdk.setConfig({ primary_action_color: value });
          }
        },
        {
          get: () => config.secondary_action_color || defaultConfig.secondary_action_color,
          set: (value) => {
            config.secondary_action_color = value;
            window.elementSdk.setConfig({ secondary_action_color: value });
          }
        }
      ],
      borderables: [],
      fontEditable: {
        get: () => config.font_family || defaultConfig.font_family,
        set: (value) => {
          config.font_family = value;
          window.elementSdk.setConfig({ font_family: value });
        }
      },
      fontSizeable: {
        get: () => config.font_size || defaultConfig.font_size,
        set: (value) => {
          config.font_size = value;
          window.elementSdk.setConfig({ font_size: value });
        }
      }
    }),
    mapToEditPanelValues: (config) => new Map([
      ["app_title", config.app_title || defaultConfig.app_title],
      ["subtitle", config.subtitle || defaultConfig.subtitle],
      ["menu_heading", config.menu_heading || defaultConfig.menu_heading],
      ["orders_heading", config.orders_heading || defaultConfig.orders_heading]
    ])
  });
}

  
  
  initializeApp();
