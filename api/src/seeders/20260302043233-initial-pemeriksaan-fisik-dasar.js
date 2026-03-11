'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // 1. Insert Form
    await queryInterface.bulkInsert('form', [{
      id: 1,
      name: 'Form Pemeriksaan Fisik Dasar',
      description: 'Formulir standar untuk pemeriksaan fisik dasar pasien.',
      createdAt: now, updatedAt: now
    }]);

    // 2. Insert Section
    await queryInterface.bulkInsert('section', [
      { id: 1, formId: 1, name: 'Identitas Pasien & Instansi', order: 1 },
      { id: 2, formId: 1, name: 'Pemeriksaan', order: 2 },
    ]);

    // 3. Insert Subsections
    await queryInterface.bulkInsert('subsection', [
      { id: 1, sectionId: 1, name: 'Identitas Pasien', order: 1 },
      { id: 2, sectionId: 1, name: 'Identitas Perusahaan Pasien', order: 2 },
      { id: 3, sectionId: 2, name: 'Tanda Vital', order: 1 },
      { id: 4, sectionId: 2, name: 'Status Gizi', order: 2 },
      { id: 5, sectionId: 2, name: 'Dada', order: 3 }
    ]);

    // 4. PENTING: Insert Option DULU sebelum Field
    await queryInterface.bulkInsert('option', [
      { id: 1, optionName: 'Jenis Kelamin', type: 'radio' },
      { id: 2, optionName: 'Isi', type: 'radio' },
      { id: 3, optionName: 'Irama', type: 'radio' },
      { id: 4, optionName: 'Bentuk Badan', type: 'radio' },
      { id: 5, optionName: 'Bentuk', type: 'radio' },
      { id: 6, optionName: 'Payudara', type: 'radio' }
    ]);

    // 5. Insert Option Values
    await queryInterface.bulkInsert('option_value', [
      { optionId: 1, valueId: 'Laki-laki', valueEn: 'Male', order: 1 },
      { optionId: 1, valueId: 'Perempuan', valueEn: 'Female', order: 2 },
      { optionId: 2, valueId: 'Cukup', valueEn: 'Cukup', order: 1 },
      { optionId: 2, valueId: 'Lemah', valueEn: 'Lemah', order: 2 },
      { optionId: 2, valueId: 'Kuat', valueEn: 'Kuat', order: 3 },
      { optionId: 3, valueId: 'Teratur', valueEn: 'Teratur', order: 1 },
      { optionId: 3, valueId: 'Tidak Teratur', valueEn: 'Tidak Teratur', order: 2 },
      { optionId: 4, valueId: 'Atletikus (Normal)', valueEn: 'Atletikus (Normal)', order: 1 },
      { optionId: 4, valueId: 'Astenikus (Kurus)', valueEn: 'Astenikus (Kurus)', order: 2 },
      { optionId: 4, valueId: 'Piknikus (Gemuk)', valueEn: 'Piknikus (Gemuk)', order: 3 },
      { optionId: 5, valueId: 'Simetris', valueEn: 'Simetris', order: 1 },
      { optionId: 5, valueId: 'Asimetris', valueEn: 'Asimetris', order: 2 },
      { optionId: 6, valueId: 'Normal', valueEn: 'Normal', order: 1 },
      { optionId: 6, valueId: 'Tidak Normal', valueEn: 'Tidak Normal', order: 2 },
    ]);

    // 6. Insert Fields (Sekarang optionId: 1 sudah aman karena sudah di-insert di atas)
    await queryInterface.bulkInsert('field', [
      { id: 101, fieldType: 'text', labelId: 'No. Rekam Medis', labelEn: 'Medical Record No.', optionId: null, validation: null },
      { id: 102, fieldType: 'text', labelId: 'No. Registrasi', labelEn: 'Registration No.', optionId: null, validation: null },
      { id: 103, fieldType: 'text', labelId: 'Nama Lengkap', labelEn: 'Full Name', optionId: null, validation: null },
      { id: 104, fieldType: 'date', labelId: 'Tanggal Lahir', labelEn: 'Date of Birth', optionId: null, validation: null },
      { id: 105, fieldType: 'number', labelId: 'Usia', labelEn: 'Age', satuanId: 'tahun', satuanEn: 'year', optionId: null, validation: null },
      { id: 106, fieldType: 'radio', labelId: 'Jenis Kelamin', labelEn: 'Gender', optionId: 1, validation: null, defaultValue: null },

      { id: 107, fieldType: 'text', labelId: 'Nama Perusahaan/Institusi', labelEn: 'Company Name', optionId: null, validation: null },
      { id: 108, fieldType: 'text', labelId: 'Alamat Perusahaan/Institusi', labelEn: 'Company Address', optionId: null, validation: null },
      { id: 109, fieldType: 'text', labelId: 'Department/Bagian', labelEn: 'Department', optionId: null, validation: null },
      { id: 110, fieldType: 'text', labelId: 'Posisi', labelEn: 'Position', optionId: null, validation: null },
      { id: 111, fieldType: 'text', labelId: 'Nomor Induk Karyawan', labelEn: 'Employee ID', optionId: null, validation: null },
      { id: 112, fieldType: 'number', labelId: 'Masa Kerja', labelEn: 'Length of Service', satuanId: 'tahun', satuanEn: 'year', optionId: null, validation: null },

      // Tanda Vital Nadi
      { id: 113, fieldType: 'number', labelId: 'Nadi', labelEn: 'Nadi', satuanId: 'x/menit', satuanEn: 'x/minute', optionId: null, validation: null },
      { id: 114, fieldType: 'radio', labelId: 'Isi', labelEn: 'Isi', optionId: 2, validation: null },
      { id: 115, fieldType: 'radio', labelId: 'Irama', labelEn: 'Irama', optionId: 3, validation: null },
      { id: 116, fieldType: 'number', labelId: 'Tekanan Darah (duduk)', labelEn: 'Tekanan Darah (duduk)', satuanId: 'mmHg', satuanEn: 'mmHg', optionId: null, validation: null },
      { id: 117, fieldType: 'number', labelId: 'Suhu Tubuh', labelEn: 'Suhu Tubuh', satuanId: '°C', satuanEn: '°C', optionId: null, validation: null },
      { id: 118, fieldType: 'text', labelId: 'Lain-lain', labelEn: 'Lain-lain', optionId: null, validation: null },

      // Tanda Vital Pernafasan
      { id: 119, fieldType: 'number', labelId: 'Pernafasan', labelEn: 'Pernafasan', satuanId: 'x/menit', satuanEn: 'x/minute', optionId: null, validation: null },
      { id: 120, fieldType: 'radio', labelId: 'Irama', labelEn: 'Irama', optionId: 3, validation: null },

      { id: 121, fieldType: 'number', labelId: 'Tinggi Badan', labelEn: 'Tinggi Badan', satuanId: 'cm', satuanEn: 'cm', optionId: null, validation: null },
      { id: 122, fieldType: 'number', labelId: 'Berat Badan', labelEn: 'Berat Badan', satuanId: 'kg', satuanEn: 'kg', optionId: null, validation: null },
      { id: 123, fieldType: 'number', labelId: 'IMT', labelEn: 'IMT', satuanId: 'Kg/m²', satuanEn: 'Kg/m²', optionId: null, validation: null },
      { id: 124, fieldType: 'number', labelId: 'Lingkar perut', labelEn: 'Lingkar perut', satuanId: 'cm', satuanEn: 'cm', optionId: null, validation: null },
      { id: 125, fieldType: 'radio', labelId: 'Bentuk Badan', labelEn: 'Bentuk Badan', optionId: 4, validation: null },

      { id: 126, fieldType: 'radio', labelId: 'Bentuk', labelEn: 'Bentuk', optionId: 5, validation: null },
      { id: 127, fieldType: 'radio', labelId: 'Payudara', labelEn: 'Payudara', optionId: 6, defaultValue: "Tidak Normal", validation: null },
      { id: 128, fieldType: 'text', labelId: 'Sebutkan Tidak Normal', labelEn: 'Sebutkan Tidak Normal', optionId: null, validation: null },
      { id: 129, fieldType: 'text', labelId: 'Ukuran', labelEn: 'Ukuran', optionId: null, validation: null },
      { id: 130, fieldType: 'text', labelId: 'Letak', labelEn: 'Letak', optionId: null, validation: null },
      { id: 131, fieldType: 'text', labelId: 'Konsistensi', labelEn: 'Konsistensi', optionId: null, validation: null },
    ]);

    // 7. Mapping
    await queryInterface.bulkInsert('subsection_field', [
      { subSectionId: 1, fieldId: 101, order: 1, isRequired: true, parentId: null, triggerValue: null },
      { subSectionId: 1, fieldId: 102, order: 2, isRequired: true, parentId: null, triggerValue: null },
      { subSectionId: 1, fieldId: 103, order: 3, isRequired: true, parentId: null, triggerValue: null },
      { subSectionId: 1, fieldId: 104, order: 4, isRequired: true, parentId: null, triggerValue: null },
      { subSectionId: 1, fieldId: 105, order: 5, isRequired: true, parentId: null, triggerValue: null },
      { subSectionId: 1, fieldId: 106, order: 6, isRequired: true, parentId: null, triggerValue: null },
      { subSectionId: 2, fieldId: 107, order: 1, isRequired: true, parentId: null, triggerValue: null },
      { subSectionId: 2, fieldId: 108, order: 2, isRequired: true, parentId: null, triggerValue: null },
      { subSectionId: 2, fieldId: 109, order: 3, isRequired: true, parentId: null, triggerValue: null },
      { subSectionId: 2, fieldId: 110, order: 4, isRequired: true, parentId: null, triggerValue: null },
      { subSectionId: 2, fieldId: 111, order: 5, isRequired: true, parentId: null, triggerValue: null },
      { subSectionId: 2, fieldId: 112, order: 6, isRequired: true, parentId: null, triggerValue: null },

      // Tanda Vital
      { subSectionId: 3, groupLabel: "a.", fieldId: 113, order: 1, isRequired: true, parentId: null, triggerValue: null },
      { subSectionId: 3, fieldId: 114, order: 2, isRequired: true, parentId: 113, triggerValue: null },
      { subSectionId: 3, fieldId: 115, order: 3, isRequired: true, parentId: 113, triggerValue: null },
      { subSectionId: 3, groupLabel: "b.", fieldId: 116, order: 4, isRequired: true, parentId: null, triggerValue: null },
      { subSectionId: 3, groupLabel: "c.", fieldId: 117, order: 5, isRequired: true, parentId: null, triggerValue: null },
      { subSectionId: 3, groupLabel: "d.", fieldId: 119, order: 6, isRequired: true, parentId: null, triggerValue: null },
      { subSectionId: 3, fieldId: 120, order: 7, isRequired: true, parentId: 119, triggerValue: null },
      { subSectionId: 3, groupLabel: "e.", fieldId: 118, order: 8, isRequired: false, parentId: null, triggerValue: null },

      { subSectionId: 4, groupLabel: "a.", fieldId: 121, order: 1, isRequired: true, parentId: null, triggerValue: null },
      { subSectionId: 4, groupLabel: "a.", fieldId: 122, order: 2, isRequired: true, parentId: null, triggerValue: null },
      { subSectionId: 4, groupLabel: "a.", fieldId: 123, order: 3, isRequired: true, parentId: null, triggerValue: null },
      { subSectionId: 4, groupLabel: "a.", fieldId: 124, order: 4, isRequired: true, parentId: null, triggerValue: null },
      { subSectionId: 4, groupLabel: "b.", fieldId: 125, order: 4, isRequired: true, parentId: null, triggerValue: null },
      { subSectionId: 4, groupLabel: "c.", fieldId: 118, order: 5, isRequired: false, parentId: null, triggerValue: null },

      { subSectionId: 5, groupLabel: "a.", fieldId: 126, order: 1, isRequired: true, parentId: null, triggerValue: null },
      { subSectionId: 5, groupLabel: "b.", fieldId: 127, order: 2, isRequired: true, parentId: null, triggerValue: null },
      { subSectionId: 5, fieldId: 128, order: 3, isRequired: true, parentId: 127, triggerValue: "Tidak Normal" },
      { subSectionId: 5, groupLabel: "Tumor:", fieldId: 129, order: 4, isRequired: true, parentId: 127, triggerValue: "Tidak Normal" },
      { subSectionId: 5, groupLabel: "Tumor:", fieldId: 130, order: 5, isRequired: true, parentId: 127, triggerValue: "Tidak Normal" },
      { subSectionId: 5, groupLabel: "Tumor:", fieldId: 131, order: 6, isRequired: true, parentId: 127, triggerValue: "Tidak Normal" },
      { subSectionId: 5, groupLabel: "c.", fieldId: 118, order: 7, isRequired: false, parentId: null, triggerValue: null },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    await queryInterface.bulkDelete('subsection_field', null, {});
    await queryInterface.bulkDelete('field', null, {});
    await queryInterface.bulkDelete('option_value', null, {});
    await queryInterface.bulkDelete('option', null, {});
    await queryInterface.bulkDelete('subsection', null, {});
    await queryInterface.bulkDelete('section', null, {});
    await queryInterface.bulkDelete('form', null, {});

    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  }
};