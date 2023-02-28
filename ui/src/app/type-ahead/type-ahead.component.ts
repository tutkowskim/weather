import { Component, EventEmitter, Input, Output } from '@angular/core';
import { get as levenshtein } from 'fast-levenshtein';

export interface TypeAheadValue {
  displayValue: string;
  value: any;
}

@Component({
  selector: 'type-ahead',
  templateUrl: './type-ahead.component.html',
  styleUrls: ['./type-ahead.component.css']
})
export class TypeAheadComponent {
  @Input() public placeholder: string = '';
  @Input() public values: TypeAheadValue[] = [];
  @Output() public click: EventEmitter<TypeAheadValue> = new EventEmitter<TypeAheadValue>();
  public searchTerm: string = '';

  public filteredValues(): TypeAheadValue[] {
    return this.values
      .sort((a,b) => levenshtein(a.displayValue, this.searchTerm) - levenshtein(b.displayValue, this.searchTerm))
      .slice(0, 5);
  }

  public onClick(value: TypeAheadValue): void {
    this.click.next(value);
    this.searchTerm = '';
  }
}
