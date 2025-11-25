// Struktur data untuk Keranjang Belanja
let cart = [];

// Fungsi untuk memformat angka menjadi Rupiah
function formatRupiah(number) {
    return 'Rp ' + number.toLocaleString('id-ID');
}

// Fungsi untuk memperbarui tampilan keranjang dan total
function updateCartDisplay() {
    const cartItemsList = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartCountElement = document.getElementById('cart-count');
    
    cartItemsList.innerHTML = '';
    
    let total = 0;

    if (cart.length === 0) {
        cartItemsList.innerHTML = '<li id="empty-cart-message" style="text-align: center; color: gray;">Keranjang Anda kosong.</li>';
    } else {
        cart.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>${item.name} (${item.quantity}x)</span>
                <span>
                    ${formatRupiah(item.price * item.quantity)}
                    <span class="remove-item" data-index="${index}">&times;</span>
                </span>
            `;
            cartItemsList.appendChild(listItem);
            total += item.price * item.quantity;
        });
    }

    cartTotalElement.textContent = formatRupiah(total);
    cartCountElement.textContent = `(${cart.length})`;

    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            removeItemFromCart(parseInt(index));
        });
    });
}

// Fungsi untuk menambah produk ke keranjang
function addItemToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    
    alert(`${name} berhasil ditambahkan ke keranjang!`);
    
    updateCartDisplay();
}

// Fungsi untuk menghapus item dari keranjang
function removeItemFromCart(index) {
    if (index > -1) {
        cart.splice(index, 1);
    }
    updateCartDisplay();
}

// Fungsi untuk menampilkan struk pembayaran
function showPaymentReceipt() {
    const receiptModal = document.getElementById('receipt-modal');
    const receiptDetails = document.getElementById('receipt-details');
    
    // Buat konten struk
    let receiptHTML = '';
    let total = 0;

    cart.forEach(item => {
        receiptHTML += `
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span style="font-weight: 600;">${item.name}</span>
                <span>${item.quantity} x ${formatRupiah(item.price)}</span>
            </div>
        `;
        total += item.price * item.quantity;
    });

    receiptHTML += `
        <br>
        <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 1.2rem; border-top: 2px solid #ddd; padding-top: 10px;">
            <span>Total Bayar:</span>
            <span>${formatRupiah(total)}</span>
        </div>
    `;

    receiptDetails.innerHTML = receiptHTML;
    
    // Tampilkan modal struk
    receiptModal.style.display = 'block';
}

// --- Main DOM Content Loaded ---
document.addEventListener('DOMContentLoaded', () => {
    // Navigasi Responsif (dari script.js sebelumnya)
    const navToggle = document.querySelector('.nav-toggle');
    const navUl = document.querySelector('.nav-links');
    const pageContent = document.querySelector('.page-content');
    
    if (navToggle && navUl) {
        navToggle.addEventListener('click', () => {
            navUl.classList.toggle('open');
        });
        navUl.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                 if (window.innerWidth <= 768) {
                    navUl.classList.remove('open');
                }
            });
        });
    }

    if (pageContent) {
        setTimeout(() => {
            pageContent.classList.add('fade-in');
        }, 50); 
    }

    // --- LOGIKA KERANJANG BELANJA & STRUK BARU ---
    const cartModal = document.getElementById('cart-modal');
    const openCartBtn = document.getElementById('open-cart-btn');
    const cartCloseBtn = cartModal.querySelector('.close-btn');
    const receiptModal = document.getElementById('receipt-modal');
    const receiptCloseBtn = receiptModal.querySelector('.close-btn');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const checkoutBtn = document.getElementById('checkout-btn');

    // 1. Tambahkan Listener untuk tombol 'Tambah ke Keranjang'
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            const id = parseInt(card.getAttribute('data-id'));
            const name = card.getAttribute('data-name');
            const price = parseInt(card.getAttribute('data-price'));
            
            addItemToCart(id, name, price);
        });
    });

    // 2. Tampilkan Modal Keranjang (Struk)
    openCartBtn.addEventListener('click', () => {
        updateCartDisplay();
        cartModal.style.display = 'block';
    });

    // 3. Tutup Modal Keranjang
    cartCloseBtn.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });
    window.addEventListener('click', (event) => {
        if (event.target == cartModal) {
            cartModal.style.display = 'none';
        }
    });

    // 4. Proses Checkout (menampilkan modal struk baru)
    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            // Sembunyikan modal keranjang yang lama
            cartModal.style.display = 'none';
            
            // Tampilkan struk pembayaran
            showPaymentReceipt();
            
            // Reset keranjang setelah pembayaran berhasil
            cart = [];
            updateCartDisplay();
        } else {
            alert('Keranjang Anda kosong. Tambahkan produk terlebih dahulu.');
        }
    });

    // 5. Tutup Modal Struk
    receiptCloseBtn.addEventListener('click', () => {
        receiptModal.style.display = 'none';
    });
    window.addEventListener('click', (event) => {
        if (event.target == receiptModal) {
            receiptModal.style.display = 'none';
        }
    });
});