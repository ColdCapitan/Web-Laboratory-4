let products; // Оголошуємо змінну products, яку будемо використовувати для зберігання даних

fetch('../product.json')
    .then(response => response.json())
    .then(data => {
        products = data; // Зберігаємо отримані дані у змінну products
        console.log('Дані з products.json:', products);
        // Викликаємо функцію loadProducts для завантаження продуктів при старті
        loadProducts(null);
    })
    .catch(error => {
        console.error('Помилка при читанні файлу:', error);
    });

document.addEventListener('DOMContentLoaded', function () {
    // Отримуємо кнопки фільтрації
    const filterButtons = document.querySelectorAll('.filter-button');

    // Додаємо обробник подій для кожної кнопки
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const category = this.dataset.category; // Отримуємо категорію з атрибута dataset
            loadProducts(category); // Викликаємо функцію loadProducts з категорією
        });
    });
});

function loadProducts(category) {
    let list = document.getElementById('filter-button');
    let productElements = '';
    let productsFiltered;

    if (category !== null) {
        productsFiltered = products.filter(elem => elem.category === category);
    } else {
        productsFiltered = products;
    }

    productsFiltered.forEach(elem => {
        let li = `
        <li>
        <div>
        <h2>${elem.name}</h2>${elem.description}
        <image src="${elem.image}"/>
        <p>ЦІНА ${elem.price}</p>
        <button class="order-button" onclick="addToCart(${elem.id})">Замовити</button></div></li>`;
        productElements += li;
    });

    list.innerHTML = productElements;
}

// Завантаження продуктів при старті
loadProducts(null);
sessionStorage.setItem('cartItems', "[]");
// Додавання в кошик
function addToCart(productId) {
    const product = products.find(item => item.id === productId);
    if (product) {
        let cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
        // Перевіряємо, чи продукт ще не додано до кошика
        if (!cartItems.some(item => item.id === productId)) {
            cartItems.push({ id: productId, quantity: 1 });
            sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
            // Оновлення сторінки кошика
            updateCartDisplay();
        } else {
            console.log('Product is already in cart:', product);
        }
    }
}

// Відображення кошику
function showCart() {
    // Перевірка статусу авторизації
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated) {
        let cartModal = document.getElementById('cart');
        cartModal.style.display = "block";
        openCart();
    } else {
        alert("Для розміщення замовлення потрібно увійти в обліковий запис");
    }
}

// Пошук користувача в localStorage, чи він авторизований
function isAuthenticated() {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    return isAuthenticated ? true : false;
}

// Відкриття кошика з його вмістом
function openCart() {
    let cartItems = document.getElementById('cart-items');
    let containerHtml = '';

    // Отримуємо дані кошика з sessionStorage
    let cartItemsData = JSON.parse(sessionStorage.getItem('cartItems')) || [];

    // Вивід елемента кошику (меню)
    cartItemsData.forEach(cartItem => {
        const product = products.find(product => product.id === cartItem.id);
        if (product) {
            containerHtml += `
        <div class="cart-item">
            <h3>${product.name}</h3>
            <img src="${product.image}" alt="${product.name}" style="max-width: 100px; max-height: 100px;">
            <p>${product.description}</p>
            <p>Ціна: ${product.price * cartItem.quantity}</p>
            <div class="quantity-controls">
                <button class="decrease-quantity" onclick="decreaseQuantity(${product.id})">-</button>
                <span class="quantity">${cartItem.quantity}</span>
                <button class="increase-quantity" onclick="increaseQuantity(${product.id})">+</button>
            <button class="remove-item" onclick="removeItem(${product.id})">Видалити</button>
            </div>
        </div>`;
        }
    });

    // Вивід кнопок для маніпуляцій
    containerHtml += `<button class ="close-button" onclick="closeCart()">Закрити</button>`;
    containerHtml += `
    <button class="sort-button" onclick="sortByName()">Сортувати за назвою</button>
    <button class="sort-button" onclick="sortByPriceAscending()">Сортувати за зростанням ціни</button>
    <button class="sort-button" onclick="sortByPriceDescending()">Сортувати за спаданням ціни</button>`;
    containerHtml += `<button class="order-button" onclick="placeOrder()">Замовити</button>`;

    //лічильник загальної суми
    containerHtml += `<div id="total-price"></div>`;
    cartItems.innerHTML = containerHtml;
    // Оновити загальну суму
    updateTotalPrice();
}

// Закриття кошика
function closeCart() {
    let cartDiv = document.getElementById('cart');
    cartDiv.style.display = 'none';
}

// Сортування за назвою
function sortByName() {
    let cartItemsData = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    cartItemsData.sort((a, b) => {
        const productA = products.find(product => product.id === a.id);
        const productB = products.find(product => product.id === b.id);
        const totalPriceA = productA.price * a.quantity;
        const totalPriceB = productB.price * b.quantity;
        return productA.name.localeCompare(productB.name);
    });
    sessionStorage.setItem('cartItems', JSON.stringify(cartItemsData));
    openCart();
}

//Сортування за зростаннням цін
function sortByPriceAscending() {
    let cartItemsData = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    cartItemsData.sort((a, b) => {
        const productA = products.find(product => product.id === a.id);
        const productB = products.find(product => product.id === b.id);
        const totalPriceA = productA.price * a.quantity;
        const totalPriceB = productB.price * b.quantity;
        return totalPriceA - totalPriceB;
    });
    sessionStorage.setItem('cartItems', JSON.stringify(cartItemsData));
    openCart();
}

// Сортування за спаданням цін
function sortByPriceDescending() {
    let cartItemsData = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    cartItemsData.sort((a, b) => {
        const productA = products.find(product => product.id === a.id);
        const productB = products.find(product => product.id === b.id);
        const totalPriceA = productA.price * a.quantity;
        const totalPriceB = productB.price * b.quantity;
        return totalPriceB - totalPriceA;
    });
    sessionStorage.setItem('cartItems', JSON.stringify(cartItemsData));
    openCart();
}

// Оновлення загальної суми
function updateTotalPrice() {
    // Якщо користувач не авторизований, не виводимо суму
    if (!isAuthenticated()) {
        return;
    }

    let totalPrice = 0;
    const cartItemsData = JSON.parse(sessionStorage.getItem('cartItems')) || [];

    cartItemsData.forEach(cartItem => {
        const product = products.find(product => product.id === cartItem.id);
        if (product) {
            totalPrice += product.price * cartItem.quantity;
        }
    });

    document.getElementById('total-price').textContent = `Загальна сума: ${totalPrice}`;
}

// Загальне замовлення
function placeOrder() {
    let cartItemsData = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    let totalPrice = cartItemsData.reduce((total, cartItem) => {
        const product = products.find(product => product.id === cartItem.id);
        if (product) {
            return total + (product.price * cartItem.quantity);
        }
        return total;
    }, 0);
    alert(`Ваше замовлення прийнято. Загальна сума: ${totalPrice} грн. Дякуємо за покупку!`);
    sessionStorage.removeItem('cartItems'); // Очистити кошик після замовлення
    openCart(); // Оновити відображення кошика
}


// Видалити продукт 
function removeItem(productId) {
    let cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    let updatedCartItems = cartItems.filter(item => item.id !== productId);
    sessionStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    openCart(); // Оновлення відображення кошика
}

// Збільшення на n одиниць товару
function increaseQuantity(productId) {
    let cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    let productIndex = cartItems.findIndex(item => item.id === productId);
    if (productIndex !== -1) {
        cartItems[productIndex].quantity++;
        sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
        openCart(); // Оновлення відображення кошика
    }
}

// Зменшення на n одиниць товару
function decreaseQuantity(productId) {
    let cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    let productIndex = cartItems.findIndex(item => item.id === productId);
    if (productIndex !== -1) {
        if (cartItems[productIndex].quantity > 1) {
            cartItems[productIndex].quantity--;
            sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
            openCart(); // Оновлення відображення кошика
        }
    }
}

// ГРАФІКИ 
document.addEventListener('DOMContentLoaded', function () {
    // ІД для конпок
    const pieChartButton = document.getElementById('pieChartButton');
    const histogramButton = document.getElementById('histogramButton');
    const lineChartButton = document.getElementById('lineChartButton');

    let currentChart = null; // посилання на поточний графік

    pieChartButton.addEventListener('click', function () {
        if (currentChart) {
            currentChart.destroy(); // Видаляємо попередній графік перед оновленням
        }
        updateCharts('pie');
    });

    histogramButton.addEventListener('click', function () {
        if (currentChart) {
            currentChart.destroy();
        }
        updateCharts('histogram');
    });

    lineChartButton.addEventListener('click', function () {
        if (currentChart) {
            currentChart.destroy();
        }
        updateCharts('line');
    });

    // Функція оновлення всіх діаграм в залежності від типу
    function updateCharts(type) {
        // Дані з кошика (тіпа ми дивимось на статисктику всіх клієнтів)
        const cartItemsData = JSON.parse(sessionStorage.getItem('cartItems')) || [];
        const productQuantities = countProductQuantities(cartItemsData);
        const productNames = getProductNames(cartItemsData);

        let chartConfig;

        if (type === 'pie') {
            chartConfig = {
                type: 'pie',
                data: {
                    labels: productNames,
                    datasets: [{
                        data: productQuantities,
                        backgroundColor: generateRandomColors(productNames.length),
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: false, // автоматичне масштабування в мінус, інакше то на весь екран буде
                    width: 300,
                    height: 200
                }
            };
            const pieCanvas = document.getElementById('pieChartCanvas').getContext('2d');
            currentChart = new Chart(pieCanvas, chartConfig);

        } else if (type === 'histogram') {
            chartConfig = {
                type: 'bar',
                data: {
                    labels: productNames,
                    datasets: [{
                        data: productQuantities,
                        backgroundColor: generateRandomColors(productNames.length),
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: false,
                    width: 300,
                    height: 200
                }
            };
            const histogramCanvas = document.getElementById('histogramCanvas').getContext('2d');
            currentChart = new Chart(histogramCanvas, chartConfig);

        } else if (type === 'line') {
            chartConfig = {
                type: 'line',
                data: {
                    labels: productNames,
                    datasets: [{
                        data: productQuantities,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: false,
                    width: 300,
                    height: 200
                }
            };
            const lineChartCanvas = document.getElementById('lineChartCanvas').getContext('2d');
            currentChart = new Chart(lineChartCanvas, chartConfig);
        }
    }
});

// К-сть товарів одного типу
function countProductQuantities(cartItemsData) {
    const quantitiesMap = {};
    cartItemsData.forEach(item => {
        quantitiesMap[item.id] = (quantitiesMap[item.id] || 0) + item.quantity;
    });
    return Object.values(quantitiesMap);
}

// ПОшук товарів
function getProductNames(cartItemsData) {
    const productNames = [];
    cartItemsData.forEach(item => {
        const product = products.find(product => product.id === item.id);
        if (product) {
            productNames.push(product.name);
        }
    });
    return productNames;
}

// Рандомний колір
function generateRandomColors(count) {
    const colors = [];
    for (let i = 0; i < count; i++) {
        colors.push(`rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.2)`);
    }
    return colors;
}


document.addEventListener('DOMContentLoaded', function () {
    const editPricesButton = document.getElementById('editPricesButton'); // Кнопка для редагування цін

    // Перевірка статусу авторизації
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    // Якщо користувач аутентифікований, перевіряємо, чи він адміністратор
    if (isAuthenticated) {
        const isAdmin = localStorage.getItem('isAdmin');
        if (isAdmin === 'true') {
            // Якщо користувач є адміністратором, показуємо кнопку для редагування цін
            editPricesButton.style.display = 'block';
        } else {
            // Якщо користувач не адміністратор, ховаємо кнопку для редагування цін
            editPricesButton.style.display = 'none';
        }
    } else {
        // Якщо користувач не аутентифікований, ховаємо кнопку для редагування цін
        editPricesButton.style.display = 'none';
    }
});


function updatePrice() {
    const productName = prompt("Введіть назву товару:");
    const newPrice = prompt("Введіть нову ціну для товару:");

    // Створюємо об'єкт з даними для оновлення ціни
    const priceData = { name: productName, price: newPrice };

    // Відправляємо POST запит на сервер для оновлення ціни товару
    fetch('http://localhost:3003/api/updatePrice', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(priceData)
    })
    .then(response => {
        if (response.ok) {
            // Повідомлення про успішне оновлення ціни
            alert("Ціна товару успішно оновлена!");
        } else {
            // Повідомлення про невдале оновлення ціни
            alert("Не вдалося оновити ціну товару. Спробуйте ще раз.");
        }
    })
    .catch(error => {
        console.error('Помилка:', error);
    });
}
