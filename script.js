// ARRAY to store all expenses
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

const form = document.getElementById('expense-form');
const list = document.getElementById('expense-list');
const totalEl = document.getElementById('total');
const budgetEl = document.getElementById('budget');
const statusEl = document.getElementById('status');

function renderExpenses(filter = 'All') {
  list.innerHTML = ''; // Clear DOM
  let total = 0;

  // Loop through array and update DOM
  expenses.forEach((exp, index) => {
    // CONDITIONAL: filter logic
    if (filter !== 'All' && exp.category !== filter) return;

    total += Number(exp.amount);
    
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${exp.name} - $${exp.amount} <small>[${exp.category}]</small></span>
      <button class="delete" onclick="deleteExpense(${index})">X</button>
    `;
    list.appendChild(li); // DOM UPDATE
  });

  totalEl.textContent = total.toFixed(2);
  
  // CONDITIONAL: budget check
  const budget = Number(budgetEl.value);
  if (total > budget) {
    statusEl.textContent = '⚠️ Over Budget!';
    statusEl.style.color = 'yellow';
  } else if (total > budget * 0.8) {
    statusEl.textContent = '⚠️ Close to budget limit';
    statusEl.style.color = 'orange';
  } else {
    statusEl.textContent = '✅ Within Budget';
    statusEl.style.color = 'lightgreen';
  }

  localStorage.setItem('expenses', JSON.stringify(expenses));
}

// EVENT: form submit
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const amount = document.getElementById('amount').value;
  const category = document.getElementById('category').value;

  // CONDITIONAL: validation
  if (!name || amount <= 0 || !category) {
    alert('Please fill all fields correctly');
    return;
  }

  // Add to ARRAY
  expenses.push({ name, amount, category, id: Date.now() });
  form.reset();
  renderExpenses();
});

function deleteExpense(index) {
  expenses.splice(index, 1); // Remove from array
  renderExpenses();
}

function filterExpenses(category) {
  renderExpenses(category);
}

// EVENT: budget change
budgetEl.addEventListener('input', () => renderExpenses());

// Initial render
renderExpenses();