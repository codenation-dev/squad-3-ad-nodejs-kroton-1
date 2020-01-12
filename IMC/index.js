
const init = (weight, height) =>{
    const result = calculate (weight, height)
    
    if(result < 17) {
        return 'Muito abaixo do peso'
    } else if(result <= 18.49){
        return 'Abaixo do peso'
    } else if (result >= 18.5 && result <= 24.99) {
        return 'Peso normal'
    }
}

const calculate = (weight, height) => {
    return parseInt(weight / (height * height))
}


module.exports = {
    init,
    calculate,
}