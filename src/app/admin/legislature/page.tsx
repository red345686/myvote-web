'use client';

import React, { useState, useEffect } from 'react';

interface StateData {
    name: string;
    totalSeats: number;
    parties: {
        [party: string]: number;
    };
}

const stateData: { [key: string]: StateData } = {
    'andhra-pradesh': {
        name: 'Andhra Pradesh',
        totalSeats: 175,
        parties: { 'YSRCP': 151, 'TDP': 23, 'BJP': 1 }
    },
    'assam': {
        name: 'Assam',
        totalSeats: 126,
        parties: { 'BJP': 60, 'AGP': 9, 'UPPL': 6, 'INC': 29, 'AIUDF': 16, 'Others': 6 }
    },
    'bihar': {
        name: 'Bihar',
        totalSeats: 243,
        parties: { 'JDU': 43, 'BJP': 74, 'RJD': 75, 'INC': 19, 'Others': 32 }
    },
    'chhattisgarh': {
        name: 'Chhattisgarh',
        totalSeats: 90,
        parties: { 'INC': 68, 'BJP': 15, 'Others': 7 }
    },
    'goa': {
        name: 'Goa',
        totalSeats: 40,
        parties: { 'BJP': 20, 'INC': 11, 'AAP': 2, 'Others': 7 }
    },
    'gujarat': {
        name: 'Gujarat',
        totalSeats: 182,
        parties: { 'BJP': 156, 'INC': 17, 'AAP': 5, 'Others': 4 }
    },
    'haryana': {
        name: 'Haryana',
        totalSeats: 90,
        parties: { 'BJP': 40, 'INC': 37, 'JJP': 10, 'Others': 3 }
    },
    'himachal-pradesh': {
        name: 'Himachal Pradesh',
        totalSeats: 68,
        parties: { 'INC': 40, 'BJP': 25, 'Others': 3 }
    },
    'jharkhand': {
        name: 'Jharkhand',
        totalSeats: 81,
        parties: { 'JMM': 30, 'INC': 16, 'RJD': 1, 'BJP': 26, 'Others': 8 }
    },
    'karnataka': {
        name: 'Karnataka',
        totalSeats: 224,
        parties: { 'INC': 135, 'BJP': 66, 'JDS': 19, 'Others': 4 }
    },
    'kerala': {
        name: 'Kerala',
        totalSeats: 140,
        parties: { 'LDF': 99, 'UDF': 41 }
    },
    'madhya-pradesh': {
        name: 'Madhya Pradesh',
        totalSeats: 230,
        parties: { 'BJP': 163, 'INC': 66, 'Others': 1 }
    },
    'maharashtra': {
        name: 'Maharashtra',
        totalSeats: 288,
        parties: { 'BJP': 105, 'Shiv Sena': 56, 'NCP': 53, 'INC': 44, 'Others': 30 }
    },
    'odisha': {
        name: 'Odisha',
        totalSeats: 147,
        parties: { 'BJD': 112, 'BJP': 23, 'INC': 9, 'Others': 3 }
    },
    'punjab': {
        name: 'Punjab',
        totalSeats: 117,
        parties: { 'AAP': 92, 'INC': 18, 'SAD': 3, 'BJP': 2, 'Others': 2 }
    },
    'rajasthan': {
        name: 'Rajasthan',
        totalSeats: 200,
        parties: { 'BJP': 115, 'INC': 69, 'Others': 16 }
    },
    'tamil-nadu': {
        name: 'Tamil Nadu',
        totalSeats: 234,
        parties: { 'DMK': 133, 'AIADMK': 66, 'BJP': 4, 'Others': 31 }
    },
    'telangana': {
        name: 'Telangana',
        totalSeats: 119,
        parties: { 'BRS': 88, 'INC': 19, 'BJP': 8, 'Others': 4 }
    },
    'uttar-pradesh': {
        name: 'Uttar Pradesh',
        totalSeats: 403,
        parties: { 'BJP': 255, 'SP': 111, 'RLD': 8, 'INC': 2, 'Others': 27 }
    },
    'west-bengal': {
        name: 'West Bengal',
        totalSeats: 294,
        parties: { 'AITC': 215, 'BJP': 77, 'INC': 0, 'Others': 2 }
    }
};

const LegislaturePage: React.FC = () => {
    const [hoveredState, setHoveredState] = useState<string | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [geoData, setGeoData] = useState<any>(null);

    useEffect(() => {
        const loadGeoData = async () => {
            try {
                const response = await fetch('/in.json');
                const data = await response.json();
                setGeoData(data);
            } catch (error) {
                console.error('Error loading GeoJSON:', error);
            }
        };

        loadGeoData();
    }, []);

    const handleStateHover = (stateId: string, event: React.MouseEvent) => {
        setHoveredState(stateId);
        setTooltipPosition({ x: event.clientX, y: event.clientY });
    };

    const handleStateLeave = () => {
        setHoveredState(null);
    };

    const getPartyColor = (party: string): string => {
        const colors: { [key: string]: string } = {
            'BJP': '#FF6B35',
            'INC': '#19AAED',
            'AAP': '#0066CC',
            'YSRCP': '#1F4788',
            'TDP': '#F9D71C',
            'JDU': '#008B00',
            'RJD': '#008000',
            'JMM': '#337321',
            'BJD': '#997A00',
            'DMK': '#FF0000',
            'AIADMK': '#00FF00',
            'BRS': '#F84996',
            'AITC': '#20CEAA',
            'LDF': '#FF0000',
            'UDF': '#19AAED',
            'Others': '#808080'
        };
        return colors[party] || '#808080';
    };

    const getStateIdFromName = (name: string): string => {
        return name.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/&/g, '')
            .replace(/'/g, '');
    };

    const projectCoordinates = (coordinates: number[]): string => {
        // Improved projection for India (approximate bounds: 68°E to 97°E, 6°N to 37°N)
        const [lng, lat] = coordinates;
        const minLng = 68, maxLng = 97;
        const minLat = 6, maxLat = 37;

        // Scale to fit in viewBox
        const x = ((lng - minLng) / (maxLng - minLng)) * 800 + 100;
        const y = ((maxLat - lat) / (maxLat - minLat)) * 600 + 50;

        return `${x},${y}`;
    };

    const createPathFromGeometry = (geometry: any): string => {
        if (geometry.type === 'Polygon') {
            return geometry.coordinates.map((ring: number[][]) => {
                const pathData = ring.map((coord, index) => {
                    const point = projectCoordinates(coord);
                    return index === 0 ? `M ${point}` : `L ${point}`;
                }).join(' ') + ' Z';
                return pathData;
            }).join(' ');
        } else if (geometry.type === 'MultiPolygon') {
            return geometry.coordinates.map((polygon: number[][][]) => {
                return polygon.map((ring: number[][]) => {
                    const pathData = ring.map((coord, index) => {
                        const point = projectCoordinates(coord);
                        return index === 0 ? `M ${point}` : `L ${point}`;
                    }).join(' ') + ' Z';
                    return pathData;
                }).join(' ');
            }).join(' ');
        }
        return '';
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                    India Legislative Assembly Map
                </h1>

                <div className="relative bg-white rounded-lg shadow-lg p-6">
                    {geoData ? (
                        <svg
                            viewBox="0 0 1000 700"
                            className="w-full h-auto mx-auto"
                            style={{ maxHeight: '700px' }}
                        >
                            {geoData.features.map((feature: any, index: number) => {
                                const stateName = feature.properties.NAME_1 || feature.properties.name || feature.properties.ST_NM;
                                const stateId = getStateIdFromName(stateName);
                                const pathData = createPathFromGeometry(feature.geometry);

                                return (
                                    <path
                                        key={index}
                                        id={stateId}
                                        d={pathData}
                                        fill={hoveredState === stateId ? '#4F46E5' : '#E5E7EB'}
                                        stroke="#374151"
                                        strokeWidth="0.5"
                                        className="cursor-pointer transition-colors duration-200"
                                        onMouseEnter={(e) => handleStateHover(stateId, e)}
                                        onMouseLeave={handleStateLeave}
                                    />
                                );
                            })}
                        </svg>
                    ) : (
                        <div className="flex items-center justify-center h-96">
                            <div className="text-gray-500">Loading map...</div>
                        </div>
                    )}

                    {/* Tooltip */}
                    {hoveredState && stateData[hoveredState] && (
                        <div
                            className="absolute z-10 bg-white p-4 rounded-lg shadow-lg border border-gray-200 max-w-sm"
                            style={{
                                left: Math.min(tooltipPosition.x - 200, window.innerWidth - 250),
                                top: Math.max(tooltipPosition.y - 100, 10),
                                pointerEvents: 'none'
                            }}
                        >
                            <h3 className="text-black font-bold text-lg mb-2">{stateData[hoveredState].name}</h3>
                            <p className="text-sm text-gray-600 mb-3">
                                Total Seats: <span className="font-semibold">{stateData[hoveredState].totalSeats}</span>
                            </p>
                            <div className="space-y-2">
                                <h4 className="text-black font-semibold text-sm">Party-wise Distribution:</h4>
                                {Object.entries(stateData[hoveredState].parties).map(([party, seats]) => (
                                    <div key={party} className="text-black flex items-center justify-between text-sm">
                                        <div className="flex items-center">
                                            <div
                                                className="w-3 h-3 rounded mr-2"
                                                style={{ backgroundColor: getPartyColor(party) }}
                                            ></div>
                                            <span>{party}</span>
                                        </div>
                                        <span className="font-semibold">{seats}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Legend */}
                <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-black font-bold text-lg mb-4">Party Legend</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-black">
                        {Object.entries({
                            'BJP': 'Bharatiya Janata Party',
                            'INC': 'Indian National Congress',
                            'AAP': 'Aam Aadmi Party',
                            'YSRCP': 'YSR Congress Party',
                            'TDP': 'Telugu Desam Party',
                            'JDU': 'Janata Dal (United)',
                            'RJD': 'Rashtriya Janata Dal',
                            'BJD': 'Biju Janata Dal',
                            'DMK': 'Dravida Munnetra Kazhagam',
                            'BRS': 'Bharat Rashtra Samithi',
                            'AITC': 'All India Trinamool Congress',
                            'JMM': 'Jharkhand Mukti Morcha',
                            'Shiv Sena': 'Shiv Sena',
                            'NCP': 'Nationalist Congress Party',
                            'LDF': 'Left Democratic Front',
                            'UDF': 'United Democratic Front'
                        }).map(([party, fullName]) => (
                            <div key={party} className="flex items-center text-sm">
                                <div
                                    className="w-4 h-4 rounded mr-2"
                                    style={{ backgroundColor: getPartyColor(party) }}
                                ></div>
                                <div>
                                    <div className="font-semibold">{party}</div>
                                    <div className="text-gray-600 text-xs">{fullName}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LegislaturePage;
