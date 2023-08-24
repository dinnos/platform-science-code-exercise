import 'tslib';

import { createInterface } from 'node:readline/promises';
import process from "node:process";
import Reader from 'n-readlines';
import {ShipmentAssigner, TextCompositionProcessor} from "./shipment/application";

const cin = createInterface({ input: process.stdin, output: process.stdout });

const getFileLines = (file: string) => {
   const result: string[] = [];
   const reader = new Reader(file);

   let line;
   while (line = reader.next()) {
      result.push(line.toString());
   }

   return result;
};

(async () => {
   const destinationsFile = await cin.question('');
   const driversFile = await cin.question('');

   try {
      const destinations = getFileLines(destinationsFile);
      const files = getFileLines(driversFile);

      const processor = new TextCompositionProcessor();
      const assigner = new ShipmentAssigner(processor);

      const result = assigner.execute(destinations, files);

      console.log(result);

      cin.close();

      process.exit();
   } catch (error) {
      console.log((error as Error)?.message);

      process.exit(1);
   }
})();

