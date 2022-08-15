'use strict';
// BANKIST APP

// Data
const account1 = {
  owner: 'Narmin Hasanova',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// creating username
accounts.forEach(obj => obj.username = obj.owner.toLowerCase().split(' ')
  .map(item => item[0]).join(''));

// movements of user
const showMovements = function (movement, sort = false) {
  // sort ? or not
  const movs = sort ? movement.slice().sort((a, b) => a - b) : movement;
  // showing movements
  containerMovements.innerHTML = '';
  movs.forEach(function (movement, i) {
    const type = movement > 0 ? 'deposit' : 'withdrawal';
    let str = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${movement}€</div>
  </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', str);
  });
};

// sort
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  sorted = !sorted;
  showMovements(currentUser.movements, sorted);
});

// balance
const calcBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, move) => acc + move, 0);
  labelBalance.innerText = `${acc.balance}€`;
};

// summary
const inOutInterest = function (account) {
  // income
  const income = account.movements
    .filter(move => move > 0)
    .reduce((acc, move) => acc + move, 0);
  labelSumIn.innerText = income + "€";
  // outcome
  const outcome = account.movements
    .filter(move => move < 0)
    .reduce((acc, move) => acc + move, 0);
  labelSumOut.innerText = Math.abs(outcome) + "€";
  // interest 1.2% of deposits
  const interest = account.movements
    .filter(move => move > 0)
    .map(positiveMove => (positiveMove * account.interestRate / 100) >= 1 ? positiveMove * account.interestRate / 100 : 0)
    .reduce((acc, move) => acc + move, 0);
  labelSumInterest.innerText = interest.toFixed(2) + "€";
};

// Updating UI function
const updateUI = function (currentUser) {
  // calcBalance
  calcBalance(currentUser);
  // calcSummary
  inOutInterest(currentUser);
  // Display movements
  showMovements(currentUser.movements);
};

// login btn
let currentUser;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentUser = accounts.find(acc => acc.username === inputLoginUsername.value);
  if (currentUser) {
    if (currentUser.pin == inputLoginPin.value) {
      labelWelcome.innerText = `Hello, ${currentUser.owner.split(' ')[0]}!`;
      // Update UI
      updateUI(currentUser);
      // calcBalance
      calcBalance(currentUser);
      // calcSummary
      inOutInterest(currentUser);
      // Display movements
      showMovements(currentUser.movements);
      // Login form opacity
      containerApp.style.opacity = 100;
    } else
      alert('Password is incorrect!');
  } else
    alert(`This user doesn't exist!`);
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();
});

// transfer money to another user
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const transferToWhomObj = accounts.find(function (acc) {
    return acc.username === inputTransferTo.value
  });
  const transferAmount = Number(inputTransferAmount.value);

  inputTransferAmount.value = inputTransferTo.value = '';

  if (transferAmount > 0 && transferToWhomObj && transferToWhomObj?.username !== currentUser.username) {
    // Doing transfer
    currentUser.movements.push(-transferAmount);
    transferToWhomObj.movements.push(transferAmount);
    // Update UI
    updateUI(currentUser);
    console.log(transferToWhomObj, transferAmount);
  } else {
    console.log('there is a problem.');
  }
});

// request loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentUser.movements.some(mov => mov >= amount * 0.1)) {
    currentUser.movements.push(amount);
    updateUI(currentUser);
  }
  inputLoanAmount.value = '';
});

// close current account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (inputCloseUsername.value === currentUser.username && Number(inputClosePin.value) === currentUser.pin) {
    console.log('working');
    const index = accounts.findIndex(function (acc) {
      return acc.username === currentUser.username;
    });
    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});