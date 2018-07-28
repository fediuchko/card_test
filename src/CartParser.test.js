import CartParser from './CartParser';
import { readFileSync } from 'fs';

let parser, parse, validate;

beforeEach(() => {
    parser = new CartParser();
    parse = parser.parse.bind(parser);
    validate = parser.validate.bind(parser);
});

describe("parse", () => {
    const path = "./samples/cart.csv";

    it('Should return JSON object be defined', () => {
        expect(parse(path)).toBeDefined()
    })

    it('Should return Json obj have not empty items property ', () => {
        expect(parse(path).items.length).toBeGreaterThanOrEqual(0)
    })
});

describe("validate", () => {
    const path = "./samples/cart.csv";
    const contents = readFileSync(path, 'utf-8', 'r');
    it('Should return array of errors is empty', () => {
        expect(validate(contents)).toHaveLength(0)
    });

    const path1 = "./samples/mocks/cart1.csv";
    const contents1 = readFileSync(path1, 'utf-8', 'r');
    it('should recive error - E-xpected cell to be a nonempty string but received- "" ', () => {
        expect(validate(contents1)[0].type).toEqual('cell')
    });

    const path2 = "./samples/mocks/cart2.csv";
    const contents2 = readFileSync(path2, 'utf-8', 'r');
    it('should recive error - Expected header to be named "Price" but received "". ', () => {
        expect(validate(contents2)[0].type).toEqual('header')
    });

    const path3 = "./samples/mocks/cart3.csv";
    const contents3 = readFileSync(path3, 'utf-8', 'r');
    it('should recive error - Expected header to be named "Price" but received "". ', () => {
        expect(validate(contents3)[0].type).toEqual('row')
    });

    const path4 = "./samples/mocks/cart4.csv";
    const contents4 = readFileSync(path4, 'utf-8', 'r');
    it('should recive error - Expected header to be named "Price" but received "". ', () => {
        expect(validate(contents4)[0].type).toEqual('cell')
    });
});

describe('parseLine', () => {
    const csvLine = 'Consectetur adipiscing,28.72,10';

    it('should return  object with keys from column keys and values from CSV.', () => {
        expect(parser.parseLine(csvLine)).toBeDefined()
    });

    it('should return  item[name] .', () => {
        expect(parser.parseLine(csvLine)['name']).toEqual("Consectetur adipiscing")
    });

    it('should return  item[price].', () => {
        expect(parser.parseLine(csvLine)['price']).toEqual(28.72)
    });
    it('should return  item[quantity].', () => {
        expect(parser.parseLine(csvLine)['quantity']).toEqual(10)
    });

});

