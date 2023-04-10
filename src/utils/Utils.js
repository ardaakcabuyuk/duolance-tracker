function calcPercentage(num1, num2) {	
    if (!num1 && !num2) {
        return 0;
    }
    else if (!num2) {
        return 100;
    }
    else {
        const percentage = ((num1 / num2) * 100).toFixed(1);
        if (percentage > 100) {
            return 100;
        }
        return percentage;
    }
}

export {
    calcPercentage,
}