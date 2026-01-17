const calculatorState = {
  firstOperand: '0',
  secondOperand: '',
  operator: null,
  hasDecimal: false,
  isEqualPressed: false,
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

function updateDisplay(value) {
  const displayElement = document.querySelector('.display');
  const decimalButton = document.querySelector('.decimal');
  decimalButton.disabled = false;

  if (!isFinite(value)) {
    displayElement.value = "You can't divide by zero";
    return;
  } else if (!Number.isInteger(Number(value))) {
    decimalButton.disabled = true;
    calculatorState.hasDecimal = true;
  }

  displayElement.value = value;
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

  if (calculatorState.operator !== null) {
    calculatorState.secondOperand === '0'
      ? (calculatorState.secondOperand = number)
      : (calculatorState.secondOperand += number);
    updateDisplay(calculatorState.secondOperand);
    return;
  }

  calculatorState.firstOperand === '0'
    ? (calculatorState.firstOperand = number)
    : (calculatorState.firstOperand += number);

  updateDisplay(calculatorState.firstOperand);
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
    calculatorState.hasDecimal = false;
    return;
  }

  calculatorState.operator = operator;
  calculatorState.isEqualPressed = false;
  calculatorState.hasDecimal = false;
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

    calculatorState.hasDecimal = true;

    if (calculatorState.operator !== null) {
      calculatorState.secondOperand += '.';
      updateDisplay(calculatorState.secondOperand);
      return;
    }

    calculatorState.firstOperand += '.';
    updateDisplay(calculatorState.firstOperand);
  } else if (action === 'backspace') {
    const key =
      calculatorState.operator !== null ? 'secondOperand' : 'firstOperand';

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
