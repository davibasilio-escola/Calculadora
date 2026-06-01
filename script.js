const previousOpText = document.getElementById('previous-operation');
const currentOpText = document.getElementById('current-operation');

let currentOperand = '0';
let previousOperand = '';
let operationReset = false; // Reinicia o visor se o usuário clicar em um número após um resultado

function updateDisplay() {
    currentOpText.innerText = currentOperand;
    previousOpText.innerText = previousOperand;
}

function appendNumber(number) {
    // Evita acumular zeros à esquerda ou múltiplos pontos
    if (number === '.' && currentOperand.includes('.')) return;
    
    if (currentOperand === '0' && number !== '.') {
        currentOperand = number;
    } else if (operationReset) {
        currentOperand = number;
        operationReset = false;
    } else {
        currentOperand += number;
    }
    updateDisplay();
}

function appendOperator(operator) {
    if (operationReset) operationReset = false;
    
    // Permite trocar o operador se o último caractere já for um operador
    const lastChar = currentOperand.slice(-1);
    if (['+', '-', '*', '/'].includes(lastChar) && ['+', '-', '*', '/'].includes(operator)) {
        currentOperand = currentOperand.slice(0, -1) + operator;
    } else {
        if (currentOperand === '0' && operator !== '(') {
            currentOperand = operator;
        } else {
            currentOperand += operator;
        }
    }
    updateDisplay();
}

function clearAll() {
    currentOperand = '0';
    previousOperand = '';
    updateDisplay();
}

function deleteDigit() {
    if (currentOperand.length <= 1) {
        currentOperand = '0';
    } else {
        currentOperand = currentOperand.slice(0, -1);
    }
    updateDisplay();
}

function calculate() {
    let result;
    const expression = currentOperand;
    
    try {
        // Avalia a string matemática com segurança básica
        // Nota: Substitui os símbolos visuais internos se necessário antes de rodar
        result = eval(expression);
        
        if (result === undefined || isNaN(result)) {
            throw new Error();
        }
        
        // Trata divisões por zero ou resultados infinitos
        if (!isFinite(result)) {
            currentOperand = 'Erro (Div por 0)';
            previousOperand = expression + ' =';
            operationReset = true;
            updateDisplay();
            return;
        }

        // Limita as casas decimais para não quebrar o layout
        if (result.toString().includes('.')) {
            result = parseFloat(result.toFixed(4));
        }

        previousOperand = expression + ' =';
        currentOperand = result.toString();
        operationReset = true;
        
    } catch (error) {
        currentOperand = 'Erro de Sintaxe';
        previousOperand = expression;
        operationReset = true;
    }
    updateDisplay();
}