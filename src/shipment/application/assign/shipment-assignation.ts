import { TextCompositionProcessor, TextCompositionResponse } from "../text-composition";
import { isEven } from "@platform-science/common/utils";

interface DestinationDistribution {
    even: TextCompositionResponse[];
    odd: TextCompositionResponse[];
}

export class ShipmentAssignation {
    constructor(private readonly textCompositionProcessor: TextCompositionProcessor) {}

    execute(destinations: string[], drivers: string[]) {
        const cache = new Set<string>();
        const driverMapping = this.getDriverMapping(drivers);

        const { even, odd } = this.getDestinationDistribution(destinations);

        const suitableScore = this.calculateSuitableScore(even, odd, driverMapping, cache);

        return { suitableScore, mapping: this.getMapping(driverMapping) };
    }

    private getDriverMapping(drivers: string[]) {
        return drivers.reduce((result, driver) => {
            const driverComposition = this.textCompositionProcessor.execute(driver);
            result.set(driverComposition.value, driverComposition);

            return result;
        }, new Map<string, TextCompositionResponse>());
    }

    private getDestinationDistribution(destinations: string[]): DestinationDistribution {
        return destinations.reduce((result, destination) => {
            const composition = this.textCompositionProcessor.execute(destination);
            result[isEven(composition.size) ? 'even' : 'odd'].push(composition);
            return result;
        }, { even: [], odd: [] } as DestinationDistribution);
    }

    private calculateSuitableScore(even: TextCompositionResponse[], odd: TextCompositionResponse[], driverMapping: Map<string, TextCompositionResponse>, cache: Set<string>) {
        let suitableScore = 0;

        for (const destinationComposition of even) {
            suitableScore += this.calculateDestinationScore(destinationComposition, driverMapping, cache, driverComposition => driverComposition.vowels * 1.5);
        }

        for (const destinationComposition of odd) {
            suitableScore += this.calculateDestinationScore(destinationComposition, driverMapping, cache, driverComposition => driverComposition.consonants);
        }

        return suitableScore;
    }

    private calculateDestinationScore(destinationComposition: TextCompositionResponse, driverMapping: Map<string, TextCompositionResponse>, cache: Set<string>, baseScoreCalculator: (driverComposition: TextCompositionResponse) => number) {
        if (driverMapping.size === 0) {
            return 0;
        }

        let maxScore = -1;
        let selectedDriver: TextCompositionResponse | undefined = undefined;

        for (const [driverValue, driverComposition] of driverMapping) {
            if (cache.has(driverValue)) continue;

            const score = this.calculateScore(destinationComposition, driverComposition, baseScoreCalculator);

            if (score > maxScore) {
                maxScore = score;
                selectedDriver = driverComposition;
            }
        }

        if (selectedDriver) {
            cache.add(selectedDriver.value);
            driverMapping.delete(selectedDriver.value);
        }

        return maxScore;
    }

    private calculateScore(destination: TextCompositionResponse, driver: TextCompositionResponse, baseScoreCalculator: (driverComposition: TextCompositionResponse) => number): number {
        if (destination.size !== driver.size) {
            return baseScoreCalculator(driver);
        }

        if (destination.vowels === driver.vowels || destination.consonants === driver.consonants) {
            return baseScoreCalculator(driver) * 1.5;
        }

        return baseScoreCalculator(driver);
    }

    private getMapping(driverMapping: Map<string, TextCompositionResponse>): Record<string, string> {
        const mapping: Record<string, string> = {};
        driverMapping.forEach((driverComposition, driverValue) => {
            mapping[driverValue] = driverComposition.value;
        });
        return mapping;
    }
}
