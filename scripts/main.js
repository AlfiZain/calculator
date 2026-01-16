const calculatorState = {
  firstValue: '0',
  secondValue: '',
  operator: '',
  itHasOperator: false,
  isEqualityPressed: false,
};

const calculatorElement = document.querySelector('.calculator');

function add(number1, number2) {
  return number1 + number2;
}

function subtract(number1, number2) {
  return number1 - number2;
}

function multiply(number1, number2) {
  return number1 * number2;
}

function divide(number1, number2) {
  return round(number1 / number2);
}

function round(value, decimals = 9) {
  return Number(value.toFixed(decimals));
}

function operate(operator, number1, number2) {
  if (operator === '+') {
    return add(number1, number2);
  } else if (operator === '-') {
    return subtract(number1, number2);
  } else if (operator === '*') {
    return multiply(number1, number2);
  } else if (operator === '/') {
    return divide(number1, number2);
  }
}

function updateDisplay(value) {
  const displayElement = document.querySelector('.display');
  displayElement.value = isFinite(value) ? value : "You can't divide by zero";
}

function resetState() {
  calculatorState.firstValue = '0';
  calculatorState.secondValue = '';
  calculatorState.operator = '';
  calculatorState.itHasOperator = false;
  calculatorState.isEqualityPressed = false;
  updateDisplay(calculatorState.firstValue);
}

function inputNumber(number) {
  if (calculatorState.isEqualityPressed) resetState();

  if (calculatorState.itHasOperator) {
    calculatorState.secondValue += number;
    updateDisplay(calculatorState.secondValue);
    return;
  }

  calculatorState.firstValue === '0'
    ? (calculatorState.firstValue = number)
    : (calculatorState.firstValue += number);

  updateDisplay(calculatorState.firstValue);
}

function inputOperator(operator) {
  if (calculatorState.itHasOperator && calculatorState.secondValue) {
    const result = operate(
      calculatorState.operator,
      Number(calculatorState.firstValue),
      Number(calculatorState.secondValue)
    );
    updateDisplay(result);

    calculatorState.firstValue = Number.isFinite(result) ? result : '0';
    calculatorState.secondValue = '';
    calculatorState.operator = operator;
    return;
  }

  calculatorState.operator = operator;
  calculatorState.itHasOperator = true;
  calculatorState.isEqualityPressed = false;
}

function inputAction(action) {
  if (action === 'equals') {
    if (!calculatorState.itHasOperator) return;
    if (calculatorState.secondValue === '') return;

    const result = operate(
      calculatorState.operator,
      Number(calculatorState.firstValue),
      Number(calculatorState.secondValue)
    );
    updateDisplay(result);

    calculatorState.firstValue = Number.isFinite(result) ? result : '0';
    calculatorState.secondValue = '';
    calculatorState.operator = '';
    calculatorState.itHasOperator = false;
    calculatorState.isEqualityPressed = true;
  } else if (action === 'clear') {
    resetState();
  }
}

function handleCalculatorClick(event) {
  const button = event.target.closest('button');
  if (!button) return;

  const { type, value } = button.dataset;

  switch (type) {
    case 'digit':
      inputNumber(value);
      break;
    case 'operator':
      inputOperator(value);
      break;
    case 'action':
      inputAction(value);
      break;
  }
}

calculatorElement.addEventListener('click', (event) => {
  handleCalculatorClick(event);
});
