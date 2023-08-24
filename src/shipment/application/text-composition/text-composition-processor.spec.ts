import {TextCompositionProcessor} from "./text-composition-processor";
import {faker} from "@faker-js/faker";
import {TextCompositionResponse} from "./text-composition-response";

describe('TextCompositionProcessor', () => {
    let processor: TextCompositionProcessor;

    beforeEach(() => {
       processor = new TextCompositionProcessor();
    });

    it('should be defined', () => {
        const text = faker.lorem.sentence();
        const normalized = text.toLowerCase().replace(/[^a-z]/ig, "");

        const size = text.length;
        const vowels = (normalized.match(/[aeiou]/gi) ?? []).length;
        const consonants = (normalized.match(/(?![aeiou])[a-z]/gi) ?? []).length

        const expected: TextCompositionResponse = { size, vowels, consonants };
        const result = processor.execute(text);

        expect(result).toStrictEqual(expected);
    });
});