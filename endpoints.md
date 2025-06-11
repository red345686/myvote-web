
Diptanshu--->>>>u do the register with aadhar qr generation scanning of qr 

anurag -->>>admin walla kr dena








# MyVote Backend API Documentation

This document outlines the API endpoints for the MyVote backend application. Below you'll find detailed information about each endpoint, including request formats and sample responses.

## Base URL
```
https://notional-yeti-461501-r9.uc.r.appspot.com/api --> google cloud deployed backend
http://localhost:8080/api -->local testing
```

## Authentication
Many endpoints require authentication. Admin endpoints require the `x-admin-address` header.

## User Registration and Management

### Register User with Aadhar
Register a new voter using their Aadhar details.

**Endpoint:** `POST /voters/register-aadhar`

**Request:**
```json
{
  "aadharNumber": "1234 5678 9012",
  "fullName": "John Doe",
  "dateOfBirth": "1990-01-15",
  "address": "123 Main Street, Mumbai, Maharashtra 400001",
  "phoneNumber": "9876543210",
  "email": "john.doe@example.com",
  "gender": "Male"
}
```

**Response (Success - 201 Created):**
```json
{
  "success": true,
  "message": "Voter registered successfully",
  "voterData": {
    "blockchainAddress": "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
    "isVerified": false,
    "createdAt": "2025-06-09T10:15:22.123Z"
  }
}
```

### Check Voter Registration Status
Check the status of a voter registration by Aadhar number.

**Endpoint:** `GET /voters/status/aadhar/{aadharNumber}`

**Response (Success - 200 OK):**
```json
{
  "found": true,
  "isVerified": true,
  "registrationDate": "2025-06-09T10:15:22.123Z",
  "verificationDate": "2025-06-09T14:20:33.456Z",
  "district": "Mumbai South"
}
```

## QR Code Generation and Management

### Generate QR Code for Voter (Admin only)
Generate a QR code for a verified voter.

**Endpoint:** `POST /qrcode/generate/{voterAddress}`

**Headers:**
```
x-admin-address: 0xAdminAddressHere
```

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "message": "QR code generated successfully",
  "data": {
    "voterAddress": "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
    "aadharHash": "0x7c9e6b3a1d5f8e4c2b7a9d1c5f8e4a3b2c1f5a8e4d9c6b3a7",
    "qrCodeUrl": "https://firebasestorage.googleapis.com/v0/b/myvote-app.appspot.com/o/qrcodes%2F7c9e6b...%2Fqr-code.png",
    "fileName": "qr-code.png",
    "generatedAt": "2025-06-09T15:30:45.789Z"
  }
}
```

### Generate Voting QR Code Using Aadhar (Admin only)
Generate a voting QR code for a verified voter using their Aadhar number.

**Endpoint:** `POST /voters/generate-voting-qr/{aadharNumber}`

**Headers:**
```
x-admin-address: 0xAdminAddressHere
```

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "message": "Voting QR code generated successfully",
  "data": {
    "aadharHash": "0x7c9e6b3a1d5f8e4c2b7a9d1c5f8e4a3b2c1f5a8e4d9c6b3a7",
    "qrCodeUrl": "https://firebasestorage.googleapis.com/v0/b/myvote-app.appspot.com/o/qrcodes%2F7c9e6b...%2Fqr-code.png",
    "voterName": "John Doe",
    "generatedAt": "2025-06-09T15:30:45.789Z"
  }
}
```

### Get QR Code by Aadhar Hash
Retrieve a generated QR code by its Aadhar hash.

**Endpoint:** `GET /qrcode/aadhar/{aadharHash}`

**Response (Success - 200 OK):**
```json
{
  "qrCodeUrl": "https://firebasestorage.googleapis.com/v0/b/myvote-app.appspot.com/o/qrcodes%2F7c9e6b...%2Fqr-code.png",
  "aadharHash": "0x7c9e6b3a1d5f8e4c2b7a9d1c5f8e4a3b2c1f5a8e4d9c6b3a7",
  "filePath": "7c9e6b3a1d5f8e4c2b7a9d1c5f8e4a3b2c1f5a8e4d9c6b3a7/qr-code.png",
  "generatedAt": "2025-06-09T15:30:45.789Z",
  "voterName": "John Doe"
}
```

## QR Code Scanning and Verification

### Verify QR Code
Verify the authenticity of a QR code.

**Endpoint:** `POST /qrcode/verify`

**Request:**
```json
{
  "qrData": "{\"voterAddress\":\"0x1a2b3c...\",\"nameHash\":\"0x4a5b6c...\",\"aadharHash\":\"0x7c9e6b...\",\"txHash\":\"0x9f8e7d...\"}"
}
```

**Response (Success - 200 OK):**
```json
{
  "valid": true,
  "voterName": "John Doe",
  "voterAddress": "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
  "aadharHash": "0x7c9e6b3a1d5f8e4c2b7a9d1c5f8e4a3b2c1f5a8e4d9c6b3a7",
  "verificationDate": "2025-06-09T14:20:33.456Z",
  "qrGeneratedAt": "2025-06-09T15:30:45.789Z",
  "filePath": "7c9e6b3a1d5f8e4c2b7a9d1c5f8e4a3b2c1f5a8e4d9c6b3a7/qr-code.png"
}
```

### Verify QR Code Without Processing Vote
Verify QR code data without processing a vote.

**Endpoint:** `POST /qrcode/verify-qr`

**Request:**
```json
{
  "qrData": "{\"voterAddress\":\"0x1a2b3c...\",\"nameHash\":\"0x4a5b6c...\",\"aadharHash\":\"0x7c9e6b...\",\"txHash\":\"0x9f8e7d...\"}"
}
```

**Response (Success - 200 OK):**
```json
{
  "valid": true,
  "data": {
    "voterAddress": "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
    "nameHash": "0x4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f",
    "aadharHash": "0x7c9e6b3a1d5f8e4c2b7a9d1c5f8e4a3b2c1f5a8e4d9c6b3a7",
    "txHash": "0x9f8e7d6c5b4a3f2e1d0c9b8a7654321fedcba9876543210abcdef"
  }
}
```

### Process Vote via QR Scan
Record a vote cast using a QR code scan.

**Endpoint:** `POST /qrcode/scan-vote`

**Request:**
```json
{
  "qrData": "{\"voterAddress\":\"0x1a2b3c...\",\"nameHash\":\"0x4a5b6c...\",\"aadharHash\":\"0x7c9e6b...\",\"txHash\":\"0x9f8e7d...\"}",
  "pollingStationId": "PS123456",
  "electionId": "E2025062"
}
```

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "message": "Vote recorded successfully",
  "voter": {
    "id": "voter_12345",
    "name": "John Doe",
    "constituency": "Mumbai South"
  },
  "timestamp": "2025-06-09T16:45:30.123Z",
  "transactionHash": "0xabcdef1234567890abcdef1234567890abcdef1234567890"
}
```

## Admin Routes

### Get Dashboard Statistics (Admin only)
Get an overview of voter registration and verification statistics.

**Endpoint:** `GET /admin/stats`

**Headers:**
```
x-admin-address: 0xAdminAddressHere
```

**Response (Success - 200 OK):**
```json
{
  "totalVoters": 1250,
  "verifiedVoters": 985,
  "pendingVerification": 265,
  "verificationRate": "78.80"
}
```

### Get All Voters (Admin only)
Get a paginated list of all registered voters.

**Endpoint:** `GET /admin/voters`

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 20)
- `filter`: Optional filter parameter

**Headers:**
```
x-admin-address: 0xAdminAddressHere
```

**Response (Success - 200 OK):**
```json
{
  "voters": [
    {
      "blockchainAddress": "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
      "name": "John Doe",
      "district": "Mumbai South",
      "isVerified": true,
      "registrationDate": "2025-06-09T10:15:22.123Z",
      "hasQrCode": true
    },
    {
      "blockchainAddress": "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c",
      "name": "Jane Smith",
      "district": "Mumbai North",
      "isVerified": true,
      "registrationDate": "2025-06-08T09:23:15.456Z",
      "hasQrCode": true
    }
  ],
  "pagination": {
    "total": 1250,
    "page": 1,
    "pages": 63,
    "limit": 20
  }
}
```

### Get Specific Voter by Address (Admin only)
Get detailed information about a specific voter using their blockchain address.

**Endpoint:** `GET /admin/voters/{address}`

**Headers:**
```
x-admin-address: 0xAdminAddressHere
```

**Response (Success - 200 OK):**
```json
{
  "blockchainAddress": "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
  "profile": {
    "name": "John Doe",
    "aadharNumber": "1234 5678 9012",
    "dateOfBirth": "1990-01-15",
    "address": "123 Main Street, Mumbai, Maharashtra 400001",
    "phoneNumber": "9876543210",
    "email": "john.doe@example.com"
  },
  "isVerified": true,
  "registrationDate": "2025-06-09T10:15:22.123Z",
  "verificationDate": "2025-06-09T14:20:33.456Z",
  "district": "Mumbai South",
  "gender": "Male",
  "aadharImage": "https://firebasestorage.googleapis.com/v0/b/myvote-app.appspot.com/o/aadhar%2F7c9e6b...%2Faadhar.jpg",
  "verificationNotes": "Identity verified through Aadhar verification system",
  "verifiedBy": "0xAdminAddressHere"
}
```

### Get Admin Activity Logs (Admin only)
Get a record of admin activities.

**Endpoint:** `GET /admin/logs`

**Headers:**
```
x-admin-address: 0xAdminAddressHere
```

**Response (Success - 200 OK):**
```json
{
  "logs": [
    {
      "adminAddress": "0xAdminAddressHere",
      "action": "VERIFY_VOTER",
      "targetAddress": "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
      "timestamp": "2025-06-09T14:20:33.456Z",
      "details": "Verified voter using Aadhar"
    },
    {
      "adminAddress": "0xAdminAddressHere",
      "action": "GENERATE_QR",
      "targetAddress": "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
      "timestamp": "2025-06-09T15:30:45.789Z",
      "details": "Generated voting QR code"
    }
  ],
  "pagination": {
    "total": 156,
    "page": 1,
    "pages": 8,
    "limit": 20
  }
}
```

## Voting Statistics

### Get Voting Statistics (Admin only)
Get statistics about the voting process.

**Endpoint:** `GET /voters/admin/voting-stats`

**Headers:**
```
x-admin-address: 0xAdminAddressHere
```

**Response (Success - 200 OK):**
```json
{
  "totalVerified": 985,
  "totalVoted": 723,
  "pendingVotes": 262,
  "turnoutPercentage": "73.40"
}
```

### Get Summary Statistics (Admin only)
Get summary statistics about voter registration methods.

**Endpoint:** `GET /voters/admin/stats/summary`

**Headers:**
```
x-admin-address: 0xAdminAddressHere
```

**Response (Success - 200 OK):**
```json
{
  "totalVoters": 1250,
  "verifiedVoters": 985,
  "pendingVoters": 265,
  "registrationMethods": {
    "walletBased": 326,
    "aadharBased": 924
  },
  "verificationRate": "78.80"
}
```

## Blockchain Verification

### Verify Voter on Blockchain (Admin only)
Verify a voter's identity and register them on the blockchain.

**Endpoint:** `POST /blockchain/verify-voter`

**Headers:**
```
x-admin-address: 0xAdminAddressHere
```

**Request:**
```json
{
  "voterAddress": "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
  "aadharHash": "0x7c9e6b3a1d5f8e4c2b7a9d1c5f8e4a3b2c1f5a8e4d9c6b3a7",
  "nameHash": "0x4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f",
  "adminNotes": "Verified with original Aadhar card"
}
```

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "message": "Voter verified successfully on blockchain",
  "transactionHash": "0xabcdef1234567890abcdef1234567890abcdef1234567890",
  "blockNumber": 12345678
}
```

## Health Check Endpoints

### Basic Health Check
Check if the API is running.

**Endpoint:** `GET /health`

**Response (Success - 200 OK):**
```json
{
  "status": "OK",
  "service": "myvote-backend",
  "timestamp": "2025-06-09T17:05:22.123Z",
  "version": "1.0.0"
}
```

### Detailed Health Check (Admin only)
Check detailed health of all services including database connection.

**Endpoint:** `GET /health/detailed`

**Headers:**
```
x-admin-address: 0xAdminAddressHere
```

**Response (Success - 200 OK):**
```json
{
  "status": "OK",
  "timestamp": "2025-06-09T17:05:22.123Z",
  "version": "1.0.0",
  "services": {
    "database": {
      "status": "connected",
      "latency": "12ms"
    },
    "blockchain": {
      "status": "connected",
      "latency": "125ms",
      "network": "Mumbai Testnet",
      "blockHeight": 12345678
    },
    "storage": {
      "status": "connected",
      "provider": "Firebase Storage"
    }
  }
}
```

## Demo Data

To test the API, you can use the following demo data:

### Demo Users
1. **John Doe**
   - Aadhar Number: 1234 5678 9012
   - Blockchain Address: 0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b
   - Status: Verified

2. **Jane Smith**
   - Aadhar Number: 9876 5432 1098
   - Blockchain Address: 0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c
   - Status: Verified

3. **Robert Johnson**
   - Aadhar Number: 4567 8901 2345
   - Blockchain Address: 0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d
   - Status: Pending verification

### Demo Admin
- Admin Address: 0xAdminAddressHere
- Password: Please use secure credentials provided separately

### Demo Polling Stations
1. PS123456 - Mumbai South Central
2. PS789012 - Mumbai North West
3. PS345678 - Mumbai East