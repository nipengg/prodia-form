const express = require('express');
const { Form, Section, SubSection, Field, Option, OptionValue, SubSectionField } = require('../models/config/Config');
const router = express.Router();

router.get('/:id', async (req, res) => {
    try {
        const formData = await Form.findByPk(req.params.id, {
            include: [{
                model: Section,
                separate: true,
                order: [['order', 'ASC']],
                include: [{
                    model: SubSection,
                    separate: true,
                    order: [['order', 'ASC']],
                    include: [{
                        model: Field,
                        through: { 
                            attributes: ['order', 'isRequired', 'groupLabel', 'parentId', 'triggerValue'] 
                        },
                        include: [{
                            model: Option,
                            include: [{
                                model: OptionValue,
                                separate: true,
                                order: [['order', 'ASC']]
                            }]
                        }]
                    }]
                }]
            }]
        });

        if (!formData) return res.status(404).json({ message: "Form gak ketemu!" });
        
        const plainData = formData.get({ plain: true });
        
        plainData.Sections.forEach(section => {
            section.SubSections.forEach(sub => {
                if (sub.Fields) {
                    sub.Fields.sort((a, b) => {
                        return a.SubSectionField.order - b.SubSectionField.order;
                    });
                }
            });
        });

        res.json(plainData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;