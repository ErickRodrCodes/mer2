import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProtectedRouteConstants } from '@mer-ui/common';
import { CptSelectDialogComponent } from '@mer-ui/form/cpt-select-dialog';
import { MerUIInputTextFieldComponent } from '@mer-ui/ui-input-text-field';
import { MerUIInputTypeaheadFieldComponent } from '@mer-ui/ui-input-typeahead-field';
import { MerUiRadioGroupComponent } from '@mer-ui/ui-radio-group';
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
} from './billing-sheet-create.formDefinition';

import { IpcMainService, SessionService } from '@mer/services';
import { CPTCode, FacilitiesSchema } from '@mer/types';

@Component({
  selector: 'lib-mer-pages-billing-sheet-create',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MerUIInputTextFieldComponent,
    MerUiRadioGroupComponent,
    MerUIInputTypeaheadFieldComponent,
    CptSelectDialogComponent,
    HlmRadioGroupModule,
  ],
  providers: [IpcMainService],
  templateUrl: './billing-sheet-create.component.html',
  styleUrl: './billing-sheet-create.component.css',
})
export class MerPagesBillingSheetCreateComponent implements OnInit {
  public readonly protectedRouteConstants = ProtectedRouteConstants;
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);
  private readonly sessionService = inject(SessionService);
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
    effect(() => {
      this.saveStateCptCodes.set({
        userCptOptions: this.cptJSonValues(),
        usedCPTCodes: this.selectedCptCodes(),
      });

      console.log('saveStateCptCodes effect', this.saveStateCptCodes());
    });
  }

  ngOnInit(): void {
    this.prefillInitialValues();
  }

  private async prefillInitialValues(): Promise<void> {
    const code = this.sessionService.userSessionData().technicianCode;
    const getConsecutiveNumber =
      await this.ipcMainService.intakeFormObtainNewPK(code);
    const PK_IntakeValue =
      await this.ipcMainService.intakeFormObtainNewPK_Intake();
    this.newConsecutiveNumber.set(getConsecutiveNumber);
    this.form.patchValue(
      {
        acNumber: getConsecutiveNumber,
        PK_Intake: PK_IntakeValue,
        sonographer: `${
          this.sessionService.userSessionData().technicianFirstName
        } ${this.sessionService.userSessionData().technicianLastName}`,
        dateOfService: new Date().toISOString().split('T')[0],
      },
      {
        emitEvent: false,
      }
    );
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

  public handleCptCodesChange(cptCodes: any[]): void {
    //first get the selected cpt codes
    const selectedCptCodes = this.selectedCptCodes().sort((a, b) => {
      // First sort by type
      if (a.type !== b.type) {
        return a.type.localeCompare(b.type);
      }
      // Then sort by code
      return a.code.localeCompare(b.code);
    });

    // if an existing cpt code is not in the selected cpt codes, add it
    cptCodes
      .sort((a, b) => {
        // First sort by type
        if (a.type !== b.type) {
          return a.type.localeCompare(b.type);
        }
        // Then sort by code
        return a.code.localeCompare(b.code);
      })
      .forEach((cpt) => {
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

    // update the cptJSonValues signal
    this.cptJSonValues.set(
      selectedCptCodes.map((cpt) => ({
        PK_cptcode: cpt.PK_cptcode,
        selectedOptions: [],
      }))
    );
  }

  public async handleFacilityCurrentValue(value: string): Promise<void> {
    console.log('handleFacilityCurrentValue', value);
    const facility = await this.ipcMainService.getFacilitiesByString(value);
    this.facilitySearchResults.set(facility);
    console.log('facility', facility);
  }

  public async handleIdentificationCurrentValue(value: string): Promise<void> {
    console.log('handleIdentificationValue', value);
    const identification = await this.ipcMainService.getPatientByCombinedKey(
      value
    );
    this.identificationSearchResults.set(identification);
    console.log('identification', identification);
  }

  public async printDocument(): Promise<void> {
    // TODO: Define PrinterPdfAPI type in electron pre-render
    await this.ipcMainService.billingSheetPrint({
      PK_Intake: this.form.value.PK_Intake,
    });
  }

  public handleSubmit(event: Event): void {
    console.log('handleSubmit', this.form.value);
    console.log('form', event);
    event.preventDefault();

    if (this.form.valid) {
      this.recordForm(this.form.value);
    }
  }

  public hasOptionValues(options: any): options is { values: any[] } {
    return options && Array.isArray(options.values);
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

  public async recordForm(record: any): Promise<void> {
    //if for some reason the cptText arrives empty or in a default state, we have to patchi it back again,
    // it is a bug that has to be fixed at some point...
    const updatedCptText = {
      userCptOptions: this.cptJSonValues(),
      usedCPTCodes: this.selectedCptCodes(),
    };

      record.cptText = JSON.stringify(updatedCptText);


    console.log('recordForm', record);
    const response = await this.ipcMainService.recordIntakeForm({
      intakeForm: record,
    });
    this.saveForm.set(true);
    // send signal to print the pdf othe new record
    this.printDocument();
  }

  public facilityLabelFn(item: any): string {
    return `${item.facilityName} - ${item.facilityAddress}, ${item.facilityCity}, ${item.facilityState} ${item.facilityZipcode}`;
  }

  public identificationLabelFn(item: any): string {
    return `${item.patientFirstName} ${item.patientLasttName}`;
  }
}
