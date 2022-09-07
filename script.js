'use strict';
// BANKIST APP

// Data
const account1 = {
  owner: 'Narmin Hasanova',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300, 210],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2022-09-05T10:51:36.790Z",
    "2022-09-06T10:36:17.929Z",
    "2022-09-07T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
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
const showMovements = function (acc, sort = false) {
  // sort ? or not
  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;
  // showing movements
  containerMovements.innerHTML = '';

  movs.forEach(function (movement, i) {
    const type = movement > 0 ? 'deposit' : 'withdrawal';

    // getting date of every movement
    const d = +new Date(acc.movementsDates[i]);
    const curr = +new Date();
    let daysCount = Math.round((curr - d) / (1000 * 60 * 60 * 24));
    let displayDate;
    if (daysCount === 0) {
      displayDate = 'Today'
    }
    else if (daysCount === 1) {
      displayDate = 'Yesterday'
    }
    else if (daysCount > 1 && daysCount < 7) {
      displayDate = `${daysCount} days ago`;
    } else {
      const d = new Date(acc.movementsDates[i]);
      const options = {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      };
      displayDate = new Intl.DateTimeFormat(navigator.language, options).format(d);
    }
    let str = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">
    ${i + 1} ${type}</div>
    <div class="movements_date">${displayDate}</div>
    <div class="movements__value">${movement.toFixed(2)}€</div>
  </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', str);
  });
};

// sort
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  sorted = !sorted;
  showMovements(currentUser, sorted);
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
  labelSumIn.innerText = income.toFixed(2) + "€";

  // outcome
  const outcome = account.movements
    .filter(move => move < 0)
    .reduce((acc, move) => acc + move, 0);
  labelSumOut.innerText = Math.abs(outcome).toFixed(2) + "€";

  // interest 1.2% of deposits
  const interest = account.movements
    .filter(move => move > 0)
    .map(positiveMove => (positiveMove * account.interestRate) / 100)
    .filter((interes) => interes >= 1)
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
  showMovements(currentUser);
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

      // Login form opacity
      containerApp.style.opacity = 100;

      // Date API
      const now = new Date();
      const options = {
        weekday: 'long',
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      const locale = navigator.language;
      labelDate.innerText = new Intl.DateTimeFormat(locale, options).format(now);
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

    // Add transfer date
    currentUser.movementsDates.push(new Date().toISOString());
    transferToWhomObj.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentUser);
  } else {
    console.log('there is a problem.');
  }
});

// request loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentUser.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentUser.movements.push(amount);

    // Add loan date
    currentUser.movementsDates.push(new Date().toISOString());

    // updating UI
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

// fake logged in account
let currAccount;

currAccount = account1;
updateUI(currAccount);
containerApp.style.opacity = 100;





// const arr = Array.from({ length: 100 }, () => Math.trunc(Math.random() * 100) + 1);
// console.log(...arr);