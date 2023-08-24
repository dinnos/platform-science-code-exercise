import {TextCompositionResponse} from "@platform-science/shipment/application/text-composition";

export interface DestinationDistribution {
    even: TextCompositionResponse[];
    odd: TextCompositionResponse[];
}