import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { CPTCode } from '@mer/types';
import { IpcMainService } from '@mer/services';
import { debounceTime, fromEvent, map } from 'rxjs';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mer-cpt-select-dialog',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './cpt-select-dialog.component.html',
  styleUrl: './cpt-select-dialog.component.css',
})
export class CptSelectDialogComponent implements OnInit {
  public readonly searchTerm = signal('');
  public readonly displayItem = signal(true);
  public readonly filteredCptCodes = signal<CPTCode[]>([]);
  public readonly _selectedCptCodes = signal<CPTCode[]>([]);
  public readonly cptCodes = signal<CPTCode[]>([]);

  public readonly openCptSelectDialog = input.required<boolean>();
  public readonly initialSelectedCptCodes = input<CPTCode[]>([]);
  public readonly selectedCptCodes = output<CPTCode[]>();
  public readonly closed = output<void>();

  public readonly searchRef =
    viewChild.required<ElementRef<HTMLInputElement>>('searchRef');
  public readonly dialog =
    viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  public ipcMainService = inject(IpcMainService);

  constructor() {
    effect(() => {
      if (this.openCptSelectDialog()) {
        this._selectedCptCodes.set([...this.initialSelectedCptCodes()]);
        this.openModal();
        setTimeout(() => {
          this.searchRef().nativeElement.focus();
        }, 100);
      }
    });

    effect(() => {
      let filteredCptCodes = this.cptCodes().filter(
        (cptCode) =>
          cptCode.PK_cptcode.toUpperCase().includes(
            this.searchTerm().toUpperCase()
          ) ||
          cptCode.description
            .toUpperCase()
            .includes(this.searchTerm().toUpperCase()) ||
          this._selectedCptCodes()
            .map((cptCode) => cptCode.PK_cptcode)
            .includes(cptCode.PK_cptcode)
      );
      // do not show on filtered codes any selected cpt codes
      filteredCptCodes = filteredCptCodes.filter(
        (cptCode) =>
          !this._selectedCptCodes()
            .map((cptCode) => cptCode.PK_cptcode)
            .includes(cptCode.PK_cptcode)
      );
      this.searchTerm.set(this.searchTerm());
      this.filteredCptCodes.set(filteredCptCodes);
    });

    effect(() => {
      this.filteredCptCodes.set(this.cptCodes());
    });
  }

  ngOnInit(): void {
    this.loadCptCodes();
    this.setFilter();
  }

  public setFilter() {
    const inputElement = this.searchRef().nativeElement;
    if (inputElement) {
      fromEvent<Event>(inputElement, 'keyup')
        .pipe(
          debounceTime<Event>(300),
          map((event) => (event.target as HTMLInputElement).value)
          // distinctUntilChanged()
        )
        .subscribe((text: string) => {
          const filteredCptCodes = this.cptCodes().filter(
            (cptCode) =>
              cptCode.PK_cptcode.toUpperCase().includes(text.toUpperCase()) ||
              cptCode.description.toUpperCase().includes(text.toUpperCase())
          );
          this.searchTerm.set(text);
          this.filteredCptCodes.set(filteredCptCodes);
        });
    }
  }

  public async loadCptCodes() {
    const codes = await this.ipcMainService.getListCPTCodes();

    this.cptCodes.set(codes);
  }

  public closeModal() {
    this.dialog().nativeElement.close();
    this.selectedCptCodes.emit(this._selectedCptCodes());
    this.closed.emit();
  }

  public onEscCloseModal() {
    this.dialog().nativeElement.close();
    this.closed.emit();
  }

  public openModal() {
    this.dialog().nativeElement.showModal();
  }

  public handleSearchChange(event: Event) {
    // const value = (event.target as HTMLInputElement).value;
    // this.searchTerm.set(value);
  }
  public onSelectedCptCode(selectedCptCode: any) {
    this._selectedCptCodes.set([...this._selectedCptCodes(), selectedCptCode]);
  }
  public onRemoveCptCode(selectedCptCode: any) {
    this._selectedCptCodes.set(
      this._selectedCptCodes().filter(
        (cptCode) => cptCode.PK_cptcode !== selectedCptCode.PK_cptcode
      )
    );
  }

  public createNewCptCode() {
    console.log('Create new CPT code');
  }
}
