const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

app.use(express.json()); // Парсити дані з запиту в форматі JSON

app.use(cors());

// ПЕРЕВІРКА ЧИ ВЗАГАЛІ РОБОЧЕ
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Express Server</title>
        </head>
        <body>
            <h1>Welcome to Express Server!</h1>
            <p>This is a sample page served by the Express server.</p>
        </body>
        </html>
    `);
});

//РЕЄСТРАЦІЯ
app.post('/api/register', (req, res) => {
    const userData = req.body; // Отримати дані з тіла запиту
    console.log(req.body);

    fs.readFile('user.json', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }

        const users = JSON.parse(data);
        users.push(userData);

        fs.writeFile('user.json', JSON.stringify(users, null, 2), err => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            res.status(200).json(users);
        });
    });
});

// АВТОРИЗАЦІЯ
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    // Отримати дані з файлу user.json
    fs.readFile('user.json', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }

        const users = JSON.parse(data);
        // Перевірка на збіг
        const foundUser = users.find(user => user.email === email && user.password === password);

        if (foundUser) {
            foundUser.username = foundUser.userName;
            foundUser.role = foundUser.role;
            res.status(200).json(foundUser);
        } else {
            res.status(401).send('Invalid email or password');
        }
    });
});

// ВІДОБРАЖЕННЯ КОРИСТУВАЧІВ
app.get('/api/display', (req, res) => {
    // Зчитуємо дані з файлу user.json
    fs.readFile('user.json', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        const users = JSON.parse(data);
        res.json(users);
    });
});

//ВИДАЛЕННЯ КОРИСТУВАЧА
app.post('/api/delete', (req, res) => {
    const { email, name } = req.body;

    fs.readFile('user.json', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Помилка сервера');
            return;
        }
        const users = JSON.parse(data);

        // Пошук користувача
        const userIndex = users.findIndex(user => user.email === email && user.userName === name);
        if (userIndex !== -1) {
            users.splice(userIndex, 1);
            fs.writeFile('user.json', JSON.stringify(users), (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Помилка сервера');
                    return;
                }
                res.status(200).send('Користувача успішно видалено!');
            });
        } else {
            res.status(404).send('Користувача не знайдено!');
        }
    });
});

// ДОДАТИ НОВОГО КОРИСТУВАЧА
app.post('/api/add', (req, res) => {
    const newUser = req.body; 

    fs.readFile('user.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Помилка читання файлу:', err);
            return res.status(500).send('Виникла помилка під час читання файлу');
        }

        let users = JSON.parse(data); 
        users.push(newUser);

        const updatedData = JSON.stringify(users, null, 2);

        fs.writeFile('user.json', updatedData, 'utf8', (err) => {
            if (err) {
                console.error('Помилка запису у файл:', err);
                return res.status(500).send('Виникла помилка під час запису у файл');
            }
            console.log('Новий користувач успішно доданий до файлу user.json.');
            res.status(200).send('Новий користувач успішно доданий');
        });
    });
});

// ОНОВЛЕННЯ ЦІН
app.post('/api/updatePrice', (req, res) => {
    const productName = req.body.name; 
    const newPrice = req.body.price; 

    fs.readFile('product.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send("Сталася помилка при зчитуванні файлу");
            return;
        }

        let products = JSON.parse(data);
        const productIndex = products.findIndex(product => product.name === productName);

        if (productIndex !== -1) {
            products[productIndex].price = newPrice;

            fs.writeFile('product.json', JSON.stringify(products), 'utf8', (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).send("Сталася помилка при оновленні ціни товару");
                    return;
                }
                res.send("Ціна товару оновлена успішно!");
            });
        } else {
            res.status(404).send("Товар з такою назвою не знайдено");
        }
    });
});

const PORT = 3003;
const HOST = 'localhost';

app.listen(PORT, HOST, () => {
    console.log(`Server is running at http://${HOST}:${PORT}`);
});

