# Blockchain-Based FIR Management System

A modern, responsive web application for managing First Information Reports (FIR) with blockchain integration for tamper-proof record keeping.

## Features

### 🔐 Authentication & User Management
- User registration and login
- JWT-based authentication
- User profile management
- Online/offline status tracking
- Password hashing with bcrypt

### 📝 FIR Management
- Submit FIR with comprehensive details
- Track FIR status (Pending, Under Review, Approved, Rejected, Resolved)
- View detailed FIR information
- Blockchain hash generation for each FIR
- Witness information management
- Case number assignment

### 🔗 Blockchain Integration
- SHA-256 hash generation for FIR data
- Blockchain transaction ID generation
- Immutable record verification
- Tamper-proof data storage

### 🎨 User Interface
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Mode**: Toggle between themes with persistent preference
- **Multi-language Support**: English and Hindi (हिंदी)
- **Modern UI**: Beautiful gradient cards, smooth animations, and intuitive navigation

### 🤖 Chatbot Assistant
- Interactive chatbot for user guidance
- Help with FIR submission process
- Answers common questions
- Step-by-step assistance

### 📊 Dashboard & Analytics
- Overview statistics (Total, Pending, Approved, Resolved FIRs)
- Recent FIRs display
- Quick access to all features
- Real-time status updates

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation

### Frontend
- **React 18** with React Router
- **Axios** for API calls
- **React Icons** for icons
- **Framer Motion** for animations
- **React Hot Toast** for notifications
- **Date-fns** for date formatting

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Step 1: Clone and Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### Step 2: Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fir_management
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

**Important**: Change the `JWT_SECRET` to a strong, random string in production.

### Step 3: Start MongoDB

Make sure MongoDB is running on your system:

```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas connection string in .env
```

### Step 4: Run the Application

#### Development Mode (Both Server and Client)

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- React frontend on `http://localhost:3000`

#### Run Separately

**Backend only:**
```bash
npm run server
```

**Frontend only:**
```bash
npm run client
```

### Step 5: Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## Project Structure

```
PRO/
├── server/
│   ├── index.js              # Express server setup
│   ├── models/
│   │   ├── User.js           # User model
│   │   └── FIR.js            # FIR model
│   ├── routes/
│   │   ├── auth.js           # Authentication routes
│   │   ├── fir.js            # FIR routes
│   │   ├── user.js           # User profile routes
│   │   └── blockchain.js     # Blockchain routes
│   ├── middleware/
│   │   └── auth.js           # JWT authentication middleware
│   └── services/
│       └── blockchain.js     # Blockchain hash generation
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── context/          # React Context providers
│   │   ├── App.js            # Main App component
│   │   └── index.js          # Entry point
│   └── package.json
├── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `POST /api/auth/logout` - Logout user (Protected)

### FIR Management
- `POST /api/fir/submit` - Submit new FIR (Protected)
- `GET /api/fir/my-firs` - Get user's FIRs (Protected)
- `GET /api/fir/:id` - Get FIR details (Protected)
- `PUT /api/fir/:id/status` - Update FIR status (Officer/Admin only)

### User Profile
- `GET /api/user/profile` - Get user profile with stats (Protected)
- `PUT /api/user/profile` - Update user profile (Protected)
- `PUT /api/user/online-status` - Update online status (Protected)

### Blockchain
- `POST /api/blockchain/verify` - Verify blockchain hash (Protected)

## Usage Guide

### For Users

1. **Register/Login**: Create an account or login with existing credentials
2. **Submit FIR**: Fill in all required details about the incident
3. **Track FIR**: View all your submitted FIRs and their status
4. **View Details**: Click on any FIR to see complete information including blockchain hash
5. **Update Profile**: Edit your personal information and preferences
6. **Use Chatbot**: Click the chatbot icon for help and guidance

### For Officers/Admins

1. Login with officer/admin credentials
2. Access pending FIRs for review
3. Approve or reject FIRs with comments
4. Assign case numbers
5. Mark cases as resolved

## Features in Detail

### Dark/Light Mode
- Toggle button in sidebar
- Preference saved in localStorage and database
- Smooth theme transitions

### Language Selection
- Switch between English and Hindi
- All UI text translated
- Preference saved per user

### Online Status
- Real-time online/offline indicator
- Last seen timestamp
- Automatic status updates

### Blockchain Verification
- Each FIR gets a unique blockchain hash
- Hash is generated using SHA-256
- Transaction ID for tracking
- Immutable record verification

## Development Notes

### Adding New Languages

Edit `client/src/context/LanguageContext.js` and add translations:

```javascript
const translations = {
  en: { ... },
  hi: { ... },
  // Add new language
  es: {
    dashboard: 'Panel',
    // ... more translations
  }
};
```

### Customizing Blockchain Service

The blockchain service in `server/services/blockchain.js` currently uses SHA-256 hashing. To integrate with a real blockchain:

1. Install blockchain SDK (e.g., Web3.js for Ethereum)
2. Update `generateBlockchainHash` to create actual transactions
3. Update `verifyBlockchainHash` to verify on-chain

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify MongoDB port (default: 27017)

### Port Already in Use
- Change `PORT` in `.env` for backend
- Change React port: `PORT=3001 npm start` in client directory

### Authentication Errors
- Clear browser localStorage
- Check JWT_SECRET in `.env`
- Verify token expiration

## Security Considerations

- ✅ Passwords are hashed with bcrypt
- ✅ JWT tokens for authentication
- ✅ Input validation with express-validator
- ✅ Protected routes with middleware
- ⚠️ Change JWT_SECRET in production
- ⚠️ Use HTTPS in production
- ⚠️ Implement rate limiting
- ⚠️ Add CORS restrictions for production

## Future Enhancements

- [ ] Real blockchain integration (Ethereum/Hyperledger)
- [ ] File upload for evidence
- [ ] Email notifications
- [ ] SMS alerts
- [ ] Advanced search and filters
- [ ] PDF report generation
- [ ] Mobile app version
- [ ] Officer dashboard
- [ ] Analytics and reporting

## License

This project is for educational and research purposes.

## Support

For issues or questions, please check the code comments or create an issue in the repository.

---

**Built with ❤️ for secure and transparent FIR management**

