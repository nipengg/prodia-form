'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. MASTER FORM
    await queryInterface.createTable('form', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    // 2. OPTION (Group)
    await queryInterface.createTable('option', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      optionName: { type: Sequelize.STRING, allowNull: false },
      type: {
        type: Sequelize.ENUM('radio', 'checkbox', 'dropdown'),
        allowNull: false
      }
    });

    // 3. SECTION
    await queryInterface.createTable('section', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      formId: {
        type: Sequelize.INTEGER,
        references: { model: 'form', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'CASCADE'
      },
      name: { type: Sequelize.STRING, allowNull: false },
      order: { type: Sequelize.INTEGER, defaultValue: 0 }
    });

    // 4. SUBSECTION
    await queryInterface.createTable('subsection', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      sectionId: {
        type: Sequelize.INTEGER,
        references: { model: 'section', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'CASCADE'
      },
      name: { type: Sequelize.STRING, allowNull: false },
      order: { type: Sequelize.INTEGER, defaultValue: 0 }
    });

    // 5. OPTION_VALUE
    await queryInterface.createTable('option_value', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      optionId: {
        type: Sequelize.INTEGER,
        references: { model: 'option', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'CASCADE'
      },
      valueId: { type: Sequelize.STRING, allowNull: false },
      valueEn: { type: Sequelize.STRING, allowNull: false },
      order: { type: Sequelize.INTEGER, defaultValue: 0 }
    });

    // 6. FIELD
    await queryInterface.createTable('field', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      optionId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'option', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'SET NULL'
      },
      fieldType: {
        type: Sequelize.ENUM('text', 'radio', 'date', 'file', 'dropdown', 'number'),
        allowNull: false
      },
      labelId: { type: Sequelize.STRING, allowNull: false },
      labelEn: { type: Sequelize.STRING, allowNull: false },
      satuanId: { type: Sequelize.STRING, allowNull: true },
      satuanEn: { type: Sequelize.STRING, allowNull: true },
      defaultValue: { type: Sequelize.STRING, allowNull: true },
      validation: { type: Sequelize.JSON, allowNull: true }
    });

    // 7. SUBSECTION_FIELD (Pivot)
    await queryInterface.createTable('subsection_field', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      subSectionId: {
        type: Sequelize.INTEGER,
        references: { model: 'subsection', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'CASCADE'
      },
      fieldId: {
        type: Sequelize.INTEGER,
        references: { model: 'field', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'CASCADE'
      },
      order: { type: Sequelize.INTEGER, defaultValue: 0 },
      isRequired: { type: Sequelize.BOOLEAN, defaultValue: false },
      groupLabel: { type: Sequelize.STRING, allowNull: true },
      parentId: { type: Sequelize.INTEGER, allowNull: true },
      triggerValue: { type: Sequelize.STRING, allowNull: true }
    });
  },

  async down(queryInterface, Sequelize) {
    // Matikan check FK biar drop lancar tanpa error urutan
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    await queryInterface.dropTable('subsection_field');
    await queryInterface.dropTable('field');
    await queryInterface.dropTable('option_value');
    await queryInterface.dropTable('subsection');
    await queryInterface.dropTable('section');
    await queryInterface.dropTable('option');
    await queryInterface.dropTable('form');

    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  }
};