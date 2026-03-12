import { Form, Typography } from 'antd';
const { Text } = Typography;

const StandardField = ({ item, subsection, section, lang, renderInput, rules, index, allPivotFields }) => {
    const field = item.Field;
    const groupLabel = item.groupLabel;

    const getLevel = (currentItem, allFields, level = 0) => {
        if (!currentItem.parentId) return level;
        const parent = allFields.find(f => f.id === currentItem.parentId);
        if (!parent) return level;
        return getLevel(parent, allFields, level + 1);
    };

    const level = getLevel(item, allPivotFields);
    const isChild = level > 0;

    const prevItem = index > 0 ? allPivotFields[index - 1] : null;
    const shouldShowText = groupLabel && groupLabel !== prevItem?.groupLabel;

    let labelWidth = '0px';
    if (groupLabel) {
        labelWidth = isChild ? `${65 - (level * 5)}px` : '35px';
    }

    const containerStyle = {
        display: 'flex',
        alignItems: 'flex-start',
        marginLeft: `${level * 30}px`, 
        padding: isChild ? '2px 10px 1px 20px' : '0px',
        borderLeft: isChild ? '2px solid #30cb2b' : 'none',
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
                    name={['sections', section.id.toString(), 'subsections', subsection.id.toString(), 'subsectionFields', item.id.toString()]}
                    rules={rules}
                    label={
                        <Text strong={!isChild} style={{ fontSize: isChild ? '13px' : '14px' }}>
                            {lang === 'Id' ? field.labelId : field.labelEn}
                            {item.isRequired && <span style={{ color: 'red', marginLeft: 4 }}>*</span>}
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