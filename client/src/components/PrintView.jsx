import { Button, Typography, Descriptions, Divider, Modal, Space } from 'antd';
import { useState } from 'react';

const { Title, Text } = Typography;

const PrintView = ({ formData, values }) => {
    if (!formData || !values) return null;

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => setIsModalOpen(true);
    const handleCancel = () => setIsModalOpen(false);

    return (
        <>
            <Button type="primary" size="large" block onClick={showModal} style={{ marginTop: 20 }}>
                PRINT PREVIEW REKAM MEDIS
            </Button>

            <Modal
                title="Preview Rekam Medis"
                open={isModalOpen}
                onCancel={handleCancel}
                width={1000}
                centered
                footer={[
                    <Button key="back" onClick={handleCancel}>Tutup</Button>,
                    <Button key="print" type="primary" onClick={() => window.print()}>Cetak PDF</Button>
                ]}
                styles={{ body: { maxHeight: '75vh', overflowY: 'auto', padding: '25px' } }}
            >
                <div id="print-area" style={{ background: '#fff', color: '#000' }}>
                    <div style={{ textAlign: 'center', marginBottom: 40, borderBottom: '2px solid #000', paddingBottom: 20 }}>
                        <Title level={2} style={{ margin: 0 }}>{formData.name?.toUpperCase()}</Title>
                        <Text type="secondary">{formData.description}</Text>
                    </div>

                    {formData.Sections?.map((section) => {
                        const sKey = section.id.toString();
                        const sectionValues = values.sections?.[sKey];
                        if (!sectionValues) return null;

                        return (
                            <div key={section.id} style={{ marginBottom: 30 }}>
                                <Title level={4} style={{ background: '#f0f2f5', padding: '8px 12px', borderLeft: '4px solid #1890ff' }}>
                                    {section.name}
                                </Title>

                                {section.SubSections?.map((sub) => {
                                    const subKey = sub.id.toString();
                                    // PERBAIKAN: Samakan key dengan yang di App.js
                                    const fieldsData = sectionValues.subsections?.[subKey]?.subsectionFields;
                                    if (!fieldsData) return null;

                                    return (
                                        <div key={sub.id} style={{ padding: '0 10px', marginBottom: 20 }}>
                                            <Divider orientation="left" plain>
                                                <Text strong style={{ color: '#555' }}>{sub.name}</Text>
                                            </Divider>

                                            <Descriptions bordered column={1} size="small">
                                                {sub.SubSectionFields?.map((item) => {
                                                    const field = item.Field;
                                                    const fKey = item.id.toString();

                                                    // --- LOGIKA VISIBILITAS REKURSIF ---
                                                    const checkVisibility = (currentItem) => {
                                                        if (!currentItem.parentId) return true;
                                                        const parentItem = sub.SubSectionFields.find(p => p.id === currentItem.parentId);
                                                        if (!parentItem) return true;

                                                        const parentValue = fieldsData[parentItem.id.toString()];
                                                        const isTriggerMatch = currentItem.triggerValue === null || String(parentValue) === String(currentItem.triggerValue);
                                                        
                                                        return isTriggerMatch && checkVisibility(parentItem);
                                                    };

                                                    if (!checkVisibility(item)) return null;
                                                    // ----------------------------------

                                                    const rawValue = fieldsData[fKey];
                                                    let displayValue = rawValue;
                                                    
                                                    if (rawValue && typeof rawValue === 'object' && rawValue.format) {
                                                        displayValue = rawValue.format('DD/MM/YYYY');
                                                    } else if (rawValue === undefined || rawValue === null || rawValue === '') {
                                                        displayValue = '-';
                                                    }

                                                    // --- HITUNG LEVEL UNTUK INDENTASI ---
                                                    const getLevel = (curr, level = 0) => {
                                                        if (!curr.parentId) return level;
                                                        const parent = sub.SubSectionFields.find(p => p.id === curr.parentId);
                                                        return parent ? getLevel(parent, level + 1) : level;
                                                    };
                                                    const level = getLevel(item);
                                                    const labelPadding = { paddingLeft: `${level * 25}px` };

                                                    return (
                                                        <Descriptions.Item 
                                                            key={item.id} 
                                                            label={
                                                                <div style={labelPadding}>
                                                                    <Space>
                                                                        {item.groupLabel && <Text strong>[{item.groupLabel}]</Text>}
                                                                        <Text>{field.labelId}</Text>
                                                                    </Space>
                                                                </div>
                                                            }
                                                        >
                                                            <Text strong={level === 0}>{displayValue}</Text>
                                                            {field.satuanId && <Text style={{ marginLeft: 5 }}>{field.satuanId}</Text>}
                                                        </Descriptions.Item>
                                                    );
                                                })}
                                            </Descriptions>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}

                    <div style={{ marginTop: 50, display: 'flex', justifyContent: 'flex-end', pageBreakInside: 'avoid' }}>
                        <div style={{ textAlign: 'center', width: 250 }}>
                            <Text>Jakarta, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
                            <div style={{ height: 80 }}></div>
                            <Text strong>( ____________________ )</Text>
                            <br />
                            <Text type="secondary">Dokter Pemeriksa</Text>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default PrintView;