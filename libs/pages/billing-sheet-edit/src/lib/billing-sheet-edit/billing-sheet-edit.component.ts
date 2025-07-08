import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProtectedRouteConstants } from '@mer-ui/common';
import { CptSelectDialogComponent } from '@mer-ui/form/cpt-select-dialog';
import { MerUIInputTextFieldComponent } from '@mer-ui/ui-input-text-field';
import { MerUiRadioGroupComponent } from '@mer-ui/ui-radio-group';
import { IpcMainService } from '@mer/services';
import { CPTCode, FacilitiesSchema } from '@mer/types';
import { HlmRadioGroupModule } from '@spartan-ng/ui-radiogroup-helm';
import {
  ACNumber,
  amountToBePaid,
  authorizationNumber,
  cash,
  checkNumber,
  consecutiveNumber,
  creditCard,
  dateOfService,
  facilityAddress,
  facilityCity,
  facilityLocationOption,
  facilityName,
  facilityState,
  facilityZipcode,
  faxNumber,
  groupNumber,
  identification,
  orderingPhysician,
  patientDOB,
  patientFirstName,
  patientLasttName,
  patientMedicareNumber,
  patientSex,
  primaryInsurance,
  primaryInsurancePolicyNumber,
  secondaryInsurance,
  secondaryInsurancePolicyNumber,
  sonographer,
  symptomsOrDiagnosis,
  withAdmitDate,
} from './billing-sheet-print.formDefinition';

@Component({
  selector: 'lib-mer-pages-billing-sheet-edit',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MerUIInputTextFieldComponent,
    MerUiRadioGroupComponent,
    HlmRadioGroupModule,
    CptSelectDialogComponent,
  ],
  providers: [IpcMainService],
  standalone: true,
  templateUrl: './billing-sheet-edit.component.html',
  styleUrl: './billing-sheet-edit.component.css',
})
export class MerPagesBillingSheetEditComponent implements OnInit {
  public readonly protectedRouteConstants = ProtectedRouteConstants;
  public readonly route = inject(ActivatedRoute);
  public readonly record = signal<any | null>(null);
  public readonly loading = signal(true);
  public readonly error = signal<string | null>(null);

  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);

  // Form fields
  public readonly consecutiveNumber = consecutiveNumber;
  public readonly ACNumber = ACNumber;
  public readonly sonographer = sonographer;
  public readonly faxNumber = faxNumber;
  public readonly dateOfService = dateOfService;
  public readonly amountToBePaid = amountToBePaid;
  public readonly checkNumber = checkNumber;
  public readonly cash = cash;
  public readonly creditCard = creditCard;
  public readonly facilityName = facilityName;
  public readonly facilityAddress = facilityAddress;
  public readonly facilityCity = facilityCity;
  public readonly facilityState = facilityState;
  public readonly facilityZipcode = facilityZipcode;
  public readonly withAdmitDate = withAdmitDate;
  public readonly identification = identification;
  public readonly patientMedicareNumber = patientMedicareNumber;
  public readonly patientFirstName = patientFirstName;
  public readonly patientLasttName = patientLasttName;
  public readonly patientDOB = patientDOB;
  public readonly primaryInsurance = primaryInsurance;
  public readonly primaryInsurancePolicyNumber = primaryInsurancePolicyNumber;
  public readonly secondaryInsurance = secondaryInsurance;
  public readonly secondaryInsurancePolicyNumber =
    secondaryInsurancePolicyNumber;
  public readonly authorizationNumber = authorizationNumber;
  public readonly groupNumber = groupNumber;
  public readonly orderingPhysician = orderingPhysician;
  public readonly symptomsOrDiagnosis = symptomsOrDiagnosis;
  public readonly patientSex = patientSex;
  public readonly facilityLocationOption = facilityLocationOption;
  // Component state
  public form: FormGroup;
  public formKey = '';
  public tecName = '';
  public acNumber = '';
  public readonly openCptDialog = signal(false);
  public readonly saveForm = signal(false);
  public readonly selectedCptCodes = signal<CPTCode[]>([]);
  public readonly cachedCptCodes = signal<any[]>([]);
  public readonly facilitySearchResults = signal<any[]>([]);
  public readonly identificationSearchResults = signal<any[]>([]);
  public readonly newConsecutiveNumber: WritableSignal<string> = signal('');
  public cptJSonValues: WritableSignal<
    {
      PK_cptcode: string;
      selectedOptions: string[];
    }[]
  > = signal([]);

  public readonly saveStateCptCodes: WritableSignal<{
    userCptOptions: {
      PK_cptcode: string;
      selectedOptions: string[];
    }[];
    usedCPTCodes: CPTCode[];
  }> = signal({
    userCptOptions: [],
    usedCPTCodes: [],
  });

  public ipcMainService = inject(IpcMainService);

  constructor() {
    this.form = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.prefillForm();
  }

  private async prefillForm(): Promise<void> {
    const formId = this.route.snapshot.params['billing_sheet_id'];
    console.log('formId', formId);
    const data = await this.ipcMainService.getFormById({ intakeId: formId });
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        this.form.patchValue({
          [key]: value,
        });
      });
    }

    if (data && typeof data === 'object' && 'cptText' in data) {
      const cptText = JSON.parse(data.cptText);
      console.log('cptText', cptText);
      this.saveStateCptCodes.set({
        userCptOptions: cptText.userCptOptions,
        usedCPTCodes: cptText.usedCPTCodes,
      });
      this.cptJSonValues.set(cptText.userCptOptions);
      this.selectedCptCodes.set(cptText.usedCPTCodes);

      //format the cpt codes
    }

    this.saveStateCptCodes().userCptOptions.forEach((item) => {
      const cptCode = item.PK_cptcode;
      const selectedOptions = item.selectedOptions;
      selectedOptions.forEach((option) => {
        const element = document.querySelector(
          `input[name="${cptCode}"][value="${option}"]`
        );
        if (element instanceof HTMLInputElement) {
          element.checked = true;
        }
      });
    });
  }

  public handleFacilitySelect(
    facility: FacilitiesSchema & { PK_facility: string }
  ): void {
    this.form.patchValue({
      facilityName: facility.facilityName,
      facilityAddress: facility.facilityAddress,
      facilityCity: facility.facilityCity,
      facilityState: facility.facilityState,
      facilityZipcode: facility.facilityZipcode,
    });
  }

  public handleIdentificationSelect(identificationId: string): void {
    console.log(identificationId);
  }

  public toggleOpenCptDialog(): void {
    this.openCptDialog.set(true);
  }

  public handleSubmit(event: Event): void {
    console.log('handleSubmit', this.form.value);
    console.log('form', event);
    event.preventDefault();
    if (this.form.valid) {
      this.updateRecord(this.form.value);
    }
  }

  public hasOptionValues(options: any): options is { values: any[] } {
    return options && Array.isArray(options.values);
  }

  public valueCptText(cptCode: CPTCode): string {
    const cptCodeObject = this.saveStateCptCodes().userCptOptions.find(
      (item) => item.PK_cptcode === cptCode.PK_cptcode
    );
    console.log('cptCodeObject', cptCodeObject);
    return cptCodeObject?.selectedOptions[0].toUpperCase() || '';
  }

  public handleCptCodesChange(cptCodes: any[]): void {
    //first get the selected cpt codes
    const selectedCptCodes = this.selectedCptCodes();

    // if an existing cpt code is not in the selected cpt codes, add it
    cptCodes.forEach((cpt) => {
      if (!selectedCptCodes.includes(cpt)) {
        selectedCptCodes.push(cpt);
      }
    });

    // otherwise remove cpt codes on selectedCptCodes that are not in the cptCodes array
    selectedCptCodes.forEach((cpt) => {
      if (!cptCodes.includes(cpt)) {
        selectedCptCodes.splice(selectedCptCodes.indexOf(cpt), 1);
      }
    });

    // finally update the selectedCptCodes signal
    this.selectedCptCodes.set(selectedCptCodes);

    // update the cptJSonValues signal with proper structure
    this.cptJSonValues.set(
      selectedCptCodes.map((cpt) => ({
        PK_cptcode: cpt.PK_cptcode,
        selectedOptions: cpt.type === 'TEXT' ? [cpt.description] : [],
      }))
    );

    // Actualiza el formulario con la estructura completa
    this.form.patchValue(
      {
        cptText: JSON.stringify({
          userCptOptions: this.cptJSonValues(),
          usedCPTCodes: selectedCptCodes,
        }),
      },
      {
        emitEvent: false,
      }
    );
  }

  public async updateRecord(record: any): Promise<void> {
    const extractedCptText = JSON.parse(record.cptText);
    const updatedCptText = {
      userCptOptions: this.cptJSonValues(),
      usedCPTCodes: this.selectedCptCodes(),
    };

    record.cptText = JSON.stringify(updatedCptText);

    const response = await this.ipcMainService.updateIntakeForm({
      intakeForm: record,
    });
    this.saveForm.set(true);
    // send signal to print the pdf othe new record
    if (response) {
      await this.ipcMainService.billingSheetPrint({
        PK_Intake: record.PK_Intake,
      });
    }
  }

  public handleCptCheckboxChange(event: Event, cptCode: CPTCode) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    const checked = target.checked;
    const keyCptCode = cptCode.PK_cptcode;

    // Obtén el estado actual
    const currentStateCpts = this.cptJSonValues();
    const currentSelectedCptCodes = this.selectedCptCodes();

    // Busca si ya existe el CPT code
    let cptEntry = currentStateCpts.find(
      (cpt) => cpt.PK_cptcode === keyCptCode
    );

    if (!cptEntry) {
      // Si no existe, lo creas
      cptEntry = { PK_cptcode: keyCptCode, selectedOptions: [] };
      currentStateCpts.push(cptEntry);
    }

    // Agrega o quita la opción según checked
    if (checked && cptEntry?.selectedOptions) {
      if (!cptEntry.selectedOptions.includes(value)) {
        cptEntry.selectedOptions.push(value);
      }
    } else {
      cptEntry.selectedOptions = cptEntry.selectedOptions.filter(
        (opt) => opt !== value
      );
    }
    // Actualiza el signal
    this.cptJSonValues.set([...currentStateCpts]);

    const updatedCptText = {
      userCptOptions: this.cptJSonValues(),
      usedCPTCodes: currentSelectedCptCodes,
    };

    this.form.patchValue(
      {
        cptText: JSON.stringify(updatedCptText),
      },
      {
        emitEvent: false,
      }
    );
    console.log('handleCptCheckboxChange', updatedCptText);
  }

  public handleCptTextChange(event: Event, cptCode: CPTCode) {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    const keyCptCode = cptCode.PK_cptcode;

    // Obtén el estado actual
    const currentStateCpts = this.cptJSonValues();
    const currentSelectedCptCodes = this.selectedCptCodes();

    // Busca si ya existe el CPT code
    let cptEntry = currentStateCpts.find(
      (cpt) => cpt.PK_cptcode === keyCptCode
    );

    if (!cptEntry) {
      // Si no existe, lo creas
      cptEntry = {
        PK_cptcode: keyCptCode,
        selectedOptions: cptCode.type === 'TEXT' ? [value.toUpperCase()] : [],
      };
      currentStateCpts.push(cptEntry);
    } else if (cptCode.type === 'TEXT') {
      cptEntry.selectedOptions = [value.toUpperCase()];
    }

    // Actualiza el signal de cptJSonValues
    this.cptJSonValues.set([...currentStateCpts]);

    // Actualiza el texto del CPT en el formulario
    const updatedCptText = {
      userCptOptions: this.cptJSonValues(),
      usedCPTCodes: currentSelectedCptCodes,
    };

    // Actualiza el formulario con la estructura completa
    this.form.patchValue(
      {
        cptText: JSON.stringify(updatedCptText),
      },
      {
        emitEvent: false,
      }
    );

    console.log('Updated CPT Text:', updatedCptText);
  }

  public facilityLabelFn(item: any): string {
    return `${item.facilityName} - ${item.facilityAddress}, ${item.facilityCity}, ${item.facilityState} ${item.facilityZipcode}`;
  }

  public identificationLabelFn(item: any): string {
    return `${item.patientFirstName} ${item.patientLasttName}`;
  }

  public verifyChecked(cptCode: CPTCode, option: string): boolean {
    const cptCodeObject = this.saveStateCptCodes().userCptOptions.find(
      (item) => item.PK_cptcode === cptCode.PK_cptcode
    );
    return cptCodeObject?.selectedOptions.includes(option) || false;
  }
}
