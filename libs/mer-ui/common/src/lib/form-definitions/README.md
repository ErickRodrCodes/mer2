# Billing Sheet Form Definitions

This directory contains common form definitions for billing sheet forms that can be shared across different components (create, edit, print).

## Files

- `billing-sheet.formDefinition.ts` - Base form field definitions
- `billing-sheet.helpers.ts` - Helper functions to create context-specific form definitions
- `README.md` - This documentation file

## Usage

### Importing Common Definitions

```typescript
// Import individual field definitions
import { ACNumber, sonographer, facilityName, facilityLocationOption, patientSex } from '@mer-ui/common';

// Import helper functions for context-specific definitions
import { createBillingSheetFormDefinition, createEditBillingSheetFormDefinition, createPrintBillingSheetFormDefinition } from '@mer-ui/common';
```

### Using Context-Specific Helpers

```typescript
// For CREATE context (editable ACNumber)
import { createBillingSheetFormDefinition } from '@mer-ui/common';

export const {
  consecutiveNumber,
  ACNumber, // readonly: false
  sonographer,
  // ... all other fields
} = createBillingSheetFormDefinition();

// For EDIT context (editable ACNumber)
import { createEditBillingSheetFormDefinition } from '@mer-ui/common';

export const {
  consecutiveNumber,
  ACNumber, // readonly: false
  sonographer,
  // ... all other fields
} = createEditBillingSheetFormDefinition();

// For PRINT context (readonly ACNumber)
import { createPrintBillingSheetFormDefinition } from '@mer-ui/common';

export const {
  consecutiveNumber,
  ACNumber, // readonly: true
  sonographer,
  // ... all other fields
} = createPrintBillingSheetFormDefinition();
```

### Customizing Individual Fields

```typescript
import { ACNumber, createReadonlyACNumber, createEditableACNumber } from '@mer-ui/common';

// Create a readonly version
const readonlyACNumber = createReadonlyACNumber();

// Create an editable version
const editableACNumber = createEditableACNumber();

// Customize a field manually
const customACNumber = InputTextFields.TEXT({
  ...ACNumber,
  readonly: true,
  label: 'Custom Account Number',
});
```

## Benefits

1. **DRY Principle**: No code duplication across components
2. **Consistency**: All form fields have the same validation rules and configuration
3. **Maintainability**: Changes to form definitions only need to be made in one place
4. **Type Safety**: TypeScript ensures consistency across all usages
5. **Flexibility**: Helper functions allow for context-specific customization

## Field Types

### Text Fields

- `consecutiveNumber` - Hidden field for internal ID
- `ACNumber` - Account number
- `sonographer` - Sonographer name
- `faxNumber` - Fax number with pattern validation
- `facilityName`, `facilityAddress`, `facilityCity`, `facilityState`, `facilityZipcode`
- `patientFirstName`, `patientLasttName`
- `primaryInsurance`, `secondaryInsurance`
- `orderingPhysician`, `symptomsOrDiagnosis`

### Date Fields

- `dateOfService` - Date of service
- `withAdmitDate` - Patient admission date
- `patientDOB` - Patient date of birth

### Number Fields

- `amountToBePaid` - Amount to be paid
- `cash` - Cash amount

### Radio Groups

- `facilityLocationOption` - Type of facility (ALF, Hospital, Home, etc.)
- `patientSex` - Patient sex (Male, Female, Other)

## Validation Rules

All required fields include validation messages with emoji indicators:

- ⚠️ for required field errors
- Pattern validation for fax numbers and zipcodes
- Minimum value validation for amounts

## Future Enhancements

- CPT code selection components
- List components with options
- CPT text form components
