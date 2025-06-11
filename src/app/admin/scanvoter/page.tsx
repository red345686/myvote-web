'use client';

import { useState, useRef, useEffect } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType, Html5Qrcode } from 'html5-qrcode';

export default function ScanVoterPage() {
    const [scanResult, setScanResult] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string>('');
    const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
    const [scanMode, setScanMode] = useState<'camera' | 'file'>('camera');
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (scanMode === 'camera') {
            initializeCamera();
        }
        return () => {
            cleanupScanner();
        };
    }, [scanMode]);

    const initializeCamera = () => {
        const scanner = new Html5QrcodeScanner(
            'qr-reader',
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0,
                showTorchButtonIfSupported: true,
                showZoomSliderIfSupported: true,
                defaultZoomValueIfSupported: 2,
                supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
                rememberLastUsedCamera: true,
                experimentalFeatures: {
                    useBarCodeDetectorIfSupported: true
                }
            },
            false
        );

        scanner.render(onScanSuccess, onScanFailure);
        scannerRef.current = scanner;
    };

    const cleanupScanner = () => {
        if (scannerRef.current) {
            scannerRef.current.clear().catch(console.error);
            scannerRef.current = null;
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        setMessage('');

        try {
            const html5QrCode = new Html5Qrcode('file-reader');
            const decodedText = await html5QrCode.scanFile(file, true);
            onScanSuccess(decodedText);
        } catch (error) {
            setMessage('Could not read QR code from image. Please try a clearer image.');
            setMessageType('error');
        } finally {
            setIsLoading(false);
        }
    };

    const onScanSuccess = async (decodedText: string) => {
        setScanResult(decodedText);
        setIsLoading(true);
        setMessage('');

        try {
            // Parse the QR code data and format it properly
            const qrDataObject = JSON.parse(decodedText);
            const formattedQrData = JSON.stringify(qrDataObject);

            const response = await fetch('https://notional-yeti-461501-r9.uc.r.appspot.com/api/voters/vote-via-scan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ qrData: formattedQrData }),
            });

            if (response.ok) {
                const result = await response.json();
                setMessage('Vote submitted successfully!');
                setMessageType('success');
            } else {
                setMessage('Failed to submit vote. Please try again.');
                setMessageType('error');
            }
        } catch (error) {
            setMessage('Network error. Please check your connection.');
            setMessageType('error');
        } finally {
            setIsLoading(false);
        }
    };

    const onScanFailure = (error: string) => {
        if (!error.includes('NotFoundException') && !error.includes('No MultiFormat Readers')) {
            console.log('Scan failed:', error);
            setMessage('Scanner error: ' + error);
            setMessageType('error');
        }
    };

    const resetScanner = () => {
        setScanResult('');
        setMessage('');
        setMessageType('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const switchScanMode = (mode: 'camera' | 'file') => {
        cleanupScanner();
        setScanMode(mode);
        resetScanner();
    };

    return (
        <div className="container mx-auto p-6 max-w-2xl">
            <h1 className="text-3xl font-bold text-center mb-8">QR Code Vote Scanner</h1>

            <div className="bg-white rounded-lg shadow-lg p-6">
                {/* Mode Toggle */}
                <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => switchScanMode('camera')}
                        className={`flex-1 py-2 px-4 rounded-md transition-colors ${scanMode === 'camera'
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        📷 Camera Scan
                    </button>
                    <button
                        onClick={() => switchScanMode('file')}
                        className={`flex-1 py-2 px-4 rounded-md transition-colors ${scanMode === 'file'
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        🖼️ Upload Image
                    </button>
                </div>

                {/* Scanner Area */}
                {scanMode === 'camera' ? (
                    <div id="qr-reader" className="w-full mb-6"></div>
                ) : (
                    <div className="mb-6">
                        <div id="file-reader" style={{ display: 'none' }}></div>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                                id="file-upload"
                            />
                            <label
                                htmlFor="file-upload"
                                className="cursor-pointer flex flex-col items-center"
                            >
                                <div className="text-4xl mb-4">📁</div>
                                <div className="text-lg font-medium text-gray-700 mb-2">
                                    Upload QR Code Image
                                </div>
                                <div className="text-sm text-gray-500">
                                    Click to select an image file containing a QR code
                                </div>
                            </label>
                        </div>
                    </div>
                )}

                {isLoading && (
                    <div className="text-center mb-4">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="mt-2 text-gray-600">
                            {scanMode === 'camera' ? 'Processing vote...' : 'Reading QR code from image...'}
                        </p>
                    </div>
                )}

                {message && (
                    <div className={`p-4 rounded-lg mb-4 ${messageType === 'success'
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : 'bg-red-100 text-red-700 border border-red-300'
                        }`}>
                        {message}
                    </div>
                )}

                {scanResult && (
                    <div className="mb-4">
                        <h3 className="font-semibold mb-2">Scanned Data:</h3>
                        <p className="bg-gray-100 p-3 rounded border break-all">{scanResult}</p>
                    </div>
                )}

                <button
                    onClick={resetScanner}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                    disabled={isLoading}
                >
                    Reset Scanner
                </button>
            </div>
        </div>
    );
}
