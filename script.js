// script.js

const form = document.getElementById('currency-form');
const amountInput = document.getElementById('amount');
const fromCurrencySelect = document.getElementById('from-currency');
const toCurrencySelect = document.getElementById('to-currency');
const resultDiv = document.getElementById('result');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');

const apiKey = 'YOUR_API_KEY'; // Замените на свой ключ API
const apiUrl = 'https://api.freecurrencyapi.com/v1/latest?apikey=' + apiKey;

// Функция для получения списка валют и заполнения выпадающих списков
async function getCurrencies() {
    loadingDiv.style.display = 'block';
    errorDiv.textContent = '';

    try {
        const response = await fetch(apiUrl + '&base_currency=USD'); // Получаем список валют относительно USD

        if (!response.ok) {
            throw new Error(`Ошибка при загрузке валют: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data && data.data) {
            const currencies = Object.keys(data.data);

            // Заполняем выпадающие списки
            currencies.forEach(currency => {
                const option1 = document.createElement('option');
                option1.value = currency;
                option1.textContent = currency;
                fromCurrencySelect.appendChild(option1);

                const option2 = document.createElement('option');
                option2.value = currency;
                option2.textContent = currency;
                toCurrencySelect.appendChild(option2);
            });
        } else {
            throw new Error('Неверный формат данных от API');
        }
    } catch (error) {
        errorDiv.textContent = `Ошибка: ${error.message}`;
        console.error(error); // Выводим ошибку в консоль для отладки
    } finally {
        loadingDiv.style.display = 'none';
    }
}

// Функция для конвертации валюты
async function convertCurrency(amount, fromCurrency, toCurrency) {
    loadingDiv.style.display = 'block';
    errorDiv.textContent = '';

    try {
        const response = await fetch(apiUrl + `&base_currency=${fromCurrency}&currencies=${toCurrency}`);

        if (!response.ok) {
            throw new Error(`Ошибка при конвертации: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data && data.data && data.data[toCurrency]) {
            const rate = data.data[toCurrency];
            const result = amount * rate;
            resultDiv.textContent = `${amount} ${fromCurrency} = ${result.toFixed(2)} ${toCurrency}`;
        } else {
            throw new Error('Не удалось получить курс валюты');
        }
    } catch (error) {
        errorDiv.textContent = `Ошибка: ${error.message}`;
        console.error(error); // Выводим ошибку в консоль для отладки
    } finally {
        loadingDiv.style.display = 'none';
    }
}


// Обработчик отправки формы
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Предотвращаем перезагрузку страницы

    let amount = parseFloat(amountInput.value);

    if (isNaN(amount)) {
        errorDiv.textContent = 'Пожалуйста, введите корректную сумму.';
        return;
    }

    // Округляем до двух знаков после запятой
    amount = amount.toFixed(2);

    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;

    convertCurrency(amount, fromCurrency, toCurrency);
});

// Загружаем список валют при загрузке страницы
getCurrencies();