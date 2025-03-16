import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  inject,
  OnInit,
  signal,
  WritableSignal
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
  withAdmitDate
} from './billing-sheet-create.formDefinition';

import { SessionService } from '@mer/services';
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
  public cptJSonValues: WritableSignal<{
    PK_cptcode: string;
    selectedOptions: string[];
  }[]> = signal([]);

  public readonly saveStateCptCodes: WritableSignal<{
    userCptOptions: {
      PK_cptcode: string;
      selectedOptions: string[];
    }[],
    usedCPTCodes:CPTCode[]
  }> = signal({
    userCptOptions: [],
    usedCPTCodes: [],
  })



  public readonly testRecord = {

      "PK_Intake": "ERICK001_20250603_003",
      "acNumber": "ERICK001_20250603_003",
      "sonographer": "ERICK RODRIGUEZ",
      "faxNumber": "",
      "dateOfService": "2025-06-03",
      "amountToBePaid": "100",
      "checkNumber": "",
      "cash": "100",
      "creditCard": "",
      "facilityLocationType": "Prison/Jail",
      "facilityName": "TEST1",
      "facilityAddress": "T1",
      "facilityCity": "T1",
      "facilityState": "T1",
      "facilityZipcode": "12345",
      "withAdmitDate": "2001-01-01",
      "identification": "",
      "patientMedicareNumber": "1",
      "patientFirstName": "1",
      "patientLasttName": "1",
      "patientDOB": "2000-01-01",
      "patientSex": "Other",
      "primaryInsurance": "1",
      "primaryInsurancePolicyNumber": "1",
      "secondaryInsurance": "1",
      "secondaryInsurancePolicyNumber": "1",
      "authorizationNumber": "1",
      "groupNumber": "1",
      "orderingPhysician": "1",
      "symptomsOrDiagnosis": "1",
      "cptText": "{\"userCptOptions\":[{\"PK_cptcode\":\"CPT_76770\",\"selectedOptions\":[]},{\"PK_cptcode\":\"CPT_93882\",\"selectedOptions\":[]},{\"PK_cptcode\":\"CPT_93971A\",\"selectedOptions\":[\"LT\",\"+\"]}],\"usedCPTCodes\":[{\"PK_cptcode\":\"CPT_76770\",\"id\":10,\"abbreviation\":\"RENAL\",\"type\":\"CPT\",\"code\":\"76770\",\"description\":\"Renal\",\"value\":null,\"options\":null,\"created_at\":\"2025-05-23 18:27:05\",\"updated_at\":\"2025-05-23 18:27:05\"},{\"PK_cptcode\":\"CPT_93882\",\"id\":22,\"abbreviation\":\"\",\"type\":\"CPT\",\"code\":\"93882\",\"description\":\"Carotid Duplex Unilateral\",\"value\":null,\"options\":{\"type\":\"checkbox\",\"values\":[{\"optionId\":\"93882RT\",\"abbreviation\":\"RT CAROTID\",\"label\":\"RT\"},{\"optionId\":\"93882LT\",\"abbreviation\":\"LT CAROTID\",\"label\":\"LT\"}]},\"created_at\":\"2025-05-23 18:27:05\",\"updated_at\":\"2025-05-23 18:27:05\"},{\"PK_cptcode\":\"CPT_93971A\",\"id\":32,\"abbreviation\":\"\",\"type\":\"CPT\",\"code\":\"93971\",\"description\":\"Unilateral Upper Extremity Venous\",\"value\":null,\"options\":{\"type\":\"checkbox\",\"values\":[{\"optionId\":\"93971URT\",\"abbreviation\":\"RUEV\",\"label\":\"RT\"},{\"optionId\":\"93971ULT\",\"abbreviation\":\"LUEV\",\"label\":\"LT\"},{\"optionId\":\"93971UPLUS\",\"abbreviation\":\"\",\"label\":\"+\"},{\"optionId\":\"93971UMINUS\",\"abbreviation\":\"\",\"label\":\"-\"}]},\"created_at\":\"2025-05-23 18:27:05\",\"updated_at\":\"2025-05-23 18:27:05\"}]}"

}


  constructor() {
    this.form = this.formBuilder.group({});
    effect(() => {
      this.saveStateCptCodes.set({
        userCptOptions: this.cptJSonValues(),
        usedCPTCodes: this.selectedCptCodes(),
      });

      console.log('saveStateCptCodes effect', this.saveStateCptCodes());
    });

    // this.recordForm(this.testRecord);

  }

  ngOnInit(): void {


    this.prefillInitialValues();
  }

  private async prefillInitialValues(): Promise<void> {
    const code = this.sessionService.userSessionData().technicianCode;
    const getConsecutiveNumber =
      await window.MedicalRecordAPI.intakeFormObtainNewPK(code);
    this.newConsecutiveNumber.set(getConsecutiveNumber);
    this.form.patchValue({
      acNumber: getConsecutiveNumber,
      PK_Intake: getConsecutiveNumber,
      sonographer: `${this.sessionService.userSessionData().technicianFirstName} ${this.sessionService.userSessionData().technicianLastName}`,
      dateOfService: new Date().toISOString().split('T')[0],
    },{
      emitEvent: false,
    });
  }

  public handleFacilitySelect(facility: FacilitiesSchema & {PK_facility: string}): void {
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
    .forEach(cpt => {
      if (!selectedCptCodes.includes(cpt)) {
        selectedCptCodes.push(cpt);
      }
    });

    // otherwise remove cpt codes on selectedCptCodes that are not in the cptCodes array
    selectedCptCodes.forEach(cpt => {
      if (!cptCodes.includes(cpt)) {
        selectedCptCodes.splice(selectedCptCodes.indexOf(cpt), 1);
      }
    });

    // finally update the selectedCptCodes signal
    this.selectedCptCodes.set(selectedCptCodes);

    // update the cptJSonValues signal
    this.cptJSonValues.set(selectedCptCodes.map(cpt => ({
      PK_cptcode: cpt.PK_cptcode,
      selectedOptions: [],
    })));
  }

  public async handleFacilityCurrentValue(value: string): Promise<void> {
    console.log('handleFacilityCurrentValue', value);
    const facility = await window.MedicalRecordAPI.getFacilitiesByString(value);
    this.facilitySearchResults.set(facility);
    console.log('facility', facility);
  }

  public async handleIdentificationCurrentValue(value: string): Promise<void> {
    console.log('handleIdentificationValue', value);
    const identification = await window.MedicalRecordAPI.getPatientByCombinedKey(value);
    this.identificationSearchResults.set(identification);
    console.log('identification', identification);
  }

  public async printDocument(): Promise<void> {
    // TODO: Define PrinterPdfAPI type in electron pre-render
    await window.PrinterPdfAPI.billingSheetPrint({PK_Intake: this.form.value.PK_Intake});
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
    let cptEntry = currentStateCpts.find(cpt => cpt.PK_cptcode === keyCptCode);

    if (!cptEntry) {
      // Si no existe, lo creas
      cptEntry = {
        PK_cptcode: keyCptCode,
        selectedOptions: cptCode.type === 'TEXT' ? [value.toUpperCase()] : []
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
      usedCPTCodes: currentSelectedCptCodes
    };

    // Actualiza el formulario con la estructura completa
    this.form.patchValue({
      cptText: JSON.stringify(updatedCptText)
    }, {
      emitEvent: false,
    });

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
    let cptEntry = currentStateCpts.find(cpt => cpt.PK_cptcode === keyCptCode);

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
      cptEntry.selectedOptions = cptEntry.selectedOptions.filter(opt => opt !== value);
    }
    // Actualiza el signal
    this.cptJSonValues.set([...currentStateCpts]);

    const updatedCptText = {
      userCptOptions: this.cptJSonValues(),
      usedCPTCodes: currentSelectedCptCodes
    };

    this.form.patchValue({
      cptText: JSON.stringify(updatedCptText),
    }, {
      emitEvent: false,
    });
    console.log('handleCptCheckboxChange', updatedCptText);
  }

  public async recordForm(record: any): Promise<void> {
    console.log('recordForm', record);
    const response = await window.MedicalRecordAPI.recordIntakeForm({intakeForm: record});
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
