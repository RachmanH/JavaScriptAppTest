// To-Do List Script
function btnAdd() {
    var inputValue = document.getElementById("input").value;
    var list = document.getElementById('list');
    var notification = document.querySelector('.notification');
    var notificationempty = document.querySelector('.notification-empty');

    if (inputValue === '') {
        if (notificationempty) {
            notificationempty.style.display = 'block';
            notificationempty.classList.add('fade-in');

            setTimeout(() => {
                notificationempty.classList.remove('fade-in');
                notificationempty.style.display = 'none';
            }, 3000);
        }
    } else {
        var li = document.createElement('li');
        li.appendChild(document.createTextNode(inputValue));

        var btn = document.createElement('button');
        btn.appendChild(document.createTextNode('x'));
        btn.className = 'delete-btn';

        btn.onclick = function () {
            list.removeChild(li);

            if (notification) {
                notification.style.display = 'block';
                notification.classList.add('fade-in');

                setTimeout(() => {
                    notification.classList.remove('fade-in');
                    notification.style.display = 'none';
                }, 3000);
            }
        };

        li.appendChild(btn);

        list.appendChild(li);

        if (notification) {
            notification.style.display = 'none';
        }

        document.getElementById("input").value = "";
    }
}

function toggleChecked() {
    var list = document.getElementById('list');
    list.addEventListener('click', function(ev) {
        if (ev.target.tagName === 'LI') {
            ev.target.classList.toggle('checked');
        }
    }, false);
}

document.addEventListener('DOMContentLoaded', function() {
    toggleChecked();
});

// Calculator Script
const calculator = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
    operation: '',
    isResult: false 
};

function updateDisplay() {
    const display = document.querySelector('.calculator-screen');
    display.value = calculator.isResult ? calculator.displayValue : calculator.operation || calculator.displayValue;
}

function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculator;
    
    if (waitingForSecondOperand === true) {
        calculator.displayValue = digit;
        calculator.waitingForSecondOperand = false;
    } else {
        calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
    
    if (calculator.operator) {
        calculator.operation = `${calculator.firstOperand} ${calculator.operator} ${calculator.displayValue}`;
        updateDisplay();
    } else {
        updateDisplay();
    }
}

function inputDecimal(dot) {
    if (calculator.waitingForSecondOperand === true) {
        calculator.displayValue = "0."
        calculator.waitingForSecondOperand = false;
        return;
    }
    
    if (!calculator.displayValue.includes(dot)) {
        calculator.displayValue += dot;
    }
    updateDisplay();
}

function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = calculator;
    const inputValue = parseFloat(displayValue);
    
    if (operator && calculator.waitingForSecondOperand) {
        calculator.operator = nextOperator;
        return;
    }
    
    if (firstOperand === null && !isNaN(inputValue)) {
        calculator.firstOperand = inputValue;
    } else if (operator) {
        const result = calculate(firstOperand, inputValue, operator);
        calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
        calculator.firstOperand = result;
    }
    
    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;
    calculator.operation = `${calculator.firstOperand} ${calculator.operator}`;
    updateDisplay();
}

function calculate(firstOperand, secondOperand, operator) {
    switch(operator) {
        case '+': return firstOperand + secondOperand;
        case '-': return firstOperand - secondOperand;
        case '*': return firstOperand * secondOperand;
        case '/': return firstOperand / secondOperand;
        default: return secondOperand;
    }
}

function resetCalculator() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
    calculator.operation = '';
    calculator.isResult = false;
    updateDisplay();
}

function handleEqualSign() {
    if (calculator.operator && calculator.firstOperand !== null) {
        const result = calculate(calculator.firstOperand, parseFloat(calculator.displayValue), calculator.operator);
        calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
        calculator.firstOperand = result;
        calculator.operator = null;
        calculator.isResult = true;
        updateDisplay();
    }
}

function toggleSign() {
    calculator.displayValue = (parseFloat(calculator.displayValue) * -1).toString();
    updateDisplay();
}

document.addEventListener('DOMContentLoaded', function() {
    const keys = document.querySelector('.calculator-keys');
    keys.addEventListener('click', (event) => {
        const { target } = event;
        const { value } = target;

        if (!target.matches('button')) {
            return;
        }

        switch (value) {
            case '+':
            case '-':
            case '*':
            case '/':
            case '=':
                handleOperator(value);
                break;
            case '.':
                inputDecimal(value);
                break;
            case 'all-clear':
                resetCalculator();
                break;
            case '+/-':
                toggleSign();
                break;
            default:
                if (Number.isInteger(parseFloat(value))) {
                    inputDigit(value);
                }
        }
        
        updateDisplay();
    });

    updateDisplay();
});