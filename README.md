# Shipment Assignment Application

This repository contains a TypeScript solution for the Shipment Assignment Code Exercise. The application assigns shipment destinations to drivers while maximizing the total suitability score (SS) based on the provided algorithm.

## Algorithm

The algorithm to determine the suitability score (SS) for assigning a shipment to a driver is as follows:

- If the length of the shipment's destination street name is even, the base SS is the number of vowels in the driver’s name multiplied by 1.5.
- If the length of the shipment's destination street name is odd, the base SS is the number of consonants in the driver’s name multiplied by 1.
- If the length of the shipment's destination street name shares any common factors (besides 1) with the length of the driver’s name, the SS is increased by 50% above the base SS.

## Project Structure

The project is structured as follows:

```
src/
├── common/
│   ├── index.ts
│   ├── utils/
│   │   ├── index.ts
│   │   └── is-even.ts
├── shipment/
│   ├── application/
│   │   ├── index.ts
│   │   ├── assign/
│   │   │   ├── destination-distribution.ts
│   │   │   ├── index.ts
│   │   │   └── shipment-assigner.ts
│   │   ├── text-composition/
│   │   │   ├── index.ts
│   │   │   ├── text-composition-processor.ts
│   │   │   └── text-composition-response.ts
│   ├── index.ts
```

## Main Classes

### ShipmentAssigner

This class is responsible for assigning drivers to destinations based on suitable scores. It contains methods to execute the assignment process, create driver mappings, categorize destinations, calculate suitable scores, and calculate destination scores.

### TextCompositionProcessor

This class processes and analyzes text compositions. It contains a method to execute the analysis of an input string, calculating information about its composition. It also includes a private method to normalize input strings by converting them to lowercase and removing non-letter characters.

## Requirements

- Node.js ^20
- [pnpm](https://pnpm.io/) - Package manager for installing dependencies

## Setup

To set up the project, follow these steps:

1. Clone this repository to your local machine.
2. Install the required dependencies by running `pnpm install`.

## Running the Solution

After setting up the project, you can run the application using the provided scripts in the `package.json` file. Open your terminal and navigate to the project directory.

To build the TypeScript code, run:

```bash
pnpm run build
```

To execute the application and provide the required input files, run:

```bash
pnpm start
```

Assumptions:
- The destinations file and drivers file have the same quantity of lines.

The application's entry point is `src/index.ts`, which handles the input and execution of the solution. It reads the paths to the destinations and drivers files interactively, processes the input, calculates the suitable assignments, and outputs the result.
