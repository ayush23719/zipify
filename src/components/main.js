import React, { useState } from 'react';
import { Typography, Upload, List, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { parse, Stream } from 'unzipper';

const { Title } = Typography;

function App() {
    const [extractedFiles, setExtractedFiles] = useState([]);

    const handleFileUpload = async (file) => {
        const extracted = [];
        const directory = await parse(file);
        directory.on('entry', (entry) => {
            const chunks = [];
            entry
                .stream()
                .pipe(new Stream.PassThrough())
                .on('data', (chunk) => chunks.push(chunk))
                .on('end', () => {
                    const fileData = Buffer.concat(chunks);
                    extracted.push({ name: entry.path, data: fileData });
                });
        });
        directory.on('finish', () => {
            setExtractedFiles(extracted);
        });
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
            <Title level={2} style={{ textAlign: 'center' }}>
                Zip File Extractor
            </Title>

            <Upload.Dragger
                accept=".zip"
                beforeUpload={(file) => {
                    handleFileUpload(file);
                    return false; // Prevent default upload behavior
                }}
            >
                <p className="ant-upload-drag-icon">
                    <UploadOutlined />
                </p>
                <p className="ant-upload-text">Click or drag a zip file to upload</p>
            </Upload.Dragger>

            {extractedFiles.length > 0 && (
                <div style={{ marginTop: '2rem' }}>
                    <Title level={4}>Extracted Files:</Title>
                    <List
                        dataSource={extractedFiles}
                        renderItem={(entry) => (
                            <List.Item>
                                <List.Item.Meta title={entry.name} />
                                <Button
                                    type="primary"
                                    size="small"
                                    href={`data:application/octet-stream;base64,${entry.data.toString(
                                        'base64'
                                    )}`}
                                    download={entry.name}
                                >
                                    Download
                                </Button>
                            </List.Item>
                        )}
                    />
                </div>
            )}
        </div>
    );
}

export default App;
