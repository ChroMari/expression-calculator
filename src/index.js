function eval() {
    // Do not use eval!!!
    return;
}

const priorityOperations = { // отвечает за приоритет операций
    '(': 1,
    ')': 1,
    '+': 2,
    '-': 2,
    '/': 3,
    '*': 3
};

const strSpace = (str) => {
    let resultStr = '' + str[0];

    for (let i = 1; i < str.length; i++) {
        if (!isNaN(str[i]) && str[i] !== ' ') {
            resultStr += str[i];
        } else if (priorityOperations[str[i]]) {
            if (resultStr[resultStr.length -1 ] != ' ') resultStr += ' ';
            resultStr += [str[i]];
            resultStr += ' ';
        }
    }
    return resultStr.trim();
}

function expressionCalculator(expr) {
    expr = strSpace(expr);
    expr = expr.split(' ');

    let arrayNumber = [];
    let arrayOper = [];

    for (let i = 0; i < expr.length; i++) {
        if (expr[i] !== ' ') {
            if (!isNaN(expr[i])) { // проверяем можем ли мы сделать из этого число
                arrayNumber.push(Number(expr[i]));
            } // иначе перед нами оператор 

            else if (arrayOper.length === 0) { // если это операция, а не число и также проверяем, что стек пустой у нас
                arrayOper.push(expr[i]);
            } 
            else { // перед нами оператор и нам нужно добавить его в стек или убрать из стека
                if (expr[i] === '(') {
                    arrayOper.push(expr[i]);
                }

                else if (expr[i] === ')') { // если дошли до закрывающей скобки из стека нужно забрать всё что было до это скобки
                    for (let i = arrayOper.length - 1; i !== 0; i--) {
                        if (arrayOper[i] != '(') {
                            let last = arrayOper.pop(); // забираем из массива последний элемент
                            arrayNumber.push(last);
                        } else {
                            break;
                        }
                    }
                    if (arrayOper.indexOf('(') > -1) {
                        arrayOper.pop();
                    }
                    else {
                        throw('ExpressionError: Brackets must be paired');
                    }
                }

                else if (priorityOperations[arrayOper[arrayOper.length - 1]] <  priorityOperations[expr[i]]) {
                    arrayOper.push(expr[i]);
                }

                else if (priorityOperations[arrayOper[arrayOper.length - 1]] ===  priorityOperations[expr[i]]) { // если операции равные
                    let last = arrayOper.pop(); // забираем из массива последний элемент
                    arrayNumber.push(last);
                    arrayOper.push(expr[i]);
                } 

                else if (priorityOperations[arrayOper[arrayOper.length - 1]] >  priorityOperations[expr[i]]) { // если новый оператор больше
                    //let last = arrayOper.pop(); // забираем из массива последний элемент
                    //arrayNumber.push(last);
                    //arrayOper.push(expr[i]);
                    
                    for (let i = arrayOper.length - 1; i >= 0; i--) {
                        if (arrayOper[i] === ')' || arrayOper[i] === '(') break;
                        else arrayNumber.push(arrayOper[i]);
                        arrayOper.pop();
                    }
                    arrayOper.push(expr[i]);
                } 

            }
            
        }
    }

    if (arrayOper.indexOf(')') > -1 || arrayOper.indexOf('(') > -1) {
        throw('ExpressionError: Brackets must be paired');
    }
    else if (arrayOper.length > 0) {
        arrayNumber.push(...arrayOper.reverse());
    }

    let resArray = [];

    for (let i = 0; i < arrayNumber.length; i++) {
      
        if (typeof arrayNumber[i] === 'number') {
            resArray.push(arrayNumber[i]);
        } else {
            let a = resArray[resArray.length - 2];
            let b = resArray[resArray.length - 1];
            resArray.pop();
            resArray.pop();
        
            if (arrayNumber[i] == '+') resArray.push(a + b);
            else if (arrayNumber[i] == '-') resArray.push(a - b);
            else if (arrayNumber[i] == '*') resArray.push(a * b);
            else if (arrayNumber[i] == '/') {
                if (b === 0) {
                    throw('TypeError: Division by zero.');
                }
                resArray.push((a / b));
            }
        }
    }


    return resArray[0];
}

module.exports = {
    expressionCalculator
}