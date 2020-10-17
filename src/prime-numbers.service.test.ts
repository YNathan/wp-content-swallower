import { expect } from 'chai';
import { DownloadWebsiteContent } from './download-websie-content.service';
import { PrimeNumbersService } from './prime-numbers.service';

describe('some test - unit', () => {
   const primeNumbersService: PrimeNumbersService = new PrimeNumbersService();
   const hack: DownloadWebsiteContent = new DownloadWebsiteContent();

   it('check prime numbers', async () => {
      await primeNumbersService.printPrimeNumbersBetweeenGivenNumbers(1, 80);
   });

   it('hack keyhut', async () => {
      const a = await hack.downloadFileFromUrl("https://kayhut.com/wp-content/uploads/");

      expect(a).to(({} as any));

   });



});

