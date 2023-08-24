import {TextCompositionProcessor, TextCompositionResponse} from "../text-composition";
import {isEven} from "@platform-science/common/utils";
import {DestinationDistribution} from "@platform-science/shipment/application/assign/destination-distribution";

/**
 * Class responsible for assigning drivers to destinations based on suitable scores.
 */
export class ShipmentAssignation {
    /**
     * Creates an instance of ShipmentAssignation.
     * @param textCompositionProcessor - An instance of TextCompositionProcessor for processing text compositions.
     */
    constructor(private readonly textCompositionProcessor: TextCompositionProcessor) {}

    /**
     * Executes the assignment process to find optimal assignments for drivers and destinations.
     * @param destinations - An array of destination strings.
     * @param drivers - An array of driver strings.
     * @returns An object containing suitableScore and mapping of drivers to destinations.
     */
    execute(destinations: string[], drivers: string[]) {
        const cache = new Set<string>();
        const mapping = new Map<string, string>()
        const driverMapping = this.getDriverMapping(drivers);

        const { even, odd } = this.getDestinationDistribution(destinations);

        const suitableScore = this.calculateSuitableScore(even, odd, driverMapping, cache, mapping);

        return { suitableScore, mapping };
    }

    /**
     * Creates a mapping of drivers to their composition objects.
     * @param drivers - An array of driver strings.
     * @returns A Map containing driver compositions indexed by driver values.
     */
    private getDriverMapping(drivers: string[]) {
        return drivers.reduce((result, driver) => {
            const driverComposition = this.textCompositionProcessor.execute(driver);
            result.set(driverComposition.value, driverComposition);

            return result;
        }, new Map<string, TextCompositionResponse>());
    }

    /**
     * Categorizes destination compositions as even or odd based on their size.
     * @param destinations - An array of destination strings.
     * @returns An object with even and odd arrays of destination compositions.
     */
    private getDestinationDistribution(destinations: string[]): DestinationDistribution {
        return destinations.reduce((result, destination) => {
            const composition = this.textCompositionProcessor.execute(destination);
            result[isEven(composition.size) ? 'even' : 'odd'].push(composition);
            return result;
        }, { even: [], odd: [] } as DestinationDistribution);
    }

    /**
     * Calculates the total suitable score based on the even and odd destination compositions.
     * @param even - An array of destination compositions with even sizes.
     * @param odd - An array of destination compositions with odd sizes.
     * @param driverMapping - A mapping of driver compositions.
     * @param cache - A Set to track used drivers.
     * @param mapping - A mapping of driver values to their corresponding destinations.
     * @returns The calculated total suitable score.
     */
    private calculateSuitableScore(even: TextCompositionResponse[], odd: TextCompositionResponse[], driverMapping: Map<string, TextCompositionResponse>, cache: Set<string>, mapping: Map<string, string>) {
        let suitableScore = 0;

        for (const destinationComposition of even) {
            suitableScore += this.calculateDestinationScore(destinationComposition, driverMapping, cache, driverComposition => driverComposition.vowels * 1.5, mapping);
        }

        for (const destinationComposition of odd) {
            suitableScore += this.calculateDestinationScore(destinationComposition, driverMapping, cache, driverComposition => driverComposition.consonants, mapping);
        }

        return suitableScore;
    }

    /**
     * Calculates the suitable score for a specific destination composition based on available drivers.
     * @param destinationComposition - The composition of the destination.
     * @param driverMapping - A mapping of driver compositions.
     * @param cache - A Set to track used drivers.
     * @param baseScoreCalculator - A function to calculate the base score for a driver composition.
     * @param mapping - A mapping of driver values to their corresponding destinations.
     * @returns The calculated suitable score for the destination.
     */
    private calculateDestinationScore(destinationComposition: TextCompositionResponse, driverMapping: Map<string, TextCompositionResponse>, cache: Set<string>, baseScoreCalculator: (driverComposition: TextCompositionResponse) => number, mapping: Map<string, string>) {
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
            mapping.set(selectedDriver.value, destinationComposition.value)

        }

        return maxScore;
    }

    /**
     * Calculates the score for a driver-destination pair based on composition attributes.
     * @param destination - The composition of the destination.
     * @param driver - The composition of the driver.
     * @param baseScoreCalculator - A function to calculate the base score for a driver composition.
     * @returns The calculated score.
     */
    private calculateScore(destination: TextCompositionResponse, driver: TextCompositionResponse, baseScoreCalculator: (driverComposition: TextCompositionResponse) => number): number {
        if (destination.size !== driver.size) {
            return baseScoreCalculator(driver);
        }

        if (destination.vowels === driver.vowels || destination.consonants === driver.consonants) {
            return baseScoreCalculator(driver) * 1.5;
        }

        return baseScoreCalculator(driver);
    }
}
