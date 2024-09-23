import {Cache} from "../src/cache";

describe('базовый функционал', () => {

    it('Если значения по ключу нет или если число обращений равно 0, то кэш возвращает null', () => {
        const k = "k";
        let c = new Cache();

        let cachedV = c.get(k);

        expect(cachedV).toBe(null);
    });

    it('обработка одного k/v', () => {
        const k = "k";
        const v = "v";
        let c = new Cache();

        c.set(k, v);

        let cachedV = c.get(k);
        expect(cachedV).toBe(v);
    });
    
    it('обработка нескольких k/v', () => {
        const k1 = "k1";
        const k2 = "k2";
        const v1 = "v1";
        const v2 = "v2";
        let c = new Cache();

        c.set(k1, v1);
        c.set(k2, v2);

        expect(c.get(k1)).toBe(v1);
        expect(c.get(k2)).toBe(v2);
    });
    
    it('Если данные изменились, нужно их перезаписать', () => {
        const k = "k";
        const v1 = "v1";
        const v2 = "v2";
        let c = new Cache();

        c.set(k, v1);
        c.set(k, v2);

        expect(c.get(k)).toBe(v2);
    });

});

describe("тестирование числа обращений", () => {
    it('Если пара k-v задана без указания числа обращений, то число обращений равно 1', () => {
        const k = "k";
        const v = "v";
        let c = new Cache();

        c.set(k, v);

        c.get(k);
        expect(c.get(k)).toBe(null);
    });

    it ('При перезаписи v число обращений должно быть корректным', () => {
        const k = "k";
        const v = "v";
        let c = new Cache();

        c.set(k, v, 2);
        c.get(k);
        c.get(k);
        c.get(k);

        c.set(k, v);
        expect(c.get(k)).toBe(v);
        expect(c.get(k)).toBe(null);
    });
    
    it('После каждого обращения нужно уменьшить число обращений на 1 до тех пор пока не станет null', () => {
        const k = "k";
        const v = "v";
        const numberOfQueries = 2;
        let c = new Cache();

        c.set(k, v, numberOfQueries);
        
        c.get(k);
        c.get(k);
        
        const cachedV = c.get(k);
        expect(cachedV).toBe(null);
    });


});

describe('статистика', () => {
    it('Если запросов нет, то возвращаем пустой список', () => {
        let c = new Cache();

        const statistics = c.statistics();
        expect(statistics).toEqual([]);
    });

    it('Статистика для одного запроса', () => {
        const k = "k";
        const v = "v";
        const numberOfQueries = 3;
        let c = new Cache();

        c.set(k, v, numberOfQueries);
        c.get(k);

        const statistics = c.statistics();
        expect(statistics).toEqual([`set ${k}, ${v}, ${numberOfQueries}`, 
                                    `get ${k} ${numberOfQueries - 1}`]);
    });

    it('Статистика для нескольких запросов', () => {
        const k1 = "k1";
        const v1 = "v1";
        const numberOfQueries = 2;
        let c = new Cache();

        c.set(k1, v1, numberOfQueries);
        c.get(k1);
        c.get(k1);

        const statistics = c.statistics();
        expect(statistics).toEqual([`set ${k1}, ${v1}, ${numberOfQueries}`, 
                                    `get ${k1} ${numberOfQueries - 1}`, 
                                    `get ${k1} 0`]);
    });

    it('Если такого k не было, то его не нужно отображать в статистике', () => {
        const k1 = "k";
        const k2 = "invalid k";
        const v = "v";
        let c = new Cache();

        c.set(k1, v);
        c.get(k1);
        c.get(k2);
        const statistics = c.statistics();
        expect(statistics).toEqual([`set ${k1}, ${v}, 1`,
                                    `get ${k1} 0`]);
    })


});