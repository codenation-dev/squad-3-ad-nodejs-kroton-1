const splitedOddEven = {
    odd: [],
    even: [],
};

function splitOddEven() {
    let number = 0;

    for(number; number <= 50; number++) {
        if(number % 2) {
            splitedOddEven.odd.push(number);
        } else {
            splitedOddEven.even.push(number);
        }
    }

    return splitedOddEven;
}

console.log(splitOddEven())