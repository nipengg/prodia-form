const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

// 1. Master Form
const Form = sequelize.define('Form', {
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT }
}, { tableName: 'form' });

// 2. Section (Bab)
const Section = sequelize.define('Section', {
  name: { type: DataTypes.STRING, allowNull: false },
  order: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { tableName: 'section', timestamps: false });

// 3. SubSection (Sub-Bab)
const SubSection = sequelize.define('SubSection', {
  name: { type: DataTypes.STRING, allowNull: false },
  order: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { tableName: 'subsection', timestamps: false });

// 4. Option Group (Untuk Radio/Dropdown/Checkbox)
const Option = sequelize.define('Option', {
  optionName: { type: DataTypes.STRING, allowNull: false },
  type: {
    type: DataTypes.ENUM('radio', 'checkbox', 'dropdown'),
    allowNull: false
  }
}, { tableName: 'option', timestamps: false });

// 5. Option Values (Isi Pilihannya)
const OptionValue = sequelize.define('OptionValue', {
  valueId: { type: DataTypes.STRING, allowNull: false }, // Nilai mentah (ID)
  valueEn: { type: DataTypes.STRING, allowNull: false }, // Label English
  order: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { tableName: 'option_value', timestamps: false });

// 6. Master Field (Kamus Pertanyaan)
const Field = sequelize.define('Field', {
  fieldType: {
    type: DataTypes.ENUM('text', 'radio', 'date', 'file', 'dropdown', 'number'),
    allowNull: false
  },
  labelId: { type: DataTypes.STRING, allowNull: false },
  labelEn: { type: DataTypes.STRING, allowNull: false },
  satuanId: { type: DataTypes.STRING, allowNull: true },
  satuanEn: { type: DataTypes.STRING, allowNull: true },
  defaultValue: { type: DataTypes.STRING, allowNull: true },
  validation: { type: DataTypes.JSON, allowNull: true } // Bonus: Kolom JSON validasi
}, { tableName: 'field', timestamps: false });

// 7. Tabel Pivot (Sutradara Form)
const SubSectionField = sequelize.define('SubSectionField', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  order: { type: DataTypes.INTEGER, defaultValue: 0 },
  isRequired: { type: DataTypes.BOOLEAN, defaultValue: false },

  groupLabel: { type: DataTypes.STRING, allowNull: true },
  
  // Logic Conditional (Parent-Child)
  parentId: { type: DataTypes.INTEGER, allowNull: true }, 
  triggerValue: { type: DataTypes.STRING, allowNull: true }
}, { tableName: 'subsection_field', timestamps: false });

// --- DEFINISI RELASI (PENTING!) ---

// Option <-> OptionValue
Option.hasMany(OptionValue, { foreignKey: 'optionId' });
OptionValue.belongsTo(Option, { foreignKey: 'optionId' });

// Field <-> Option
Option.hasMany(Field, { foreignKey: 'optionId' });
Field.belongsTo(Option, { foreignKey: 'optionId' });

// Form -> Section -> SubSection
Form.hasMany(Section, { foreignKey: 'formId' });
Section.belongsTo(Form, { foreignKey: 'formId' });

Section.hasMany(SubSection, { foreignKey: 'sectionId' });
SubSection.belongsTo(Section, { foreignKey: 'sectionId' });

// Many-to-Many (SubSection <-> Field)
// Kita pakai alias 'Fields' agar saat di-include namanya rapi
SubSection.belongsToMany(Field, {
  through: SubSectionField,
  foreignKey: 'subSectionId',
  otherKey: 'fieldId'
});
Field.belongsToMany(SubSection, {
  through: SubSectionField,
  foreignKey: 'fieldId',
  otherKey: 'subSectionId'
});

// Relasi Tambahan ke Pivot (Penting buat ambil parentId dkk)
SubSection.hasMany(SubSectionField, { foreignKey: 'subSectionId' });
SubSectionField.belongsTo(SubSection, { foreignKey: 'subSectionId' });

module.exports = { 
  Form, Section, SubSection, Field, 
  SubSectionField, Option, OptionValue 
};