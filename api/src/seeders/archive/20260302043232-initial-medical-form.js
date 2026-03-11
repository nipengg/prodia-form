'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // 1. Insert Form
    await queryInterface.bulkInsert('form', [{
      id: 1,
      name: 'Asesmen Medis Lengkap',
      description: 'Formulir dengan tipe input lengkap, validation JSON, dan conditional logic',
      createdAt: now,
      updatedAt: now
    }]);

    await queryInterface.bulkInsert('form', [{
      id: 2,
      name: 'Form Pemeriksaan Fisik Dasar',
      description: 'Form Pemeriksaan Fisik Dasar',
      createdAt: now,
      updatedAt: now
    }]);

    await queryInterface.bulkInsert('section', [
      { id: 3, formId: 2, name: 'Form Pemeriksaan Fisik Dasar', order: 1 }
    ]);

    await queryInterface.bulkInsert('subsection', [
      { id: 3, sectionId: 3, name: 'Identitas Pasien', order: 1 },
    ]);

    // 2. Insert Sections
    await queryInterface.bulkInsert('section', [
      { id: 1, formId: 1, name: 'Informasi Umum', order: 1 },
      { id: 2, formId: 1, name: 'Riwayat Medis', order: 2 }
    ]);

    // 3. Insert SubSections
    await queryInterface.bulkInsert('subsection', [
      { id: 1, sectionId: 1, name: 'Data Vital', order: 1 },
      { id: 2, sectionId: 2, name: 'Alergi & Operasi', order: 2 },
    ]);

    // 4. Insert Options (Grup Pilihan)
    await queryInterface.bulkInsert('option', [
      { id: 1, optionName: 'Ya/Tidak', type: 'radio' },
      { id: 2, optionName: 'Golongan Darah', type: 'dropdown' },
      { id: 3, optionName: 'Frekuensi', type: 'radio' },
      { id: 4, optionName: 'Jenis Kelamin', type: 'radio' }
    ]);

    // 5. Insert Option Values
    await queryInterface.bulkInsert('option_value', [
      { optionId: 1, valueId: 'Ya', valueEn: 'Yes', order: 1 },
      { optionId: 1, valueId: 'Tidak', valueEn: 'No', order: 2 },
      { optionId: 2, valueId: 'A', valueEn: 'A', order: 1 },
      { optionId: 2, valueId: 'B', valueEn: 'B', order: 2 },
      { optionId: 2, valueId: 'AB', valueEn: 'AB', order: 3 },
      { optionId: 2, valueId: 'O', valueEn: 'O', order: 4 },
      { optionId: 3, valueId: 'Sering', valueEn: 'Frequent', order: 1 },
      { optionId: 3, valueId: 'Jarang', valueEn: 'Occasional', order: 2 },
      { optionId: 4, valueId: 'Laki-laki', valueEn: 'Laki-laki', order: 1 },
      { optionId: 4, valueId: 'Perempuan', valueEn: 'Perempuan', order: 2 },
    ]);

    // 6. Insert Fields (Termasuk kolom validation JSON)
    await queryInterface.bulkInsert('field', [
      {
        id: 1001, fieldType: 'date',
        labelId: 'Tanggal Kunjungan', labelEn: 'Visit Date',
        optionId: null, validation: null
      },
      {
        id: 1002, fieldType: 'dropdown',
        labelId: 'Golongan Darah', labelEn: 'Blood Type',
        optionId: 2, validation: null
      },
      {
        id: 1003, fieldType: 'number',
        labelId: 'Suhu Tubuh', labelEn: 'Body Temp',
        satuanId: '°C', satuanEn: '°C', optionId: null,
        validation: JSON.stringify({ min: 35, max: 42 })
      },
      {
        id: 1004, fieldType: 'radio',
        labelId: 'Ada Alergi Obat?', labelEn: 'Any Drug Allergy?',
        optionId: 1, validation: null, defaultValue: 'Tidak'
      },
      {
        id: 1005, fieldType: 'text',
        labelId: 'Sebutkan Nama Obat', labelEn: 'Specify Drug Name',
        optionId: null, validation: JSON.stringify({ minLength: 3 })
      },
      {
        id: 1006, fieldType: 'text',
        labelId: 'Keluhan Utama', labelEn: 'Chief Complaint',
        optionId: null, validation: null
      },
      {
        id: 1007, fieldType: 'radio',
        labelId: 'Apakah Pasien Merokok?', labelEn: 'Does the patient smoke?',
        optionId: 1, validation: null, defaultValue: 'Tidak'
      },
      {
        id: 1008, fieldType: 'radio',
        labelId: 'Frekuensi Merokok', labelEn: 'Smoking Frequency',
        optionId: 3,
        validation: null
      },
      {
        id: 1009, fieldType: 'text',
        labelId: 'No. Rekam Medis', labelEn: 'No. Rekam Medis',
        optionId: 3,
        validation: null
      },
    ]);

    // 7. Insert SubSectionField (Mapping Parent-Child & Order)
    await queryInterface.bulkInsert('subsection_field', [
      // Sub 1: Vital
      { subSectionId: 1, fieldId: 1001, order: 1, isRequired: true, parentId: null, triggerValue: null },
      { subSectionId: 1, fieldId: 1002, order: 2, isRequired: true, parentId: null, triggerValue: null },
      { subSectionId: 1, fieldId: 1003, order: 3, isRequired: false, parentId: null, triggerValue: null },

      // Sub 2: Alergi (Logic Conditional)
      { subSectionId: 2, fieldId: 1006, order: 1, isRequired: true, parentId: null, triggerValue: null },

      // PARENT: Ada Alergi?
      { subSectionId: 2, fieldId: 1004, order: 2, isRequired: true, parentId: null, triggerValue: null },

      // CHILD: Sebutkan Obat (Muncul cuma kalau 1004 dijawab 'Ya')
      { subSectionId: 2, fieldId: 1005, order: 3, isRequired: true, parentId: 1004, triggerValue: 'Ya' },

      { subSectionId: 2, fieldId: 1007, order: 4, isRequired: true, parentId: null, triggerValue: null },
      { subSectionId: 2, fieldId: 1008, order: 5, isRequired: true, parentId: 1007, triggerValue: 'Ya' }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    await queryInterface.bulkDelete('subsection_field', null, {});
    await queryInterface.bulkDelete('field', null, {});
    await queryInterface.bulkDelete('option_value', null, {});
    await queryInterface.bulkDelete('subsection', null, {});
    await queryInterface.bulkDelete('section', null, {});
    await queryInterface.bulkDelete('option', null, {});
    await queryInterface.bulkDelete('form', null, {});

    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  }
};