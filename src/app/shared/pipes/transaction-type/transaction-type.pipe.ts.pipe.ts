import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transactionTypePipeTs'
})
export class TransactionTypePipeTsPipe implements PipeTransform {

  transform(value: string | null | undefined): string{
    if(!value) return '';

    const map: Record<string, string> = {
      'deposit': 'Depósito',
      'transfer': 'Transferência',
    }

    return map[value] || value;
  }

}
