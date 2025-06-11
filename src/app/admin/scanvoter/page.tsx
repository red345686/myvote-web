'use client';

import { useState, useRef, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function ScanVoterPage() {
    const [scanResult, setScanResult] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string>('');
    const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            'qr-reader',
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0,
            },
            false
        );

        scanner.render(onScanSuccess, onScanFailure);
        scannerRef.current = scanner;

        return () => {
            scanner.clear();
        };
    }, []);

    const onScanSuccess = async (decodedText: string) => {
        setScanResult(decodedText);
        setIsLoading(true);
        setMessage('');

        try {
            const response = await fetch('https://notional-yeti-461501-r9.uc.r.appspot.com/api/voters/vote-via-scan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ qrData: decodedText }),
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
        // Handle scan failure silently or log if needed
        console.log('Scan failed:', error);
    };

    const resetScanner = () => {
        setScanResult('');
        setMessage('');
        setMessageType('');
    };

    return (
        <div className="container mx-auto p-6 max-w-2xl">
            <h1 className="text-3xl font-bold text-center mb-8">QR Code Vote Scanner</h1>

            <div className="bg-white rounded-lg shadow-lg p-6">
                <div id="qr-reader" className="w-full mb-6"></div>

                {isLoading && (
                    <div className="text-center mb-4">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="mt-2 text-gray-600">Processing vote...</p>
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
