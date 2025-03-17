export const contentCptCcodes = `
INSERT INTO cpt_codes (PK_cptcode, id, abbreviation, type, code, description, value, options)
VALUES
  ('CPT_3100F', 1, 'FCEXAM', 'CPT', '3100F', 'Fee Carotid Exam', NULL, NULL),
  ('CPT_49083', 2, 'ULTRASOUND GUIDANCE', 'CPT', '49083', 'Ultrasound Guidance', NULL, NULL),
  ('CPT_51798', 3, 'PVR', 'CPT', '51798', 'Pre/Post Void', NULL, NULL),
  ('CPT_76536', 4, 'THYROID', 'CPT', '76536', 'Thyroid', NULL, NULL),
  ('CPT_76604', 5, 'CHEST B SCAN', 'CPT', '76604', 'Chest B Scan', NULL, NULL),
  ('CPT_76641', 6, '', 'CPT', '76641', 'Breast', NULL, '{"type":"checkbox","values":[{"optionId":"76641BIL","abbreviation":"BILAT BREAST","label":"BIL"},{"optionId":"76641RT","abbreviation":"RT BREAST","label":"RT"},{"optionId":"76641LT","abbreviation":"LT BREAST","label":"LT"}]}'),
  ('CPT_76700', 7, 'ABD', 'CPT', '76700', 'Abdominal', NULL, NULL),
  ('CPT_7670A5', 8, 'GALLBLADDER', 'CPT', '76705', 'Limited Abdominal - Gallbladder', NULL, NULL),
  ('CPT_76706', 9, 'AAA SCREENING', 'CPT', '76706', 'AAA Screening', NULL, NULL),
  ('CPT_76770', 10, 'RENAL', 'CPT', '76770', 'Renal', NULL, NULL),
  ('CPT_76805', 11, 'OB', 'CPT', '76805', 'Complete OB', NULL, NULL),
  ('CPT_76810', 12, 'OB TWINS', 'CPT', '76810', 'Complete Mult/Gest OB', NULL, NULL),
  ('CPT_76817', 13, 'T.V. OB', 'CPT', '76817', 'OB Transvaginal', NULL, NULL),
  ('CPT_76830', 14, 'T.V.', 'CPT', '76830', 'Transvaginal', NULL, NULL),
  ('CPT_76856', 15, 'PELVIC', 'CPT', '76856', 'Pelvic', NULL, NULL),
  ('CPT_76857', 16, 'BLADDER', 'CPT', '76857', 'Ltd Pelvic (Bladder)', NULL, NULL),
  ('CPT_76870', 17, 'TESTICULAR', 'CPT', '76870', 'Testicular', NULL, NULL),
  ('CPT_76881', 18, 'SOFT TISSUE', 'CPT', '76881', 'Extremity/Soft Tissue non vascular', NULL, NULL),
  ('CPT_93224', 19, 'HOLTER', 'CPT', '93224', '24Hour Hotter Monitor', NULL, NULL),
  ('CPT_93306', 20, 'ECHO', 'CPT', '93306', '2D Echo, Doppler, color flow', NULL, NULL),
  ('CPT_93880', 21, 'CAROTID', 'CPT', '93880', 'Carotid Duplex Bilateral', NULL, NULL),
  ('CPT_93882', 22, '', 'CPT', '93882', 'Carotid Duplex Unilateral', NULL, '{"type":"checkbox","values":[{"optionId":"93882RT","abbreviation":"RT CAROTID","label":"RT"},{"optionId":"93882LT","abbreviation":"LT CAROTID","label":"LT"}]}'),
  ('CPT_93922', 23, 'ABIS', 'CPT', '93922', 'ABI''s (Ankle/Brachial Indices)', NULL, NULL),
  ('CPT_93923', 24, 'BULSP', 'CPT', '93923', 'Bilateral Upper/Lower Segmental Pressure', NULL, NULL),
  ('CPT_93925', 25, 'BLEA', 'CPT', '93925', 'Bilateral Lower Duplex Extremity Arterial', NULL, NULL),
  ('CPT_93926', 26, '', 'CPT', '93926', 'Unilateral Lower Extremity Arterial', NULL, '{"type":"checkbox","values":[{"optionId":"93926RT","abbreviation":"RLEA","label":"RT"},{"optionId":"93926LT","abbreviation":"LLEA","label":"LT"}]}'),
  ('CPT_93930', 27, 'BUEA', 'CPT', '93930', 'Bilateral Upper Duplex Extremity Arterial', NULL, NULL),
  ('CPT_93931', 28, '', 'CPT', '93931', 'Unilateral Upper Extremity Arterial', NULL, '{"type":"checkbox","values":[{"optionId":"93931RT","abbreviation":"RUEA","label":"RT"},{"optionId":"93931LT","abbreviation":"LUEA","label":"LT"}]}'),
  ('CPT_93970', 29, '', 'CPT', '93970', 'Bilateral Lower Extremity Venous', NULL, '{"type":"checkbox","values":[{"optionId":"93931RT","abbreviation":"BLEV","label":"+"},{"optionId":"93931LT","abbreviation":"BLEV","label":"-"}]}'),
  ('CPT_93970A', 30, '', 'CPT', '93970', 'Bilateral Upper Extremity Venous', NULL, '{"type":"checkbox","values":[{"optionId":"93970RT","abbreviation":"BUEV","label":"+"},{"optionId":"93970LT","abbreviation":"BUEV","label":"-"}]}'),
  ('CPT_93971', 31, '', 'CPT', '93971', 'Unilateral Lower Extremity Venous', NULL, '{"type":"checkbox","values":[{"optionId":"93971LRT","abbreviation":"RLEV","label":"RT"},{"optionId":"93971LLT","abbreviation":"LLEV","label":"LT"},{"optionId":"93971LPLUS","abbreviation":"","label":"+"},{"optionId":"93971LMINUS","abbreviation":"","label":"-"}]}'),
  ('CPT_93971A', 32, '', 'CPT', '93971', 'Unilateral Upper Extremity Venous', NULL, '{"type":"checkbox","values":[{"optionId":"93971URT","abbreviation":"RUEV","label":"RT"},{"optionId":"93971ULT","abbreviation":"LUEV","label":"LT"},{"optionId":"93971UPLUS","abbreviation":"","label":"+"},{"optionId":"93971UMINUS","abbreviation":"","label":"-"}]}'),
  ('CPT_93975', 33, 'ABD DOPPLER', 'CPT', '93975', 'Abdominal Doppler', NULL, NULL),
  ('CPT_93975A', 34, 'RENAL DOPPLER', 'CPT', '93975', 'Renal Doppler', NULL, NULL),
  ('CPT_93978', 35, 'AAA', 'CPT', '93978', 'Abdominal Aorta Duplex', NULL, NULL),
  ('TEXT_Unlist', 36, 'COPIES EXAM WRITTEN IN', 'TEXT', 'Unlisted', 'Procedure:', '', NULL),
  ('CPT_76705B', 38, 'LIVER', 'CPT', '76705', 'Limited Abdominal - Liver', NULL, NULL),
  ('CPT_76705C', 39, 'PANCREAS', 'CPT', '76705', 'Limited Abdominal - Pancreas', NULL, NULL),
  ('CPT_76705D', 39, 'SPLEEN', 'CPT', '76705', 'Limited Abdominal - Spleen', NULL, NULL),
  ('CPT_48083', 39, 'ULTRASOUND GUIDANCE', 'CPT', '48083', 'Ultrasound Guidance', NULL, NULL),
  ('CPT_76856A', 39, 'PROSTATE', 'CPT', '76856', 'Prostate', NULL, NULL);
`

export const contentCptCodeOptions = {
  contentCptCcodes
}