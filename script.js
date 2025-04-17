// script.js

const form = document.getElementById('currency-form');
const amountInput = document.getElementById('amount');
const fromCurrencySelect = document.getElementById('from-currency');
const toCurrencySelect = document.getElementById('to-currency');
const resultDiv = document.getElementById('result');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');

const apiKey = 'fca_live_zxvxYWFH2HdfusDM89FHvkEYEbFadNw2AOMqKkC1'; // Замените на свой ключ API
const apiUrl = 'https://api.freecurrencyapi.com/v1/latest?apikey=' + apiKey;

// Функция для получения списка валют и заполнения выпадающих списков
async function getCurrencies() {
    loadingDiv.style.display = 'block';
    errorDiv.textContent = '';

    try {
        const response = await fetch(apiUrl + '&base_currency=USD'); // Получаем список валют относительно USD
        const data = await response.json();

        if (response.ok) {
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
            errorDiv.textContent = `Ошибка при загрузке валют: ${response.status} ${response.statusText}`;
        }
    } catch (error) {
        errorDiv.textContent = `Ошибка сети: ${error.message}`;
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
        const data = await response.json();

        if (response.ok) {
            const rate = data.data[toCurrency];
            const result = amount * rate;
            resultDiv.textContent = `${amount} ${fromCurrency} = ${result.toFixed(2)} ${toCurrency}`;
        } else {
            errorDiv.textContent = `Ошибка при конвертации: ${response.status} ${response.statusText}`;
        }
    } catch (error) {
        errorDiv.textContent = `Ошибка сети: ${error.message}`;
    } finally {
        loadingDiv.style.display = 'none';
    }
}


// Обработчик отправки формы
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Предотвращаем перезагрузку страницы

    const amount = parseFloat(amountInput.value);
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;

    if (isNaN(amount) || amount <= 0) {
        errorDiv.textContent = 'Пожалуйста, введите корректную сумму.';
        return;
    }

    convertCurrency(amount, fromCurrency, toCurrency);
});

// Загружаем список валют при загрузке страницы
getCurrencies();