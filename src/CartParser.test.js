import CartParser from './CartParser'
import ErrorType from './CartParser';
import { readFileSync } from 'fs';

let parser, parse, validate;

beforeEach(() => {
    parser = new CartParser();
    parse = parser.parse.bind(parser);
    validate = parser.validate.bind(parser);
});

describe("CartParser - unit tests", () => {
    // Add your unit tests here.

    const path = "./samples/cart.csv";
    const contents = readFileSync(path, 'utf-8', 'r');
    it('Should return array of errors is empty', () => {
        expect(validate(contents)).toHaveLength(0)
    });
    const notValidCellContent =
        `Product name,Price,Quantity
                 ,18.90,1`;
    it('should recive error with type  - ErrorType.CELL', () => {
        expect(validate(notValidCellContent)[0].type).toEqual(parser.ErrorType.CELL)
    });

    const notValidHeaderContent = `Product name,     ,Quantity`;
    it('should recive error with type  - ErrorType.HEADER', () => {
        expect(validate(notValidHeaderContent)[0].type).toEqual(parser.ErrorType.HEADER)
    });

    const notValidRowContent = `Product name,Price,Quantity
                            Mollis consequat,9.00`;
    it('should recive error with type  - ErrorType.ROW ', () => {
        expect(validate(notValidRowContent)[0].type).toEqual(parser.ErrorType.ROW)
    });

    const notValidQuantityContent = `Product name,Price,Quantity
    Mollis consequat,9.00,-2`;
    it('should recive error with type  - ErrorType.CELL', () => {
        expect(validate(notValidQuantityContent)[0].type).toEqual(parser.ErrorType.CELL)
    });

    const csvLine = 'Consectetur adipiscing,28.72,10';
    it('should return  object with keys from column keys and values from CSV.', () => {
        expect(parser.parseLine(csvLine)).toBeDefined()
        expect(parser.parseLine(csvLine)['name']).toEqual("Consectetur adipiscing")
        expect(parser.parseLine(csvLine)['price']).toEqual(28.72)
        expect(parser.parseLine(csvLine)['quantity']).toEqual(10)
    });
    it('Should return the total cost of all orders', () => {

        let items = [
            {
                "name": "A",
                "price": 1,
                "quantity": 5
            },
            {
                "name": "B",
                "price": 2,
                "quantity": 5
            },
            {
                "name": "C",
                "price": 3,
                "quantity": 1
            }];

        expect(parser.calcTotal(items)).toBe(18);
    });
});

describe("CartParser - integration tests", () => {
    // Add your integration tests here.

    it('Should return error of wrong header', () => {
        const path = "./samples/test.csv";
        expect(() => parser.parse(path)).toThrow();
    });
});