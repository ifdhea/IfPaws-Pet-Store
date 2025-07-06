// Custom Cursor Implementation
document.addEventListener("DOMContentLoaded", () => {
  const cursor = document.createElement("div");
  cursor.id = "customCursor";
  cursor.className = "custom-cursor";
  document.body.appendChild(cursor);

  // Gerakkan cursor
  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";

    // Buat partikel
    createParticle(e.clientX, e.clientY);
  });

  // Efek hover
  document
    .querySelectorAll("a, button, .hover-effect, .cursor-pointer")
    .forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
    });

  // Fungsi buat partikel
  function createParticle(x, y) {
    const particle = document.createElement("div");
    particle.className = "cursor-particle";

    const angle = Math.random() * Math.PI * 2;
    const distance = 5 + Math.random() * 15;
    particle.style.setProperty("--tx", Math.cos(angle) * distance + "px");
    particle.style.setProperty("--ty", Math.sin(angle) * distance + "px");

    particle.style.left = x + "px";
    particle.style.top = y + "px";

    document.body.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, 1000);
  }
});

// Tambahkan class khusus saat hover
document.querySelectorAll("button").forEach((el) => {
  el.addEventListener("mouseenter", () => cursor.classList.add("button-hover"));
  el.addEventListener("mouseleave", () =>
    cursor.classList.remove("button-hover")
  );
});

document.querySelectorAll("a").forEach((el) => {
  el.addEventListener("mouseenter", () => cursor.classList.add("link-hover"));
  el.addEventListener("mouseleave", () =>
    cursor.classList.remove("link-hover")
  );
});

// DOM Elements
const loadingScreen = document.getElementById("loadingScreen");
const pageSections = document.querySelectorAll(".page-section");
const couponCodeInput = document.getElementById("couponCode");
const productGrid = document.getElementById("productGrid");
const allProductsGrid = document.getElementById("allProductsGrid");
const searchInput = document.getElementById("searchInput");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const orderSummary = document.getElementById("orderSummary");
const subtotal = document.getElementById("subtotal");
const total = document.getElementById("total");
const toast = new bootstrap.Toast(document.getElementById("toast"));
const toastMessage = document.getElementById("toastMessage");

// Variables
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let products = [];
let filteredProducts = [];
let currentTheme = localStorage.getItem("theme") || "light";

// Initialize the app
function init() {
  // Set theme
  setTheme(currentTheme);

  // Load products
  loadProducts();

  // Show loading screen for 3 seconds
  setTimeout(() => {
    loadingScreen.style.opacity = "0";
    setTimeout(() => {
      loadingScreen.style.display = "none";
      showSection("landingPage");
    }, 500);
  }, 3000);

  // Update cart count
  updateCartCount();
}

// Show specific section
function showSection(sectionId) {
  pageSections.forEach((section) => {
    section.classList.remove("active");
    if (section.id === sectionId) {
      section.classList.add("active");
    }
  });
}

// Coupon functions
function showCouponSection() {
  const couponSection = document.getElementById("couponSection");

  // Reset animation state
  couponSection.style.opacity = "0";
  couponSection.style.transform = "translateY(20px)";

  // Show the section
  showSection("couponSection");

  // Animate in
  setTimeout(() => {
    couponSection.style.transition = "all 0.3s ease-out";
    couponSection.style.opacity = "1";
    couponSection.style.transform = "translateY(0)";
  }, 10);
}

function validateCoupon() {
  const couponCode = couponCodeInput.value.trim().toUpperCase();
  const validCoupons = ["PETLOVE", "IFPAWS50", "WELCOME"];

  // Add shake animation to input while validating
  couponCodeInput.style.transition = "none";
  couponCodeInput.style.transform = "translateX(0)";

  if (couponCode && validCoupons.includes(couponCode)) {
    // Success animation
    couponCodeInput.style.transition = "all 0.3s ease";
    couponCodeInput.style.borderColor = "#4CAF50";
    couponCodeInput.style.boxShadow = "0 0 0 2px rgba(76, 175, 80, 0.3)";

    setTimeout(() => {
      showToast(
        "Kupon berhasil digunakan! Diskon 50% akan diterapkan saat checkout.",
        "success"
      );
      localStorage.setItem("coupon", couponCode);

      // Animate transition to next section
      const couponSection = document.getElementById("couponSection");
      couponSection.style.transition = "all 0.3s ease";
      couponSection.style.opacity = "0";
      couponSection.style.transform = "translateY(-20px)";

      setTimeout(() => {
        showSection("loginSection");
      }, 300);
    }, 500);
  } else {
    // Error animation
    couponCodeInput.style.transition = "all 0.3s ease";
    couponCodeInput.style.borderColor = "#f44336";

    // Shake animation
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        couponCodeInput.style.transform = `translateX(${
          i % 2 === 0 ? -5 : 5
        }px)`;
      }, i * 50);
    }

    setTimeout(() => {
      couponCodeInput.style.transform = "translateX(0)";
      couponCodeInput.style.boxShadow = "0 0 0 2px rgba(244, 67, 54, 0.3)";
      showToast(
        "Kupon tidak valid. Coba kode lain atau lanjutkan tanpa kupon.",
        "error"
      );
    }, 300);
  }
}

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  // Show toast with animation
  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  // Remove toast after delay
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}

// Login/Register functions
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (email && password) {
    showToast("Login berhasil! Mengarahkan ke beranda...");
    setTimeout(() => {
      showMainEcommerce();
    }, 1500);
  } else {
    showToast("Harap isi email dan password.", "error");
  }
}

// Add these new functions to your existing script.js
function showRegister() {
  document.getElementById("loginCard").style.display = "none";
  document.getElementById("registerCard").style.display = "block";
}

// function showLogin() {
//   document.getElementById('registerCard').style.display = 'none';
//   document.getElementById('loginCard').style.display = 'block';
// }

function register() {
  const name = document.getElementById("regName").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;
  const confirmPassword = document.getElementById("regConfirmPassword").value;
  const terms = document.getElementById("regTerms").checked;

  if (!name || !email || !password || !confirmPassword) {
    showToast("Harap lengkapi semua field.", "error");
    return;
  }

  if (password !== confirmPassword) {
    showToast("Password dan konfirmasi password tidak cocok.", "error");
    return;
  }

  if (!terms) {
    showToast("Anda harus menyetujui syarat dan ketentuan.", "error");
    return;
  }

  // In a real app, you would register the user here
  showToast("Pendaftaran berhasil! Silakan login.", "success");
  showLogin();
}

function handleLogout() {
  // Sembunyikan semua section
  document.querySelectorAll(".page-section").forEach((section) => {
    section.classList.remove("active");
  });

  // Tampilkan login section
  document.getElementById("loginSection").classList.add("active");

  // Scroll ke atas agar login terlihat
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function handleLogout() {
  const mainPage = document.getElementById("mainEcommerce");
  const loginPage = document.getElementById("loginSection");

  // Tambah animasi fade-out pada halaman utama
  mainPage.classList.add("fade-out");

  // Setelah animasi selesai, sembunyikan halaman utama dan tampilkan login
  setTimeout(() => {
    // Sembunyikan semua page-section
    document.querySelectorAll(".page-section").forEach((section) => {
      section.classList.remove("active", "fade-out", "fade-in");
    });

    // Tampilkan login dengan animasi fade-in
    loginPage.classList.add("active", "fade-in");

    // Scroll ke atas
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 500); // waktu harus sama dengan durasi animasi (0.5s)
}

function showMainEcommerce() {
  showSection("mainEcommerce");
  window.scrollTo(0, 0);
}

// Theme functions
function toggleTheme() {
  currentTheme = currentTheme === "light" ? "dark" : "light";
  setTheme(currentTheme);
  localStorage.setItem("theme", currentTheme);
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const themeIcon = document.getElementById("themeIcon");
  if (theme === "dark") {
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
  } else {
    themeIcon.classList.remove("fa-sun");
    themeIcon.classList.add("fa-moon");
  }
}

// Product functions
function loadProducts() {
  // Sample product data
  products = [
    {
      id: 1,
      name: "Royal Canin Kitten",
      category: "makanan",
      description:
        "Makanan kucing kitten usia 1-12 bulan, nutrisi lengkap untuk pertumbuhan optimal.",
      price: 125000,
      discount: 20,
      image: "cat-food.jpg",
    },
    {
      id: 2,
      name: "Whiskas Adult",
      category: "makanan",
      description:
        "Makanan kucing dewasa dengan rasa tuna, mengandung protein tinggi.",
      price: 35000,
      discount: 10,
      image: "whiskas.jpg",
    },
    {
      id: 3,
      name: "Pedigree Adult",
      category: "makanan",
      description:
        "Makanan anjing dewasa dengan formula khusus untuk kesehatan kulit dan bulu.",
      price: 75000,
      discount: 15,
      image: "dog-food.jpg",
    },
    {
      id: 4,
      name: "Bola Mainan Kucing",
      category: "mainan",
      description:
        "Bola mainan dengan lonceng di dalamnya, sangat disukai kucing.",
      price: 25000,
      discount: 0,
      image: "cattoy.jpg",
    },
    {
      id: 5,
      name: "Tali Tarik Anjing",
      category: "mainan",
      description:
        "Tali tarik kuat untuk melatih gigitan anjing dan bermain bersama.",
      price: 45000,
      discount: 5,
      image: "ttk.jpg",
    },
    {
      id: 6,
      name: "Vitamin Cat",
      category: "kesehatan",
      description:
        "Vitamin lengkap untuk kucing dengan kandungan taurin dan nutrisi penting.",
      price: 60000,
      discount: 10,
      image: "cat-vitamin.jpg",
    },
    {
      id: 7,
      name: "Dog Shampoo",
      category: "kesehatan",
      description:
        "Shampoo khusus dengan pH seimbang, membuat bulu lembut dan wangi.",
      price: 55000,
      discount: 0,
      image: "dog-shampoo.jpg",
    },
    {
      id: 8,
      name: "Kalung Anjing",
      category: "aksesoris",
      description:
        "Kalung anjing dengan nama tag, tersedia berbagai ukuran dan warna.",
      price: 40000,
      discount: 20,
      image: "dog-collar.jpg",
    },
    {
      id: 9,
      name: "Kandang Kucing Portable",
      category: "aksesoris",
      description: "Kandang kucing yang nyaman dan mudah dibawa bepergian.",
      price: 250000,
      discount: 25,
      image: "cat-cage.jpg",
    },
    {
      id: 10,
      name: "Pasir Kucing Wangi",
      category: "aksesoris",
      description: "Pasir kucing dengan formula clumping dan pengharum alami.",
      price: 65000,
      discount: 5,
      image: "cat-litter.jpg",
    },
    {
      id: 11,
      name: "Snack Anjing",
      category: "makanan",
      description: "Snack training untuk anjing dengan rasa daging asli.",
      price: 30000,
      discount: 0,
      image: "dog-snack.jpg",
    },
    {
      id: 12,
      name: "Sisir Kucing",
      category: "aksesoris",
      description:
        "Sisir metal untuk merapikan bulu kucing dan menghilangkan bulu rontok.",
      price: 35000,
      discount: 15,
      image: "cat-comb.jpg",
    },
  ];

  filteredProducts = [...products];
  renderProducts();
  renderAllProducts();
}

function renderProducts() {
  productGrid.innerHTML = "";
  const displayedProducts = filteredProducts.slice(0, 8);

  if (displayedProducts.length === 0) {
    productGrid.innerHTML =
      '<div class="col-12 text-center py-5"><h4>Tidak ada produk yang ditemukan</h4></div>';
    return;
  }

  displayedProducts.forEach((product) => {
    const productCard = createProductCard(product);
    productGrid.appendChild(productCard);
  });
}

function renderAllProducts() {
  allProductsGrid.innerHTML = "";

  products.forEach((product) => {
    const productCard = createProductCard(product);
    allProductsGrid.appendChild(productCard);
  });
}

// Add these new functions to your existing script.js
function showRegister() {
  document.getElementById("loginCard").style.display = "none";
  document.getElementById("registerCard").style.display = "block";
}

function showLogin() {
  document.getElementById("registerCard").style.display = "none";
  document.getElementById("loginCard").style.display = "block";
}

function register() {
  const name = document.getElementById("regName").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;
  const confirmPassword = document.getElementById("regConfirmPassword").value;
  const terms = document.getElementById("regTerms").checked;

  if (!name || !email || !password || !confirmPassword) {
    showToast("Harap lengkapi semua field.", "error");
    return;
  }

  if (password !== confirmPassword) {
    showToast("Password dan konfirmasi password tidak cocok.", "error");
    return;
  }

  if (!terms) {
    showToast("Anda harus menyetujui syarat dan ketentuan.", "error");
    return;
  }

  // In a real app, you would register the user here
  showToast("Pendaftaran berhasil! Silakan login.", "success");
  showLogin();
}

function addToCartDirect(productId, quantity) {
  const product = products.find((p) => p.id === productId);

  if (!product) {
    showToast("Produk tidak ditemukan", "error");
    return;
  }

  const cartItem = {
    id: product.id,
    name: product.name,
    price:
      product.discount > 0
        ? (product.price * (100 - product.discount)) / 100
        : product.price,
    image: `assets/images/${product.image.toLowerCase()}`,
    quantity: quantity,
  };

  // Cek apakah produk sudah ada di keranjang
  const existingIndex = cart.findIndex((item) => item.id === productId);
  if (existingIndex >= 0) {
    cart[existingIndex].quantity += quantity;
    showToast(
      `Ditambahkan ${quantity} ${product.name} ke keranjang! (Total: ${cart[existingIndex].quantity})`
    );
  } else {
    cart.push(cartItem);
    showToast(`${quantity} ${product.name} telah ditambahkan ke keranjang!`);
  }

  updateCart();
}

function contactSupport() {
  showToast("Tim dukungan akan segera menghubungi Anda.", "info");
}

// Update the createProductCard function
function createProductCard(product) {
  const col = document.createElement("div");
  col.className = "col-md-3 col-sm-6 mb-4";

  const card = document.createElement("div");
  card.className = "product-card";

  const discountBadge =
    product.discount > 0
      ? `<div class="product-badge">${product.discount}% OFF</div>`
      : "";

  const originalPrice =
    product.discount > 0
      ? `<span class="price-original">Rp ${product.price.toLocaleString()}</span>`
      : "";

  const currentPrice =
    product.discount > 0
      ? (product.price * (100 - product.discount)) / 100
      : product.price;

  const imagePath = getProductImageUrl(product.image);

  card.innerHTML = `
    ${discountBadge}
    <div class="product-image">
      <img src="${imagePath}" alt="${product.name}" class="product-img"
          >
      <div class="quick-view-overlay">
        <button class="btn-quick-view" onclick="event.stopPropagation(); openProductModal(${
          product.id
        })"
                style="width: auto; max-width: 120px; padding: 5px 10px; margin: 0 auto; display: flex; align-items: center; justify-content: center; white-space: nowrap; font-size: 12px;">
          <i class="fas fa-eye"></i> Quick View
        </button>
      </div>
    </div>
    <div class="product-details">
      <h3 class="product-name">${product.name}</h3>
      <p class="product-description">${product.description}</p>
      <div class="product-price">
        <h4 class="price-current">Rp ${currentPrice.toLocaleString()}</h4>
        ${originalPrice}
      </div>
      <div class="product-actions">
        <button class="btn btn-add-to-cart" onclick="event.stopPropagation(); addToCartDirect(${
          product.id
        }, 1)">
          <i class="fas fa-cart-plus"></i> Add to Cart
        </button>
      </div>
    </div>
  `;

  col.appendChild(card);
  return col;
}

// Fungsi untuk membuka modal
function openQuickViewModal(productId) {
  currentQuickViewId = productId;

  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const productImage = document.getElementById("quickViewImage");
  productImage.src = getProductImageUrl(product.image);
  productImage.alt = product.name;

  document.getElementById("quickViewName").textContent = product.name;
  document.getElementById("quickViewDescription").textContent =
    product.description;
  updatePriceDisplay(product);
  document.getElementById("quickViewQty").value = 1;

  const modal = new bootstrap.Modal(
    document.getElementById("productQuickView")
  );
  modal.show();
}

// Fungsi helper untuk mendapatkan URL gambar
function getProductImageUrl(image) {
  if (!image) return "assets/images/default-product.jpg";

  // Jika sudah path lengkap, pakai langsung
  if (
    image.startsWith("http") ||
    image.startsWith("assets/") ||
    image.startsWith("/")
  ) {
    return image;
  }

  return `assets/images/${image.toLowerCase()}`; // pakai lowercase
}

function changeQuickViewQuantity(amount) {
  const input = document.getElementById("quickViewQty");
  let value = parseInt(input.value) || 1;
  value += amount;
  if (value < 1) value = 1;
  input.value = value;
}

function addToCartFromQuickView() {
  const qty = parseInt(document.getElementById("quickViewQty").value) || 1;
  addToCartDirect(currentQuickViewId, qty);
  bootstrap.Modal.getInstance(
    document.getElementById("productQuickView")
  )?.hide();
}

// Fungsi untuk menampilkan harga
function updatePriceDisplay(product) {
  const priceContainer = document.getElementById("quickViewPrice");

  if (product.discount > 0) {
    const discountedPrice = (product.price * (100 - product.discount)) / 100;
    priceContainer.innerHTML = `
      <h4 class="text-danger d-inline">Rp ${discountedPrice.toLocaleString()}</h4>
      <small class="text-muted ms-2 text-decoration-line-through">Rp ${product.price.toLocaleString()}</small>
      <span class="badge bg-danger ms-2">${product.discount}% OFF</span>
    `;
  } else {
    priceContainer.innerHTML = `<h4>Rp ${product.price.toLocaleString()}</h4>`;
  }
}

function filterProducts(category) {
  // Update active filter button
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.remove("active");
    if (
      btn.textContent.trim().toLowerCase() === category ||
      (category === "all" && btn.textContent.trim().toLowerCase() === "semua")
    ) {
      btn.classList.add("active");
    }
  });

  if (category === "all") {
    filteredProducts = [...products];
  } else {
    filteredProducts = products.filter(
      (product) => product.category === category
    );
  }

  renderProducts();
}

function showAllProducts() {
  document.getElementById("products").style.display = "none";
  document.getElementById("allProductsSection").style.display = "block";
  window.scrollTo(0, 0);
}

function backToHome() {
  document.getElementById("products").style.display = "block";
  document.getElementById("allProductsSection").style.display = "none";
  window.scrollTo(0, 0);
}

function scrollToProducts() {
  document.getElementById("products").scrollIntoView({ behavior: "smooth" });
}

// Search function
searchInput.addEventListener("input", function () {
  const searchTerm = this.value.toLowerCase();
  const filtered = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
  );

  allProductsGrid.innerHTML = "";
  filtered.forEach((product) => {
    const productCard = createProductCard(product);
    allProductsGrid.appendChild(productCard);
  });
});

// Product Modal functions
function openProductModal(product) {
  const modal = new bootstrap.Modal(document.getElementById("productModal"));
  const currentPrice =
    product.discount > 0
      ? (product.price * (100 - product.discount)) / 100
      : product.price;

  document.getElementById("modalTitle").textContent = product.name;
  document.getElementById("modalProductName").textContent = product.name;
  document.getElementById("modalProductDescription").textContent =
    product.description;
  document.getElementById(
    "modalProductPrice"
  ).textContent = `Rp ${currentPrice.toLocaleString()}`;
  document.getElementById("modalImage").innerHTML = product.image;
  document.getElementById("modalQuantity").value = 1;

  // Set product data on modal for cart functions
  document.getElementById("productModal").dataset.productId = product.id;

  modal.show();
}

function changeQuantity(amount) {
  const quantityInput = document.getElementById("modalQuantity");
  let newValue = parseInt(quantityInput.value) + amount;
  if (newValue < 1) newValue = 1;
  quantityInput.value = newValue;
}

function addToCart() {
  const productId = parseInt(
    document.getElementById("productModal").dataset.productId
  );
  const quantity = parseInt(document.getElementById("modalQuantity").value);
  const product = products.find((p) => p.id === productId);

  const cartItem = {
    id: product.id,
    name: product.name,
    price:
      product.discount > 0
        ? (product.price * (100 - product.discount)) / 100
        : product.price,
    image: `assets/images/${product.image.toLowerCase()}`, // ✅ INI WAJIB
    quantity: quantity,
  };

  const existingItemIndex = cart.findIndex((item) => item.id === productId);
  if (existingItemIndex >= 0) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push(cartItem);
  }

  updateCart();
  bootstrap.Modal.getInstance(document.getElementById("productModal")).hide();
  showToast(`${quantity} ${product.name} telah ditambahkan ke keranjang!`);
}

function buyNow() {
  addToCart();
  showCart();
}

// Cart functions
function showCart() {
  const modal = new bootstrap.Modal(document.getElementById("cartModal"));
  renderCartItems();
  modal.show();
}

function renderCartItems() {
  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-cart"></i>
        <p>Keranjang masih kosong!</p>
        <small>Ayo mulai berbelanja untuk hewan kesayangan Anda</small>
      </div>
    `;
    cartTotal.textContent = "Rp 0";
    return;
  }

  cartItems.innerHTML = "";
  let totalPrice = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;

const imagePath = item.image && item.image.startsWith('assets/')
  ? item.image
  : `assets/images/${item.name.toLowerCase().replace(/\s+/g, '-')}.jpg`;

    totalPrice += itemTotal;

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
      <div class="cart-item-image" onclick="openProductModal(${item.id})">
          <img src="${imagePath}" alt="${item.name}" class="cart-img" style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px;"
          onerror="this.src='assets/images/default-product.jpg'; this.onerror=null;">
      </div>
      <div class="cart-item-details">
        <h5>${item.name}</h5>
        <p>Rp ${item.price.toLocaleString()} x ${item.quantity}</p>
      </div>
      <div class="cart-item-controls">
        <div class="quantity-controls">
          <button onclick="event.stopPropagation(); updateCartItem(${index}, -1)">
            <i class="fas fa-minus"></i>
          </button>
          <span>${item.quantity}</span>
          <button onclick="event.stopPropagation(); updateCartItem(${index}, 1)">
            <i class="fas fa-plus"></i>
          </button>
        </div>
        <button class="btn-remove" onclick="event.stopPropagation(); removeCartItem(${index})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
      <div class="cart-item-price">
        Rp ${itemTotal.toLocaleString()}
      </div>
    `;

    cartItems.appendChild(cartItem);
  });

  cartTotal.textContent = `Rp ${totalPrice.toLocaleString()}`;
}

function updateCartItem(index, change) {
  cart[index].quantity += change;

  if (cart[index].quantity < 1) {
    cart.splice(index, 1);
  }

  updateCart();
  renderCartItems();
}

function removeCartItem(index) {
  const itemName = cart[index].name;
  cart.splice(index, 1);
  updateCart();
  renderCartItems();
  showToast(`${itemName} telah dihapus dari keranjang.`);
}

function updateCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = count;
  cartCount.style.display = count > 0 ? "flex" : "none";
}

function goToCheckout() {
  const cartModal = bootstrap.Modal.getInstance(
    document.getElementById("cartModal")
  );
  const checkoutModal = new bootstrap.Modal(
    document.getElementById("checkoutModal")
  );

  // 1. Tutup modal cart dengan efek hide Bootstrap
  cartModal.hide();

  // 2. Ketika modal cart selesai ditutup
  document.getElementById("cartModal").addEventListener(
    "hidden.bs.modal",
    function () {
      // 3. Buka modal checkout
      checkoutModal.show();
      renderOrderSummaryToModal();
    },
    { once: true }
  ); // Pastikan event listener hanya sekali
}

function renderOrderSummaryToModal() {
  const summary = document.getElementById("orderSummaryModal");
  const subtotalElem = document.getElementById("subtotalModal");
  const totalElem = document.getElementById("totalModal");

  summary.innerHTML = "";
  let totalHarga = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;

const imagePath = item.image && item.image.startsWith('assets/')
  ? item.image
  : `assets/images/${item.name.toLowerCase().replace(/\s+/g, '-')}.jpg`;

    totalHarga += itemTotal;

    const itemElement = document.createElement("div");
    itemElement.className = "order-item d-flex justify-content-between mb-2";
    itemElement.innerHTML = `
      <div>
        <strong>${item.name}</strong><br>
        <small>${item.quantity} x Rp ${item.price.toLocaleString()}</small>
      </div>
      <div class="text-end">Rp ${itemTotal.toLocaleString()}</div>
    `;
    summary.appendChild(itemElement);
  });

  const selectedShipping = document.querySelector(
    'input[name="shippingMethod"]:checked'
  );
  const shippingFee = selectedShipping ? parseInt(selectedShipping.value) : 0;
  const totalPrice = totalHarga + shippingFee;

  subtotalElem.textContent = `Rp ${totalHarga.toLocaleString()}`;
  totalElem.textContent = `Rp ${totalPrice.toLocaleString()}`;
}

function handleCheckout(button) {
  setButtonLoading(button, true); // Aktifkan loading

  // Simulasi validasi form
  const name = document.getElementById("fullName").value;
  if (!name) {
    showToast("Mohon isi nama terlebih dahulu.", "error");
    setButtonLoading(button, false);
    return;
  }

  // Simulasi proses pembayaran
  setTimeout(() => {
    showToast("Pembayaran berhasil! Terima kasih 🐾", "success");
    setButtonLoading(button, false);

    // Tutup modal (opsional)
    bootstrap.Modal.getInstance(
      document.getElementById("checkoutModal")
    )?.hide();
  }, 2000);
}

function backToProducts() {
  showSection("mainEcommerce");
  document.getElementById("products").scrollIntoView({ behavior: "smooth" });
}

// Checkout functions
function renderOrderSummary() {
  if (cart.length === 0) {
    orderSummary.innerHTML = "<p>Tidak ada item dalam keranjang</p>";
    subtotal.textContent = "Rp 0";
    total.textContent = "Rp 15.000";
    return;
  }

  orderSummary.innerHTML = "";
  let subTotalPrice = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;

const imagePath = item.image && item.image.startsWith('assets/')
  ? item.image
  : `assets/images/${item.name.toLowerCase().replace(/\s+/g, '-')}.jpg`;

    subTotalPrice += itemTotal;

    const orderItem = document.createElement("div");
    orderItem.className = "order-item";
    orderItem.innerHTML = `
      <div class="order-item-info">
        <div class="order-item-img">
          <img src="${imagePath}" alt="${item.name}" class="img-fluid rounded" 
              style="width: 60px; height: 60px; object-fit: cover;"
              onerror="this.src='assets/images/default-product.jpg'; this.onerror=null;">
        </div>
        <div class="order-item-details">
          <h6 class="order-item-name">${item.name}</h6>
          <p class="order-item-price">Rp ${item.price.toLocaleString()} x ${
      item.quantity
    }</p>
        </div>
      </div>
      <div class="order-item-qty">
        <span>Rp ${itemTotal.toLocaleString()}</span>
      </div>
    `;

    orderSummary.appendChild(orderItem);
  });

  const shippingFee = 15000;
  const totalPrice = subTotalPrice + shippingFee;

  subtotal.textContent = `Rp ${subTotalPrice.toLocaleString()}`;
  total.textContent = `Rp ${totalPrice.toLocaleString()}`;
}

function selectPayment(element) {
  document.querySelectorAll(".payment-method").forEach((method) => {
    method.classList.remove("active");
  });
  element.classList.add("active");
}

function processPayment() {
  const fullName = document.getElementById("fullName").value;
  const email = document.getElementById("emailCheckout").value;
  const phone = document.getElementById("phone").value;
  const city = document.getElementById("city").value;
  const address = document.getElementById("address").value;
  const paymentMethod = document.querySelector(".payment-method.active");

  if (!fullName || !email || !phone || !city || !address) {
    showToast("Harap lengkapi semua informasi pengiriman.", "error");
    return;
  }

  if (!paymentMethod) {
    showToast("Harap pilih metode pembayaran.", "error");
    return;
  }

  // In a real app, you would process payment here
  showToast(
    "Pembayaran berhasil diproses! Pesanan Anda sedang dipersiapkan.",
    "success"
  );

  // Clear cart
  cart = [];
  updateCart();

  // Show track order modal after 2 seconds
  setTimeout(() => {
    document.getElementById("checkoutSection").style.display = "none";
    const modal = new bootstrap.Modal(
      document.getElementById("trackOrderModal")
    );
    modal.show();
  }, 2000);
}

// Toast notification
function showToast(message, type = "success") {
  toastMessage.textContent = message;

  // Remove all previous classes
  toastMessage.className = "toast-body";

  // Add appropriate class based on type
  if (type === "error") {
    toastMessage.classList.add("text-danger");
  } else if (type === "info") {
    toastMessage.classList.add("text-info");
  } else if (type === "success") {
    toastMessage.classList.add("text-success");
  }

  toast.show();
}

function setButtonLoading(button, isLoading = true) {
  if (!button) return;
  if (isLoading) {
    button.classList.add("btn-loading");
  } else {
    button.classList.remove("btn-loading");
  }
}

function openShippingModal(button) {
  setButtonLoading(button, true);

  // Ambil subtotal
  const subtotalText = document
    .getElementById("subtotalModal")
    .textContent.replace(/[^\d]/g, "");
  const subtotal = parseInt(subtotalText) || 0;

  // Ambil nilai pengiriman terpilih
  const selectedShipping = document.querySelector(
    'input[name="shippingMethod"]:checked'
  );
  const shippingFee = selectedShipping ? parseInt(selectedShipping.value) : 0;
  const finalTotal = subtotal + shippingFee;

  // Tampilkan total ke modal
  document.getElementById(
    "finalTotal"
  ).textContent = `Rp ${finalTotal.toLocaleString()}`;

  // Tampilkan modal pengiriman
  setTimeout(() => {
    setButtonLoading(button, false);
    const shippingModal = new bootstrap.Modal(
      document.getElementById("shippingModal")
    );
    shippingModal.show();
  }, 500);
}

function selectPayment(element) {
  // Hapus class 'active' dari semua metode
  document.querySelectorAll(".payment-method").forEach((pm) => {
    pm.classList.remove("active");
  });

  // Tambahkan class 'active' ke elemen yang diklik
  element.classList.add("active");

  // Ambil data-metodenya jika ingin digunakan nanti
  const method = element.getAttribute("data-method");
  localStorage.setItem("selectedPaymentMethod", method);

  // (Opsional) Tampilkan detail kartu kredit kalau pilih 'credit'
  const creditDetails = document.getElementById("creditDetails");
  if (creditDetails) {
    creditDetails.classList.toggle("d-none", method !== "credit");
  }
}

// Fungsi toast
function showToast(message) {
  const toast = document.createElement("div");
  toast.className =
    "toast align-items-center text-bg-danger border-0 show position-fixed bottom-0 end-0 m-4";
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("aria-atomic", "true");
  toast.innerHTML = `<div class="d-flex"><div class="toast-body">${message}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// Fungsi untuk membuka modal checkout hanya jika cart tidak kosong
function openCheckoutModal() {
  if (!cart || cart.length === 0) {
    showToast("Keranjang kosong! Tambahkan produk terlebih dahulu.");
    return;
  }

  const checkoutModal = new bootstrap.Modal(
    document.getElementById("checkoutModal")
  );
  checkoutModal.show();
}

// Fungsi saat klik tombol 'Place Order'
function submitOrder() {
  const agree = document.getElementById("agreeTermsCheckout");
  const btn = document.getElementById("placeOrderBtn");
  const spinner = btn.querySelector(".spinner-border");
  const text = btn.querySelector(".btn-text");

  if (!agree.checked) {
    alert("Kamu harus menyetujui Syarat & Ketentuan terlebih dahulu.");
    return;
  }

  spinner.classList.remove("d-none");
  text.innerHTML = "Memproses...";
  btn.disabled = true;

  setTimeout(() => {
    spinner.classList.add("d-none");
    text.innerHTML = '<i class="fas fa-credit-card"></i> Place Order';
    btn.disabled = false;

    // Kosongkan cart setelah berhasil order
    cart = [];

    // Update keranjang visual
    document.getElementById("cartItems").innerHTML = `
      <div class="empty-cart text-center p-4">
        <i class="fas fa-shopping-cart fa-2x mb-2"></i>
        <p class="mb-1">Keranjang masih kosong!</p>
        <small class="text-muted">Ayo mulai berbelanja untuk hewan kesayangan Anda</small>
      </div>
    `;
    document.getElementById("cartCount").textContent = "0";
    document.getElementById("cartTotal").textContent = "Rp 0";

    // Update order total
    document.getElementById("orderFinalTotal").textContent = "Rp 0";
    document.getElementById("orderDate").textContent =
      new Date().toLocaleDateString("id-ID");

    // Tutup modal checkout dan tampilkan modal konfirmasi
    const checkoutModal = bootstrap.Modal.getInstance(
      document.getElementById("checkoutModal")
    );
    if (checkoutModal) checkoutModal.hide();

    const confirmationModal = new bootstrap.Modal(
      document.getElementById("orderConfirmationModal")
    );
    confirmationModal.show();
  }, 1500);
}

let currentQuickViewId = null;

function openProductModal(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  currentQuickViewId = product.id;

  const discounted = product.discount > 0;
  const currentPrice = discounted
    ? (product.price * (100 - product.discount)) / 100
    : product.price;

  document.getElementById("quickViewImage").src = getProductImageUrl(
    product.image
  );
  document.getElementById("quickViewName").textContent = product.name;
  document.getElementById("quickViewDescription").textContent =
    product.description;
  document.getElementById("quickViewPrice").innerHTML = discounted
    ? `<h5 class="text-danger mb-0">Rp ${currentPrice.toLocaleString()}</h5><small><s>Rp ${product.price.toLocaleString()}</s></small>`
    : `<h5 class="mb-0">Rp ${product.price.toLocaleString()}</h5>`;

  const modal = new bootstrap.Modal(
    document.getElementById("productQuickView")
  );
  modal.show();
}

// script.js - Perbaikan Animasi dengan GSAP

// Fungsi untuk inisialisasi animasi landing page
function initLandingAnimations() {
  // Animasi untuk judul utama (🐾 IFPaws 🐾)
  gsap.from(".hero-title", {
    duration: 1.2,
    scale: 0.5,
    opacity: 0,
    ease: "elastic.out(1, 0.5)",
    delay: 0.5,
  });

  // Animasi untuk subjudul (Small in name, Big in love!)
  gsap.from(".slide-down", {
    duration: 0.8,
    y: -50,
    opacity: 0,
    ease: "power2.out",
    delay: 0.8,
  });

  // Animasi untuk deskripsi (Any Shopping just for Chingu's Home)
  gsap.from(".slide-up", {
    duration: 0.8,
    y: 50,
    opacity: 0,
    ease: "power2.out",
    delay: 1.1,
  });

  // Animasi untuk feature items
  gsap.utils.toArray(".feature-item").forEach((item, index) => {
    gsap.from(item, {
      duration: 0.6,
      scale: 0,
      opacity: 0,
      ease: "back.out(1.7)",
      delay: 1.4 + index * 0.3,
    });
  });

  // Animasi untuk tombol (Mulai Berbelanja!)
  gsap.to(".pulse-glow", {
    duration: 1.5,
    scale: 1.05,
    boxShadow: "0 0 15px rgba(255, 165, 0, 0.7)",
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    delay: 2.0,
  });
}

// Fungsi utama saat DOM siap
document.addEventListener("DOMContentLoaded", function () {
  // Set opacity awal untuk elemen yang akan dianimasi
  gsap.set([".hero-title", ".slide-down", ".slide-up", ".feature-item"], {
    opacity: 0,
  });

  // Jalankan animasi setelah loading screen selesai
  setTimeout(() => {
    initLandingAnimations();
  }, 500); // Delay sedikit setelah loading screen

  // Kode lainnya yang sudah ada...
  // (pertahankan kode yang sudah ada di bawah ini)
});

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", init);
