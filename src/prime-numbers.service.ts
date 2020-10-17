export class PrimeNumbersService {
  async printPrimeNumbersBetweeenGivenNumbers(x1: number, x2: number) {

    let val = x1;
    let numbersToPrint: string[] = [];
    while (val < x2) {
      val++;
      if (this.isPrime(val)) {
        numbersToPrint.push(val.toString());
      } else {
        numbersToPrint.push(" ");
      }
      await this.pauseProgramAsync(10);
    }

    if (this.itsNewLine(val,x2)) {
      console.log(numbersToPrint.join(" | "));
      numbersToPrint = [];
    }


  }
  itsNewLine(val: number, x2: number): boolean {
    return true;
  }

  printRow(sz: string[]) {
    console.log(sz.join(" | "));

  }
  async pauseProgramAsync(seconds: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, seconds * 10);
    })
  }


  isPrime (n: number) {
      if ( n%1 || n<2 ) return false;

      const q = Math.sqrt(n);

      for (let i = 2; i <= q; i++)
      {
          if (n % i === 0)
          {
              return false;
          }
      }
      return true;
  }

}
