const balance = document.getElementById('balance');
const income = document.getElementById('income');
const expense = document.getElementById('expense');
const transactionList = document.getElementById('transactionList');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const category = document.getElementById('category');
const search = document.getElementById('search');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let chart;

function generateID() {
  return Math.floor(Math.random() * 100000);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '' || category.value === '') {
    alert('Please fill out all fields');
    return;
  }

  const transaction = {
    id: generateID(),
    text: text.value,
    amount: +amount.value,
    category: category.value
  };

  transactions.push(transaction);
  updateLocalStorage();
  init();

  text.value = '';
  amount.value = '';
  category.value = '';
});

function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
  item.innerHTML = `
    ${transaction.text} (${transaction.category})
    <span>${sign}$${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;
  transactionList.appendChild(item);
}

function updateValues() {
  const amounts = transactions.map(t => t.amount);
  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
  const inc = amounts.filter(a => a > 0).reduce((a, b) => a + b, 0).toFixed(2);
  const exp = (
    amounts.filter(a => a < 0).reduce((a, b) => a + b, 0) * -1
  ).toFixed(2);

  balance.innerText = `$${total}`;
  income.innerText = `+$${inc}`;
  expense.innerText = `-$${exp}`;
}

function removeTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  init();
}

function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

search.addEventListener('input', () => {
  const term = search.value.toLowerCase();
  transactionList.innerHTML = '';
  transactions
    .filter(t => t.text.toLowerCase().includes(term))
    .forEach(addTransactionDOM);
});

function updateChart() {
  const incomeTotal = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const expenseTotal = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0) * -1;

  const ctx = document.getElementById('chart').getContext('2d');
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Income', 'Expense'],
      datasets: [{
        data: [incomeTotal, expenseTotal],
        backgroundColor: ['#2ecc71', 'crimson']
      }]
    }
  });
}

function init() {
  transactionList.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
  updateChart();
}

init();
