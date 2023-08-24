import { TextCompositionResponse } from "@platform-science/shipment/application/text-composition/text-composition-response";

export class TextCompositionProcessor {

    execute(str: string): TextCompositionResponse {
        const normalizeStr = this.normalizeString(str);

        const vowels = normalizeStr.match(/[aeiou]/ig)?.length ?? 0;
        const consonants = normalizeStr.length - vowels;

        return { size: str.length, consonants, vowels };
    }

    private normalizeString(str: string): string {
        return str.toLowerCase().replace(/[^a-z]/ig, "");
    }
}