import { TextCompositionResponse } from "./text-composition-response";

/**
 * Class for processing and analyzing text compositions.
 */
export class TextCompositionProcessor {

    /**
     * Analyzes the given input string to calculate information about its composition.
     *
     * @param str - The input string to be analyzed.
     * @returns A TextCompositionResponse object containing information about the text composition.
     */
    execute(str: string): TextCompositionResponse {
        const normalizeStr = this.normalizeString(str);

        const vowels = normalizeStr.match(/[aeiou]/ig)?.length ?? 0;
        const consonants = normalizeStr.length - vowels;

        return { value: str, size: str.length, consonants, vowels };
    }

    /**
     * Normalizes the input string by converting to lowercase and removing non-letter characters.
     *
     * @param str - The input string to be normalized.
     * @returns The normalized string.
     * @private
     */
    private normalizeString(str: string): string {
        return str.toLowerCase().replace(/[^a-z]/ig, "");
    }
}