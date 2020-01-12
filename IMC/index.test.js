const {init, calculate} = require('./index.js')

describe('IMC Calculator', ()=> {

    test('Result should indicate person\'s condition', () => {
        expect(init(65, 1.70)).toBe('Peso normal')
    });

    test('Result should match IMC table',()=> {
        expect(calculate(65, 1.70)).toBe(22)
    });

});