import { Form, Typography } from 'antd';
const { Text } = Typography;

const StandardField = ({ field, subsection, section, lang, renderInput, getRules, index, allFields }) => {
    const subSectionField = field.SubSectionField;
    const isChild = !!subSectionField?.parentId;
    const groupLabel = subSectionField?.groupLabel;

    const prevField = index > 0 ? allFields[index - 1].SubSectionField : null;
    // (Cuma kalau punya label DAN labelnya beda ama atasnya)
    const shouldShowText = groupLabel && groupLabel !== prevField?.groupLabel;

    let labelWidth = '0px';

    if (groupLabel) {
        labelWidth = isChild ? '65px' : '35px';
    } else if (isChild) {
        labelWidth = '0px';
    }

    const containerStyle = {
        display: 'flex',
        alignItems: 'flex-start',
        marginLeft: isChild ? '30px' : '0px',
        padding: isChild ? '2px 10px 1px 20px' : '0px',
        borderLeft: isChild ? '2px solid #e8e8e8' : 'none',
        marginBottom: isChild ? '4px' : '16px',
    };
    return (
        <div style={containerStyle}>
            <div style={{
                width: labelWidth,
                minWidth: labelWidth,
                fontWeight: 'bold',
                paddingTop: 5,
                color: '#555',
                fontSize: isChild ? '12px' : '14px',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
            }}>
                {shouldShowText ? groupLabel : ""}
            </div>

            <div style={{ flex: 1 }}>
                <Form.Item
                    name={['sections', section.id.toString(), 'subsections', subsection.id.toString(), 'fields', field.id.toString()]}
                    rules={getRules(field)}
                    label={
                        <Text strong={!isChild} style={{ fontSize: isChild ? '13px' : '14px' }}>
                            {lang === 'Id' ? field.labelId : field.labelEn}
                            {subSectionField?.isRequired && <span style={{ color: 'red', marginLeft: 4 }}>*</span>}
                        </Text>
                    }
                >
                    {renderInput(field)}
                </Form.Item>
            </div>
        </div>
    );
};

export default StandardField;