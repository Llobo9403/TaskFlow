import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'brlFormat'
})
export class BrlFormatPipe implements PipeTransform {

      transform(amount: number, type: string): { value: string, class: string } {
    const formatted = amount.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

    if ( type === 'transfer') {
      return {
        value: `- ${formatted}`,
        class: 'valor-negativo'
      };
    }

    return {
      value: `+ ${formatted}`,
      class: 'valor-positivo'
    };
  }
  
}
