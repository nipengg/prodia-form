import { useEffect, useState } from 'react'
import StandardField from './components/StandardField';
import { Form, Input, Radio, Select, DatePicker, Button, Card, Typography, Space, Divider, Spin, Row, Col } from 'antd'
import axios from 'axios'
import dayjs from 'dayjs'

const API_URL = 'http://localhost:3000';
const { Title, Text } = Typography;
const HALF_LAYOUT_SUBS = [1, 2];

function App() {
    const [form] = Form.useForm();
    const [formData, setFormData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [lang, setLang] = useState('Id')

    const allValues = Form.useWatch([], form);

const fetchFormStructure = async () => {
    try {
        const res = await axios.get(`${API_URL}/config/1`);
        setFormData(res.data);

        const initialValues = { sections: {} };

        res.data.Sections?.forEach(sec => {
            const sKey = `${sec.id}`;
            if (!initialValues.sections[sKey]) {
                initialValues.sections[sKey] = { subsections: {} };
            }

            sec.SubSections?.forEach(sub => {
                const subKey = `${sub.id}`;
                if (!initialValues.sections[sKey].subsections[subKey]) {
                    initialValues.sections[sKey].subsections[subKey] = { fields: {} };
                }

                sub.Fields?.forEach(f => {
                    if (f.defaultValue) {
                        const fKey = `${f.id}`;
                        const value = f.fieldType === 'date' ? dayjs(f.defaultValue) : f.defaultValue;
                            
                        initialValues.sections[sKey].subsections[subKey].fields[fKey] = value;
                    }
                });
            });
        });

        form.setFieldsValue(initialValues);
        setLoading(false);
    } catch (err) {
        console.error("Gagal load form:", err);
        setLoading(false);
    }
};

    useEffect(() => { fetchFormStructure() }, [])

    const getRules = (field) => {
        const subSectionField = field.SubSectionField;
        const rules = [{ required: Boolean(subSectionField?.isRequired), message: lang === 'Id' ? 'Wajib diisi' : 'Required' }];

        if (field.validation) {
            const v = field.validation;
            if (v.min !== undefined) rules.push({ type: 'number', min: v.min, transform: (v) => Number(v), message: `Min: ${v.min}` });
            if (v.max !== undefined) rules.push({ type: 'number', max: v.max, transform: (v) => Number(v), message: `Max: ${v.max}` });
            if (v.minLength) rules.push({ min: v.minLength, message: `Min ${v.minLength} char` });
            if (v.pattern) rules.push({ pattern: new RegExp(v.pattern), message: 'Format invalid' });
        }
        return rules;
    }

    const renderFieldInput = (field) => {
        const options = field.Option?.OptionValues || [];
        const satuan = lang === 'Id' ? field.satuanId : field.satuanEn;

        switch (field.fieldType) {
            case 'text': return <Input placeholder="..." suffix={satuan} />;
            case 'number': return <Input type="number" placeholder="0" suffix={satuan} />;
            case 'date': return <DatePicker style={{ width: '100%' }} />;
            case 'radio':
                return (
                    <Radio.Group>
                        <Space direction="horizontal">
                            {options.map(opt => (
                                <Radio key={opt.id} value={opt.valueId}>
                                    {lang === 'Id' ? opt.valueId : opt.valueEn}
                                </Radio>
                            ))}
                        </Space>
                    </Radio.Group>
                );
            case 'dropdown':
                return (
                    <Select placeholder={lang === 'Id' ? '-- Pilih --' : '-- Select --'}>
                        {options.map(opt => (
                            <Select.Option key={opt.id} value={opt.valueId}>
                                {lang === 'Id' ? opt.valueId : opt.valueEn}
                            </Select.Option>
                        ))}
                    </Select>
                );
            default: return null;
        }
    }

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }}><Spin size="large" /></div>

    return (
        <div style={{ padding: '40px', maxWidth: '1500px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                    <Title level={2}>{formData.name}</Title>
                    <Text type="secondary">{formData.description}</Text>
                </div>
                <Radio.Group value={lang} onChange={(e) => setLang(e.target.value)} buttonStyle="solid">
                    <Radio.Button value="Id">ID</Radio.Button>
                    <Radio.Button value="En">EN</Radio.Button>
                </Radio.Group>
            </div>

            <Form
                form={form}
                layout="horizontal"
                requiredMark="optional"
                labelAlign="left"
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 17 }}
                onFinish={(v) => console.log(v)}
            >
                {formData.Sections?.map((section) => (
                    <Card
                        key={section.id}
                        title={<Title level={4} style={{ margin: 0 }}>{section.name}</Title>}
                        style={{ marginBottom: 30, border: '1px solid #d9d9d9' }}
                    >
                        <Row gutter={[24, 0]}>
                            {section.SubSections?.map((sub) => {

                                const isHalf = HALF_LAYOUT_SUBS.includes(sub.id);
                                const spanValue = isHalf ? 12 : 24;

                                return (
                                    <Col key={sub.id} span={spanValue} xs={24} md={spanValue}>
                                        <div style={{ marginBottom: 20 }}>
                                            <Divider style={{
                                                borderTopWidth: '2px',
                                                borderColor: '#bbbbbb',
                                            }} orientation="left" plain>
                                                <Text strong>{sub.name}</Text>
                                            </Divider>

                                            {sub.Fields?.map((field, index) => {
                                                const subSectionField = field.SubSectionField;

                                                if (subSectionField?.parentId && subSectionField.triggerValue !== null) {
                                                    const parentValue = allValues?.sections?.[`${section.id}`]?.subsections?.[`${sub.id}`]?.fields?.[`${subSectionField.parentId}`];

                                                    if (subSectionField.triggerValue === 'ANY') {
                                                        if (!parentValue) return null;
                                                    } else if (parentValue !== subSectionField.triggerValue) {
                                                        return null;
                                                    }
                                                }

                                                return (
                                                    <StandardField
                                                        key={field.id}
                                                        section={section}
                                                        subsection={sub}
                                                        field={field}
                                                        lang={lang}
                                                        renderInput={renderFieldInput}
                                                        getRules={getRules}
                                                        index={index}
                                                        allFields={sub.Fields}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </Col>
                                );
                            })}
                        </Row>
                    </Card>
                ))}
                <Button type="primary" htmlType="submit" size="large" block>SIMPAN REKAM MEDIS</Button>
            </Form>

            <Card title="Debug: Live Values" style={{ marginTop: 20, background: '#1e1e1e' }} headStyle={{ color: '#fff' }}>
                <pre style={{ color: '#00ff00', margin: 0 }}>{JSON.stringify(allValues, null, 2)}</pre>
            </Card>
        </div>
    )
}

export default App