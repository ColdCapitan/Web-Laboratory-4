// НЕМОДАЛЬНЕ ВІКНО (КЕШ)
// Перевірка чи була прийнята пропозиція
if (!localStorage.getItem('subscriptionAccepted')) {
    setTimeout(function () {
        document.getElementById('myModal').style.display = "flex";
    }, 3000); // Затримка для немодального вікна: 3 секунди
}

// Функція прийняття пропозиції
function accept() {
    localStorage.setItem('subscriptionAccepted', true);
    document.getElementById('myModal').style.display = "none";
    // Показуємо коротке повідомлення 
    alert('Дякуємо за приєднання до наших повідомлень!');
}

// Функція відхилення пропозиції
function reject() {
    document.getElementById('myModal').style.display = "none";
}

// МОДАЛЬНЕ ВІКНО
// Отримання модального вікна та кнопки закриття
let modal = document.getElementById('modal');
let closeButton = document.getElementById('closeButton');

// Змінна для зберігання часового інтервалу
let countdown;

// Відображення модального вікна з рекламою через 5 секунд після завантаження сторінки
window.onload = function () {
    setTimeout(function () {
        modal.style.display = 'block';
        startCountdown();
    }, 7000); // Затримка для модального вікна: 7 секунд
};

// Функція для розпочатку обратного відліку
function startCountdown() {
    let seconds = 5;
    countdown = setInterval(function () {
        document.getElementById('countdownTimer').innerHTML = 'Зачекайте, щоб закрити... ' + seconds;
        if (seconds <= 0) {
            clearInterval(countdown);
            closeButton.classList.add('active');
            document.getElementById('countdownTimer').innerHTML = 'Можете закрити рекламу';
        }
        seconds--;
    }, 1000); // 1000 мс = 1 секунда
}

// Обробник події для кнопки закриття
closeButton.onclick = function () {
    modal.style.display = 'none';
};

// Активуємо кнопку закриття через 5 секунд
setTimeout(function () {
    closeButton.classList.add('active');
}, 7000);
// Затримка для активації кнопки закриття модального вікна: 7 секунд


// КНОПКА
window.onscroll = function () { scrollFunction() };

function scrollFunction() {
    if (document.body.scrollTop > (window.innerHeight * 2 / 3) || document.documentElement.scrollTop > (window.innerHeight * 2 / 3)) {
        document.getElementById("scrollToTopBtn").style.display = "block";
    }
    else {
        document.getElementById("scrollToTopBtn").style.display = "none";
    }
}

// Перекрутка наверх
function scrollToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

// РЕЄСТРАЦІЯ
document.addEventListener("DOMContentLoaded", function () {
    let modal_1 = document.getElementById("registrationModal");
    let openModalBtn = document.getElementById("openModal");
    let closeModalBtn = document.querySelector(".close_1");
    let form = document.querySelector("form");

    function openModal() {
        modal_1.style.display = "block";
    }

    function closeModal() {
        modal_1.style.display = "none";
    }

    function closeOutsideModal(event) {
        if (event.target === modal_1) {
            modal_1.style.display = "none";
        }
    }

    function validateForm(event) {
        event.preventDefault();
        let formData = new FormData(form);
        let userName = formData.get("username");
        let email = formData.get("email");
        let password = formData.get("password");
    
        // Перевірка чи всі поля заповнені
        if (!userName || !email || !password) {
            alert("Будь ласка, заповніть всі поля форми.");
            return;
        }
    
        let registration = { userName: userName, email: email, password: password, role: 'customer' };
        console.log("Дані успішно зчитані з форми:", registration);
    
        // Відправляємо POST-запит на сервер
        fetch('http://localhost:3003/api/register', {
            method: 'POST',
            body: JSON.stringify(registration), // Перетворюємо об'єкт на JSON-рядок для передачі через мережу
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            alert("Форма відправлена успішно!");
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            alert("Помилка під час відправки форми. Перевірте консоль для деталей.");
        });
    }    

    openModalBtn.addEventListener("click", openModal);
    closeModalBtn.addEventListener("click", closeModal);
    window.addEventListener("click", closeOutsideModal);
    form.addEventListener("submit", validateForm);
});

document.addEventListener("DOMContentLoaded", function () {
    const openModalButton = document.getElementById("openaauthorizationModal");
    const modal = document.getElementById("authorizationModal");
    const loginForm = document.getElementById("loginForm");
    const closeModalButton = document.getElementById("close_autho");

    function openModal() {
        modal.style.display = "block";
    }

    function closeModal() {
        modal.style.display = "none";
    }
    function authenticateUser(event) {
        event.preventDefault(); 

        const formData = new FormData(loginForm);
        const email = formData.get("emailFogin");
        const password = formData.get("passwordFogin");

        let userData = { email: email, password: password };

        fetch('http://localhost:3003/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
            .then(response => {
                if (response.ok) {
                    response.json().then(data => {
                        const username = data.username; 
                        const role = data.role; // Отримати роль користувача 

                        if (role === 'admin') {
                            localStorage.setItem('isAdmin', true);
                        } else {
                            localStorage.setItem('isAdmin', false);
                        }

                        alert(`Authorization successful, welcome ${username}!`);
                        closeModal();
                        localStorage.setItem('isAuthenticated', true);
                    });
                } else {
                    alert('Authorization failed');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    openModalButton.addEventListener("click", openModal);
    closeModalButton.addEventListener("click", closeModal);
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    loginForm.addEventListener("submit", authenticateUser);
});


document.addEventListener('DOMContentLoaded', function () {
    const adminButton = document.getElementById('adminButton');
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated) {
        const isAdmin = localStorage.getItem('isAdmin');
        if (isAdmin === 'true') {
            adminButton.style.display = 'block';
        } else {
            adminButton.style.display = 'none';
        }
    } else {
        adminButton.style.display = 'none';
    }
});


openModalButton.addEventListener("click", openModal);
closeModalButton.addEventListener("click", closeModal);

window.addEventListener("click", function (event) {
    if (event.target === modal) {
        closeModal();
    }
});

loginForm.addEventListener("submit", authenticateUser);
function openadminModal() {
    const modal = document.getElementById('adminModal');
    modal.style.display = 'block';
}

function closeadminModal() {
    const modal = document.getElementById('adminModal');
    modal.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function () {
    const closeButton = document.querySelector('.close_admin');
    if (closeButton) {
        closeButton.addEventListener('click', closeadminModal);
    }
});

function displayUsers() {
    fetch('http://localhost:3003/api/display')
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to fetch users');
            }
        })
        .then(data => {
            const userListElement = document.getElementById('userList');
            userListElement.innerHTML = '';
            data.forEach(user => {
                const userElement = document.createElement('div');
                userElement.textContent = `Ім'я користувача: ${user.userName}, Електронна пошта: ${user.email}`;
                userListElement.appendChild(userElement);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function deleteUser() {
    const email = prompt("Введіть email користувача для видалення:");
    const name = prompt("Введіть ім'я користувача для видалення:");
    const userData = { email: email, name: name };

    fetch('http://localhost:3003/api/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (response.ok) {
            alert("Користувача успішно видалено!");
        } else {
            alert("Не вдалося видалити користувача. Спробуйте ще раз.");
        }
    })
    .catch(error => {
        console.error('Помилка:', error);
    });
}

function addUser() {
    const name = prompt("Введіть ім'я нового користувача:");
    const email = prompt("Введіть email нового користувача:");
    const password = prompt("Введіть пароль нового користувача:");
    const userData = { userName: name, email: email, password: password };

    fetch('http://localhost:3003/api/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (response.ok) {
            alert("Нового користувача успішно додано!");
        } else {
            alert("Не вдалося додати нового користувача. Спробуйте ще раз.");
        }
    })
    .catch(error => {
        console.error('Помилка:', error);
    });
}

