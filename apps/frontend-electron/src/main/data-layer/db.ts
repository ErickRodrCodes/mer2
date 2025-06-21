import { Database } from 'better-sqlite3';
import * as crypto from 'crypto';
import { LoggedUserInfo } from '../../types/lib/index';
import {
  CPTCode,
  FacilitiesSchema,
  IntakeFormSchema,
  PatientSchema,
  TechnicianSchema,
  ZCPTCode,
  ZFacilitiesSchema,
  ZIntakeFormSchema,
  ZPatientSchema,
  ZTechnicianSchema,
} from '../../types/zod/schemas';
import { tableCreationQueries } from '../data-layer/setup-queries';
import { logger } from '../logger';
import { dbConnector } from '../native/better-sqlite3';
import { contentCptCodeOptions } from './setup-cpt-codes';


export class DB {
  private db: Database;

  constructor() {
    this.db = dbConnector;
    this.initializeDatabase();
    this.closeConnectionOnAppErrorOrExit();
  }

  /**
   * @description This method listens for uncaught exceptions, unhandled rejections, and process exit signals. When any of these events occur, it closes the database connection.
   * @returns {void}
   */
  private closeConnectionOnAppErrorOrExit() {
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      // this.db.close();
    });

    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled Rejection:', reason);
      // this.db.close();
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT received. Closing database connection.');
      // this.db.close();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      logger.info('SIGTERM received. Closing database connection.');
      // this.db.close();
      process.exit(0);
    });

    process.on('SIGUSR2', () => {
      logger.info('SIGUSR2 received. Closing database connection.');
      // this.db.close();
      process.exit(0);
    });

    process.on('exit', () => {
      logger.info('Process exiting. Closing database connection.');
      // this.db.close();
    });
  }

  /**
   * @description This method initializes the database by creating the necessary tables if they do not exist.
   * @returns {void}
   */
  private async initializeDatabase() {
    const queries = Object.values(tableCreationQueries);
    const cptCodesQueries = Object.values(contentCptCodeOptions);
    logger.info('🔄 Initializing database...');

    // await this.dropIntakeFormTables();

    for (const query of queries) {
      this.db.exec(query);
    }

    const count_cpt_codes: any = this.db
      .prepare('SELECT COUNT(*) as count FROM cpt_codes')
      .get();
    console.log('count_cpt_codes', count_cpt_codes);
    if (count_cpt_codes.count === 0) {
      for (const query of cptCodesQueries) {
        this.db.exec(query);
      }
    }

    return true;
  }

  /**
   * A method that will list all the tables in the database
   * @returns {Promise<{ name: string }[]>} An array of objects with the table names
   */
  public listTables() {
    const query = `
      SELECT name
      FROM sqlite_master
      WHERE type = @type
    `;
    logger.info(query);
    const statement = this.db.prepare<{ type: string }, { name: string }>(
      query
    );
    const results = statement.all({ type: 'table' });
    return results;
  }

  /**
   * A method that will check if a technician code exists in the database
   * @param key The technician code to check
   * @returns {Promise<boolean>} Returns true if the technician code exists, false otherwise
   */
  public isTechnicianCodeInDB(key: string): Promise<boolean> {
    const query = `
      SELECT COUNT(*) as count
      FROM technicians
      WHERE PK_techicianId = @techID
    `;
    logger.info(query);
    const statement = this.db.prepare<{ techID: string }, { count: number }>(
      query
    );
    const result = statement.all({ techID: key });
    console.log('result isTechnicianCodeInDB', result);
    return Promise.resolve(result[0].count > 0);
  }

  /**
   * A method that will get the technician name by code
   * @param key The technician code to get the name of
   * @returns {Promise<TechnicianSchema>} Returns the technician name
   */
  public getTechnicianNameByCode(key: string) {
    const query = `
      SELECT technicianFirstName, technicianLastName
      FROM technicians
      WHERE PK_techicianId = @techID
    `;
    logger.info(query);
    const statement = this.db.prepare<
      { techID: string },
      {
        [key in keyof Omit<
          TechnicianSchema,
          'password' | 'PK_techicianId'
        >]: string;
      }
    >(query);
    const result = statement.all({ techID: key });
    return result;
  }

  /**
   * A method that will login a technician
   * @param technician The technician to login
   * @returns {Promise<boolean>} Returns true if the technician is logged in, false otherwise
   */
  public async loginTechnician(technician: {
    technicianCode: string;
    password: string;
  }): Promise<LoggedUserInfo> {
    const query = `
      SELECT *
      FROM technicians
      WHERE PK_techicianId = @technicianCode
        AND password = @password
    `;
    const statement = this.db.prepare<
      { technicianCode: string; password: string },
      TechnicianSchema
    >(query);
    const result = statement.all({
      technicianCode: technician.technicianCode.toUpperCase(),
      password: this.stringToSalt(technician.password),
    });
    if (result.length > 0) {
      const techInfo = this.getTechnicianNameByCode(
        technician.technicianCode
      )[0];
      return {
        technicianFirstName: techInfo.technicianFirstName,
        technicianLastName: techInfo.technicianLastName,
        technicianCode: technician.technicianCode,
        isLoggedIn: true,
      };
    }
    return {
      technicianFirstName: '',
      technicianLastName: '',
      technicianCode: '',
      isLoggedIn: false,
    };
  }

  /**
   * A private method that helps to salt a string that can either be used
   * or be saved in the schema as neeeded
   * @param str the string to salt
   * @returns a salted string
   */
  private stringToSalt(str: string) {
    return crypto.scryptSync(str, 'salt', 64).toString('hex');
  }

  /**
   * A method that adds a new technician to the database
   * @param technician An object with the data of the technician
   * @returns {boolean} Returns true if the technician was added successfully, false if the technician code already exists
   */
  public async addNewTechnician(technician: TechnicianSchema): Promise<any> {
    const newTechnician = ZTechnicianSchema.parse(technician);
    newTechnician.PK_techicianId = newTechnician.PK_techicianId.toUpperCase();
    newTechnician.password = this.stringToSalt(newTechnician.password);

    if (await this.isTechnicianCodeInDB(newTechnician.PK_techicianId)) {
      return null;
    }

    const query = `
      INSERT INTO technicians (
        PK_techicianId, technicianFirstName, technicianLastName, password
      )
      VALUES (
        @PK_techicianId, @technicianFirstName, @technicianLastName, @password
      )
    `;
    const statement = this.db.prepare<TechnicianSchema, void>(query);
    const result = statement.run(newTechnician);
    return Promise.resolve(result);
  }

  /**
   * A Method that gets the list of available CPT codes
   * @returns {Promise<CPTCode[]>}
   */
  public async getListCPTCodes() {
    const query = `
      SELECT *
      FROM cpt_codes
    `;
    // logger.info(query);
    const result: CPTCode[] = this.db.prepare<CPTCode, CPTCode>(query).all();

    return result.map((item: any) => {
      if (item.options) {
        item.options = JSON.parse(item.options);
      }
      return item;
    });
  }

  public async dropIntakeFormTables() {
    const query = `
      DROP TABLE IF EXISTS intake_form_cpt_codes;
      DROP TABLE IF EXISTS intake_form_facilities;
      DROP TABLE IF EXISTS intake_form_patient;
      DROP TABLE IF EXISTS patients;
      DROP TABLE IF EXISTS intake_forms;
    `;
    this.db.exec(query);
    return true;
  }

  /**
   * A Method that adds a new CPT code to the database
   * @param cptCode CPT code object to add
   * @returns {boolean} true if successful, false otherwise
   */
  public addNewCPTCode(cptCode: CPTCode): boolean {
    try {
      // Validate the CPT code using Zod schema
      const newCPTCode = ZCPTCode.parse(cptCode);

      const query = `
        INSERT INTO cpt_codes (
          PK_cptcode, id, abbreviation, type, code, description, value
        )
        VALUES (
          @PK_cptcode, @id, @abbreviation, @type, @code, @description, @value
        )
      `;

      // Use a more specific type for the database operation
      type CPTCodeDB = {
        PK_cptcode: string;
        id: number;
        abbreviation: string;
        type: string;
        code: string;
        description: string;
        value?: string;
      };

      const statement = this.db.prepare<CPTCodeDB, void>(query);
      statement.run(newCPTCode as unknown as CPTCodeDB);
      return true;
    } catch (error) {
      console.error('Error adding CPT code:', error);
      return false;
    }
  }

  /**
   * A Method that gets the list of a patient in the database by phone number
   * @param phoneNumber A unique identifier that allows to get the patient data without storing sensitive information.
   * @returns {PatientSchema[]} Array of matching patients
   */
  public getPatientByCombinedKey(phoneNumber: string) {
    const query = `
      SELECT *
      FROM patients
      WHERE PK_Patient = @phoneNumber
    `;
    logger.info(query);
    const statement = this.db.prepare<{ phoneNumber: string }, PatientSchema>(
      query
    );
    const results = statement.all({ phoneNumber });
    return results;
  }

  /**
   * Add a new patient to the database
   * @param patient Patient data to add
   * @returns {boolean} True if successful, false otherwise
   */
  public addNewPatient(patient: PatientSchema): boolean {
    try {
      const newPatient = ZPatientSchema.parse(patient);

      const query = `
        INSERT INTO patients (
          PK_Patient, firstName, lastName, dateOfBirth, sex, identification,
          address, city, state, zipcode, medicareNumber, primareInsurance,
          prinmaryInsurancePolicyNumber, secondaryInsurance, secondaryInsurancePolicyNumber,
          authorizationNumber, groupNumber
        )
        VALUES (
          @PK_Patient, @firstName, @lastName, @dateOfBirth, @sex, @identification,
          @address, @city, @state, @zipcode, @medicareNumber, @primareInsurance,
          @prinmaryInsurancePolicyNumber, @secondaryInsurance, @secondaryInsurancePolicyNumber,
          @authorizationNumber, @groupNumber
        )
      `;

      const statement = this.db.prepare<PatientSchema, void>(query);
      statement.run(newPatient);
      return true;
    } catch (error) {
      console.error('Error adding patient:', error);
      return false;
    }
  }

  /**
   * A Method that calulcates the consecutive billing sheet for a patient based on the current date and the technician that is working on the patient
   * @param techicianId the Id of the technician
   * @returns {string} the new PK for the intake form
   */
  public intakeFormObtainNewPK(techicianId: string): string {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

    const query = `
      SELECT COUNT(*) as count
      FROM intake_forms
      WHERE PK_Intake LIKE @pattern AND dateOfService = @date
    `;

    const statement = this.db.prepare<
      { pattern: string; date: string },
      { count: number }
    >(query);

    const result = statement.get({
      pattern: `${techicianId.toUpperCase()}_%`,
      date: today,
    });

    const count = result?.count || 0;

    return `${techicianId}_${today.replace(/-/g, '')}_${(count + 1)
      .toString()
      .padStart(3, '0')}`;
  }

  /**
   * A Method that adds a new intake form to the database
   * @param intakeForm The intake form to record
   * @returns {string} The PK of the created intake form
   */
  public recordIntakeForm(params: {
    intakeForm: IntakeFormSchema;
  }): string {
    try {
      const { intakeForm } = params;

      // Begin transaction for the intakeForm insertion
      const transaction = this.db.transaction(() => {
        // Check if facility exists and add if needed
        if (intakeForm.facilityName && intakeForm.facilityName.trim() !== '') {
          const findFacilityQuery = `
            SELECT COUNT(*) as count
            FROM facilities
            WHERE
              facilityName = @facilityName
              AND facilityAddress = @facilityAddress
              AND facilityCity = @facilityCity
              AND facilityState = @facilityState
              AND facilityZipcode = @facilityZipcode
          `;

          const findFacilityStatement = this.db.prepare<
            {
              facilityName: string;
              facilityAddress: string;
              facilityCity: string;
              facilityState: string;
              facilityZipcode: string;
            },
            { count: number }
          >(findFacilityQuery);

          const facilityResult = findFacilityStatement.get({
            facilityName: intakeForm.facilityName.trim(),
            facilityAddress: intakeForm.facilityAddress?.trim() || '',
            facilityCity: intakeForm.facilityCity?.trim() || '',
            facilityState: intakeForm.facilityState?.trim() || '',
            facilityZipcode: intakeForm.facilityZipcode?.trim() || '',
          });

          // Add facility if not exists
          if (facilityResult?.count === 0) {
            this.recordNewFacility({
              PK_facility: crypto.randomUUID(),
              facilityName: intakeForm.facilityName.toUpperCase().trim(),
              facilityAddress:
                intakeForm.facilityAddress?.toUpperCase().trim() || '',
              facilityCity: intakeForm.facilityCity?.toUpperCase().trim() || '',
              facilityState:
                intakeForm.facilityState?.toUpperCase().trim() || '',
              facilityZipcode:
                intakeForm.facilityZipcode?.toUpperCase().trim() || '',
            });
          }
        }

        // Insert the intake form
        const insertIntakeQuery = `
          INSERT INTO intake_forms (PK_Intake, acNumber, sonographer, faxNumber,
          dateOfService, amountToBePaid, checkNumber, cash, creditCard, facilityLocationType,
          facilityName, facilityAddress, facilityCity, facilityState, facilityZipcode,
          withAdmitDate, identification, patientMedicareNumber, patientFirstName,
          patientLasttName, patientDOB, patientSex, primaryInsurance,
          primaryInsurancePolicyNumber, secondaryInsurance, secondaryInsurancePolicyNumber,
          authorizationNumber, groupNumber, orderingPhysician,
          symptomsOrDiagnosis, cptText, created_at, updated_at)
          VALUES ( @PK_Intake, @acNumber, @sonographer, @faxNumber,
          @dateOfService, @amountToBePaid, @checkNumber, @cash, @creditCard, @facilityLocationType,
          @facilityName, @facilityAddress, @facilityCity, @facilityState, @facilityZipcode,
          @withAdmitDate, @identification, @patientMedicareNumber, @patientFirstName,
          @patientLasttName, @patientDOB, @patientSex, @primaryInsurance,
          @primaryInsurancePolicyNumber, @secondaryInsurance, @secondaryInsurancePolicyNumber,
          @authorizationNumber, @groupNumber, @orderingPhysician,
          @symptomsOrDiagnosis, @cptText, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
        `;

        const insertIntakeStatement = this.db.prepare<IntakeFormSchema, void>(
          insertIntakeQuery
        );
        insertIntakeStatement.run(intakeForm);

        return intakeForm.PK_Intake;
      });

      // Execute transaction
      transaction();

      return intakeForm.PK_Intake;
    } catch (error) {
      console.error('Error recording intake form:', error);
      return '';
    }
  }

  /**
   * Record a new facility in the database
   * @param facility Facility data to record
   * @returns {boolean} True if successful, false otherwise
   */
  public recordNewFacility(facility: {
    PK_facility: string;
    facilityName: string;
    facilityAddress: string;
    facilityCity: string;
    facilityState: string;
    facilityZipcode: string;
  }): boolean {
    try {
      // Extract the facility data that matches the FacilitiesSchema
      const facilityData: FacilitiesSchema = {
        facilityName: facility.facilityName,
        facilityAddress: facility.facilityAddress,
        facilityCity: facility.facilityCity,
        facilityState: facility.facilityState,
        facilityZipcode: facility.facilityZipcode,
      };

      // Validate the facility data
      const validatedFacility = ZFacilitiesSchema.parse(facilityData);

      const query = `
        INSERT INTO facilities (
          PK_facility, facilityName, facilityAddress, facilityCity,
          facilityState, facilityZipcode
        )
        VALUES (
          @PK_facility, @facilityName, @facilityAddress, @facilityCity,
          @facilityState, @facilityZipcode
        )
      `;

      // Create a complete facility object with the PK and validated data
      const completeRecord = {
        PK_facility: facility.PK_facility,
        ...validatedFacility,
      };

      const statement = this.db.prepare<typeof completeRecord, void>(query);
      statement.run(completeRecord);
      return true;
    } catch (error) {
      console.error('Error recording facility:', error);
      return false;
    }
  }

  /**
   * A method that will get the list of intakes made by a tecnician in a given date.
   * @param technicianId The ID of the technician
   * @param date The date to filter by (YYYY-MM-DD)
   * @returns Object with list of intakes and technician name
   */
  public getListsOfIntakesOfDay(params: {
    technicianId: string;
    date: string;
  }) {
    logger.log(this.getRightTodayDate());
    const { technicianId, date } = params;
    const sonographer = technicianId.toUpperCase();
    // Get intakes for technician and date
    const intakesQuery = `
      SELECT * FROM intake_forms
      WHERE sonographer = @sonographer AND dateOfService = @date
    `;

    // this.db.open()
    const intakesStatement = this.db.prepare<
      { sonographer: string; date: string },
      IntakeFormSchema
    >(intakesQuery);

    const intakes = intakesStatement.all({
      sonographer,
      date,
    });

    const listIntakes = intakes.map((intake: IntakeFormSchema) => {
      const {
        PK_Intake,
        acNumber,
        patientFirstName,
        patientLasttName,
        patientDOB,
        orderingPhysician,
        identification,
        facilityName,
        faxNumber,
        cptText,
      } = intake;

      // first extract the list of cpt codes from the cptText
      const textCpt: {
        userCptOptions: {
          PK_cptcode: string;
          selectedOptions: string[];
        }[];
        usedCPTCodes: CPTCode[];
      } = JSON.parse(cptText);

      const abbreviations = textCpt.usedCPTCodes.map((cpt: CPTCode) => {
        return cpt.abbreviation;
      });

      const cleanupAbbreviations = Array.from(
        new Set(abbreviations.filter(Boolean))
      ).join(', ');

      // Format the date
      const formattedDob = patientDOB
        ? patientDOB
        : '';

      return {
        PK_Intake,
        patientName: `${patientFirstName} ${patientLasttName}`,
        dob: formattedDob,
        dcNumber: identification,
        facility: facilityName,
        exam: cleanupAbbreviations,
        referringPhysician: orderingPhysician,
        acNumber: acNumber,
        faxNumber,
      };
    });

    // Get technician name
    const techData = this.getTechnicianNameByCode(technicianId);
    let techName = '';

    if (techData && techData.length > 0) {
      const technician = techData[0];
      techName = `${technician.technicianFirstName} ${technician.technicianLastName}`;
    }

    return { listIntakes, techName };
  }

  /**
   * Helper method to format dates
   * @param date Date to format
   * @param format Format string (MM-dd-yyyy)
   * @returns Formatted date string
   */
  private formatDate(date: Date, format: string): string {
    const pad = (n: number): string => (n < 10 ? `0${n}` : `${n}`);

    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const year = date.getFullYear();

    return format
      .replace('MM', month)
      .replace('dd', day)
      .replace('yyyy', year.toString());
  }

  public intakeFormObtainNewPK_Intake(): string {
    return crypto.randomUUID();
  }

  /**
   * Gets an intake form for PDF printing
   * @param intakeFormId The ID of the intake form
   * @returns The intake form object or false if not found
   */
  public getIntakeFormToPrintPDF(intakeFormId: string) {
    try {
      const query = `
        SELECT *
        FROM intake_forms
        WHERE PK_Intake = @formId
      `;
      const statement = this.db.prepare<{ formId: string }, IntakeFormSchema>(
        query
      );
      const intake = statement.get({ formId: intakeFormId });

      if (!intake) {
        return false;
      }

      // Get associated CPT codes
      const cptCodesQuery = `
        SELECT c.*
        FROM intake_form_cpt_codes ic
        JOIN cpt_codes c
          ON ic.cpt_code_id = c.PK_cptcode
        WHERE ic.intake_id = @intakeId
        ORDER BY ic.code_order
      `;

      const cptCodesStatement = this.db.prepare<{ intakeId: string }, CPTCode>(
        cptCodesQuery
      );
      const cptCodes = cptCodesStatement.all({ intakeId: intakeFormId });

      // Add CPT codes to the intake form result
      const result = {
        ...intake,
        CPTCodes: cptCodes.reduce((acc: Record<string, any>, code: any) => {
          const key = code.PK_cptcode;
          if (key) acc[key] = code;
          return acc;
        }, {}),
      };

      return result;
    } catch (error) {
      console.error('Error getting intake form for PDF:', error);
      return false;
    }
  }

  /**
   * Get facilities that match a search string
   * @param searchString Search string to look for in facility names
   * @returns Array of matching facilities
   */
  public getFacilitiesByString(searchString: string) {
    const query = `
      SELECT * FROM facilities
      WHERE facilityName LIKE @search
      ORDER BY facilityName
      LIMIT 5
    `;

    type FacilityReference = {
      PK_facility: string;
      facilityName: string;
      facilityAddress: string;
      facilityCity: string;
      facilityState: string;
      facilityZipcode: string;
      created_at: string;
      updated_at: string;
    };

    const statement = this.db.prepare<{ search: string }, FacilityReference>(
      query
    );
    const results = statement.all({ search: `%${searchString}%` });

    return results.length ? results : [];
  }

  /**
   * Get a form by its ID
   * @param params Object containing the intakeId
   * @returns The intake form or false if not found
   */
  public getFormById(params: { intakeId: string }) {
    try {
      const query = `
        SELECT *
        FROM intake_forms
        WHERE PK_Intake = @intakeId
      `;

      const statement = this.db.prepare<{ intakeId: string }, IntakeFormSchema>(
        query
      );
      const intake = statement.get({ intakeId: params.intakeId });

      if (!intake) {
        return false;
      }

      return intake;
    } catch (error) {
      console.error('Error getting form by ID:', error);
      return false;
    }
  }

  /**
   * Update an existing intake form
   * @param intakeForm The intake form with updated data
   * @returns {boolean} True if successful, false otherwise
   */
  public updateIntakeForm(params: {
    intakeForm: IntakeFormSchema;
  }): boolean {
    const { intakeForm } = params;
    try {
      // Validate the intake form
      const validatedForm = ZIntakeFormSchema.parse(intakeForm);

      // Begin transaction for the update
      const transaction = this.db.transaction(() => {
        // Check if facility exists and add if needed
        if (intakeForm.facilityName && intakeForm.facilityName.trim() !== '') {
          const findFacilityQuery = `
              SELECT COUNT(*) as count
              FROM facilities
              WHERE
                facilityName = @facilityName
                AND facilityAddress = @facilityAddress
                AND facilityCity = @facilityCity
                AND facilityState = @facilityState
                AND facilityZipcode = @facilityZipcode
            `;

          const findFacilityStatement = this.db.prepare<
            {
              facilityName: string;
              facilityAddress: string;
              facilityCity: string;
              facilityState: string;
              facilityZipcode: string;
            },
            { count: number }
          >(findFacilityQuery);

          const facilityResult = findFacilityStatement.get({
            facilityName: intakeForm.facilityName.trim(),
            facilityAddress: intakeForm.facilityAddress?.trim() || '',
            facilityCity: intakeForm.facilityCity?.trim() || '',
            facilityState: intakeForm.facilityState?.trim() || '',
            facilityZipcode: intakeForm.facilityZipcode?.trim() || '',
          });

          // Add facility if not exists
          if (facilityResult?.count === 0) {
            this.recordNewFacility({
              PK_facility: crypto.randomUUID(),
              facilityName: intakeForm.facilityName.toUpperCase().trim(),
              facilityAddress:
                intakeForm.facilityAddress?.toUpperCase().trim() || '',
              facilityCity: intakeForm.facilityCity?.toUpperCase().trim() || '',
              facilityState:
                intakeForm.facilityState?.toUpperCase().trim() || '',
              facilityZipcode:
                intakeForm.facilityZipcode?.toUpperCase().trim() || '',
            });
          }
        }

        // Update the intake form
        const updateQuery = `
          UPDATE intake_forms
          SET acNumber=@acNumber,
            sonographer=@sonographer,
            faxNumber=@faxNumber,
            dateOfService=@dateOfService,
            amountToBePaid=@amountToBePaid,
            checkNumber=@checkNumber,
            cash=@cash,
            creditCard=@creditCard,
            facilityLocationType=@facilityLocationType,
            facilityName=@facilityName,
            facilityAddress=@facilityAddress,
            facilityCity=@facilityCity,
            facilityState=@facilityState,
            facilityZipcode=@facilityZipcode,
            withAdmitDate=@withAdmitDate,
            identification=@identification,
            patientMedicareNumber=@patientMedicareNumber,
            patientFirstName=@patientFirstName,
            patientLasttName=@patientLasttName,
            patientDOB=@patientDOB,
            patientSex=@patientSex,
            primaryInsurance=@primaryInsurance,
            primaryInsurancePolicyNumber=@primaryInsurancePolicyNumber,
            secondaryInsurance=@secondaryInsurance,
            secondaryInsurancePolicyNumber=@secondaryInsurancePolicyNumber,
            authorizationNumber=@authorizationNumber,
            groupNumber=@groupNumber,
            orderingPhysician=@orderingPhysician,
            symptomsOrDiagnosis=@symptomsOrDiagnosis,
            cptText=@cptText,
            updated_at=CURRENT_TIMESTAMP
          WHERE PK_Intake=@PK_Intake;
        `;

        const updateStatement = this.db.prepare<
          IntakeFormSchema,
          { changes: number }
        >(updateQuery);
        const updateResult = updateStatement.run(validatedForm);

        if (updateResult.changes === 0) {
          throw new Error('No intake form found with the given ID');
        }

        return updateResult.changes > 0;
      });

      // Execute transaction
      transaction();

      return true;
    } catch (error) {
      console.error('Error updating intake form:', error);
      return false;
    }
  }

  public getRightTodayDate() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.getTime();
  }
}
