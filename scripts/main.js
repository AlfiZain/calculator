const calculatorState = {
  firstOperand: '0',
  secondOperand: '',
  operator: null,
  hasDecimal: false,
  isEqualPressed: false,
};

const calculatorElement = document.querySelector('.calculator');
const displayElement = document.querySelector('.display');
const decimalButton = document.querySelector('.decimal');

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
  return number1 / number2;
}

function round(value, decimals = 9) {
  return Number(value.toFixed(decimals));
}

function operate(operator, number1, number2) {
  if (operator === '+') {
    return round(add(number1, number2));
  } else if (operator === '-') {
    return round(subtract(number1, number2));
  } else if (operator === '*') {
    return round(multiply(number1, number2));
  } else if (operator === '/') {
    return round(divide(number1, number2));
  }
}

function setHasDecimal() {
  calculatorState.hasDecimal = displayElement.value.includes('.');
  decimalButton.disabled = calculatorState.hasDecimal;
}

function getActiveOperandKey() {
  return calculatorState.operator !== null ? 'secondOperand' : 'firstOperand';
}

function updateDisplay(value) {
  if (!isFinite(value)) {
    displayElement.value = "You can't divide by zero";
    return;
  }

  displayElement.value = value;
  setHasDecimal();
}

function resetState() {
  calculatorState.firstOperand = '0';
  calculatorState.secondOperand = '';
  calculatorState.operator = null;
  calculatorState.isEqualPressed = false;
  calculatorState.hasDecimal = false;
  updateDisplay(calculatorState.firstOperand);
}

function inputNumber(number) {
  if (calculatorState.isEqualPressed) resetState();

  const key = getActiveOperandKey();

  calculatorState[key] === '0'
    ? (calculatorState[key] = number)
    : (calculatorState[key] += number);
  updateDisplay(calculatorState[key]);
}

function inputOperator(operator) {
  if (calculatorState.operator !== null && calculatorState.secondOperand) {
    const result = operate(
      calculatorState.operator,
      Number(calculatorState.firstOperand),
      Number(calculatorState.secondOperand)
    );
    updateDisplay(result);

    calculatorState.firstOperand = Number.isFinite(result) ? result : '0';
    calculatorState.secondOperand = '';
    calculatorState.operator = operator;
    return;
  }

  calculatorState.operator = operator;
  calculatorState.isEqualPressed = false;
}

function inputAction(action) {
  if (action === 'equals') {
    if (calculatorState.operator === null) return;
    if (calculatorState.secondOperand === '') return;

    const result = operate(
      calculatorState.operator,
      Number(calculatorState.firstOperand),
      Number(calculatorState.secondOperand)
    );

    calculatorState.firstOperand = Number.isFinite(result) ? result : '0';
    calculatorState.secondOperand = '';
    calculatorState.operator = null;
    calculatorState.isEqualPressed = true;
    calculatorState.hasDecimal = false;
    updateDisplay(result);
  } else if (action === 'clear') {
    resetState();
  } else if (action === 'decimal') {
    if (calculatorState.hasDecimal) return;

    calculatorState.isEqualPressed = false;
    const key = getActiveOperandKey();

    calculatorState[key] += '.';
    updateDisplay(calculatorState[key]);
  } else if (action === 'backspace') {
    const key = getActiveOperandKey();

    calculatorState[key] = String(calculatorState[key]).slice(0, -1) || '0';
    calculatorState.isEqualPressed = false;
    updateDisplay(calculatorState[key]);
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
