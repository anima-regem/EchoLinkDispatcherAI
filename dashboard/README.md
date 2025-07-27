# EchoLink Dispatcher AI - Web Dashboard

A React-based web dashboard for the EchoLink Dispatcher AI emergency dispatch system, providing real-time monitoring, analytics, and management capabilities for emergency calls.

## 🚀 Features

- **Real-time Emergency Tracking**: Live updates of emergency calls and locations
- **Interactive Analytics**: Charts and visualizations for call data
- **Call Management**: Browse, search, and filter emergency call records
- **Department Routing**: Visual interface for routing calls to appropriate departments
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface built with React

## 🏗️ Project Structure

```
dashboard/
├── src/                    # React source files
│   ├── components/         # Reusable UI components
│   ├── pages/             # Main application pages
│   ├── services/          # API service functions
│   ├── styles/            # CSS and styling files
│   └── utils/             # Utility functions
├── public/                # Static assets
├── client/                # Next.js client application (Git submodule)
└── package.json           # Node.js dependencies
```

## 📋 Prerequisites

- **Node.js**: 16.x or higher
- **npm**: 8.x or higher (or yarn/bun as alternatives)
- **Backend API**: The FastAPI backend server should be running

## 🛠️ Installation

### 1. Navigate to Dashboard Directory
```bash
cd dashboard
```

### 2. Install Dependencies
```bash
# Using npm
npm install

# Or using yarn
yarn install

# Or using bun
bun install
```

### 3. Environment Configuration (Optional)
Create a `.env` file if you need to configure API endpoints:
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_WS_URL=ws://localhost:8000/ws
```

## 🚀 Running the Dashboard

### Development Mode
```bash
# Start the development server
npm start

# Or with yarn
yarn start

# Or with bun
bun start
```

The dashboard will be available at [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
# Build for production
npm run build

# Serve the production build locally (optional)
npx serve -s build
```

## 🔧 Configuration

### API Integration
The dashboard connects to the FastAPI backend server. Ensure the backend is running:

```bash
# In the main project directory
source myenv/bin/activate
uvicorn server:app --reload --port 8000
```

### Real-time Updates
The dashboard uses WebSocket connections for real-time updates. The connection is automatically established when the backend is available.

## 📊 Dashboard Features

### Main Dashboard
- **Live Call Feed**: Real-time display of incoming emergency calls
- **Quick Stats**: Overview of call volume, response times, and department loads
- **Status Indicators**: System health and connectivity status

### Call Management
- **Call History**: Browse all emergency call records
- **Search & Filter**: Find specific calls by date, department, criticality, etc.
- **Call Details**: Detailed view of conversation transcripts and AI analysis

### Analytics
- **Call Volume Charts**: Visualize call patterns over time
- **Department Distribution**: See which departments handle the most calls
- **Response Time Metrics**: Track system performance and response efficiency
- **Criticality Analysis**: Monitor high, medium, and low priority call distribution

### System Monitoring
- **Database Status**: Monitor conversation database health
- **AI Processing**: Track conversation analysis and processing times
- **Audio System**: Monitor microphone and voice processing status

## 🔌 API Integration

The dashboard integrates with the following backend endpoints:

### REST API Endpoints
- `GET /conversations` - Retrieve conversation history
- `POST /conversation` - Add new conversation records
- `GET /stats` - Get system statistics and metrics

### WebSocket Endpoints
- `/ws/calls` - Real-time call updates
- `/ws/system` - System status updates

## 🎨 Customization

### Styling
The dashboard uses CSS modules and can be customized by modifying files in the `src/styles/` directory.

### Components
Add new features by creating components in `src/components/` and integrating them into the main application.

### Charts and Visualizations
The dashboard uses Chart.js for data visualization. Customize charts in the `src/components/charts/` directory.

## 🧪 Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

### Code Formatting
```bash
npm run format
```

## 🔍 Troubleshooting

### Common Issues

#### Dashboard Not Loading
- Ensure Node.js and npm are properly installed
- Check that all dependencies are installed (`npm install`)
- Verify the backend API is running on the expected port

#### API Connection Issues
- Confirm the backend server is running (`uvicorn server:app --reload`)
- Check the API URL configuration in environment variables
- Verify CORS settings in the backend allow requests from the dashboard

#### Real-time Updates Not Working
- Ensure WebSocket connections are not blocked by firewall
- Check browser console for WebSocket connection errors
- Verify the backend WebSocket endpoint is accessible

#### Build Failures
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📱 Mobile Support

The dashboard is fully responsive and works on mobile devices. Key mobile features:
- Touch-friendly interface
- Responsive layouts that adapt to screen size
- Mobile-optimized charts and visualizations
- Swipe gestures for navigation

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Static Hosting
The built files in the `build/` directory can be deployed to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3
- Any web server

### Environment Variables for Production
Set appropriate environment variables for production deployment:
```env
REACT_APP_API_URL=https://your-api-domain.com
REACT_APP_WS_URL=wss://your-api-domain.com/ws
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/dashboard-improvement`)
3. Make your changes in the `dashboard/` directory
4. Test your changes (`npm test`)
5. Commit your changes (`git commit -m 'Add dashboard feature'`)
6. Push to the branch (`git push origin feature/dashboard-improvement`)
7. Open a Pull Request

## 📄 License

This dashboard is part of the EchoLink Dispatcher AI project, developed for academic purposes as a Final Year Project (FYP).

---

**Note**: This dashboard is designed for demonstration and educational purposes. For production emergency dispatch systems, additional security, accessibility, and compliance features would be required.
