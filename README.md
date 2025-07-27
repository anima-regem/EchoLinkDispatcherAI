# Emergency Dispatch System

This project contains an emergency dispatch system with voice processing and emotion detection capabilities.

[Demo Link](https://drive.google.com/drive/folders/1UXvCT3i_mLXsq-LlsBlUWISvPUGhwtNz?usp=drive_link)


## ▶️ Running the App

### Quick Start (Recommended)
The easiest way to run the EchoLink Dispatcher AI is through the desktop application:

```bash
# 1. Activate your virtual environment
source myenv/bin/activate

# 2. Run the main application
python userinterface.py
```

This launches the full-featured PyQt5 desktop application that includes:
- **Emergency Call Interface**: Start and manage voice calls
- **Real-time Processing**: Live conversation monitoring and AI analysis
- **Dashboard**: View call history, analytics, and statistics
- **Database Management**: Browse and manage conversation records
- **Settings**: Configure audio, AI parameters, and user preferences



## Project Structure

- `dashboard/client` - Next.js frontend application (Git submodule)
- `hume/` - Hume AI voice processing integration
- Main Python scripts for voice processing and dispatch logic

## Working with the Client Submodule

The `dashboard/client` folder is configured as a Git submodule pointing to the EchoLinkDemo repository.

### Initial Setup
When cloning this repository, initialize and update submodules:
```bash
git clone <repository-url>
git submodule init
git submodule update
```

Or clone with submodules in one command:
```bash
git clone --recurse-submodules <repository-url>
```

### Updating the Submodule
To update the client submodule to the latest version:
```bash
cd dashboard/client
git pull origin main
cd ../..
git add dashboard/client
git commit -m "Update client submodule"
```

### Working on the Client Code
Navigate to the submodule directory to work on the client code:
```bash
cd dashboard/client
# Make changes, commit, and push as normal
git add .
git commit -m "Your changes"
git push origin main
```

Then update the main repository to point to the new commit:
```bash
cd ../..
git add dashboard/client
git commit -m "Update client submodule to include latest changes"
```


## 🧪 Development

### Running Tests
```bash
# Activate virtual environment
source myenv/bin/activate

# Run tests (if test files exist)
python -m pytest tests/
```

### Development Mode
```bash
# Run with auto-reload
uvicorn server:app --reload

# Run Next.js in development
cd dashboard/client
npm run dev
```

### Adding New Features
1. **Voice Processing**: Modify `main.py`
2. **UI Components**: Update `userinterface.py` (PyQt5) or dashboard files (React)
3. **API Endpoints**: Add routes to `server.py`
4. **AI Analysis**: Update prompt engineering in `get_conversation()` function

## 🔍 Troubleshooting

### Common Issues

#### SSL Certificate Errors (macOS)
```bash
# Run certificate installer
/Applications/Python\ 3.11/Install\ Certificates.command

# Update certifi
pip install --upgrade certifi
```

#### Microphone Not Working
- Check system microphone permissions
- Verify audio device in system preferences
- Test with other audio applications

#### API Connection Issues
- Verify API keys in `.env` file
- Check internet connection
- Ensure API quotas aren't exceeded

#### Import Errors
```bash
# Reinstall dependencies
pip install --force-reinstall -r requirements.txt
```

#### Database Issues
```bash
# Reset database
rm conversation.db
python main.py  # Will recreate tables
```

### Debug Mode
Enable verbose logging by adding debug prints or using Python's logging module.

## 📁 File Structure

```
EchoLinkDispatcherAI/
├── main.py                 # Core voice processing logic
├── userinterface.py        # PyQt5 desktop application
├── server.py              # FastAPI backend server
├── agents.py              # AI agent configurations
├── mic.py                 # Microphone utilities
├── table.py               # Database table management
├── requirements.txt       # Python dependencies
├── Pipfile                # Pipenv configuration
├── Dockerfile             # Docker containerization
├── .env                   # Environment variables (create this)
├── conversation.db        # SQLite database (auto-generated)
├── conversations.txt      # Raw conversation transcripts
├── icons/                 # UI icons and assets
├── myenv/                 # Python virtual environment
├── hume/                  # Hume AI SDK files
└── dashboard/             # Web dashboard
    ├── src/               # React source files
    ├── client/            # Next.js client application (Git submodule)
    ├── package.json       # Node.js dependencies
    └── public/            # Static assets
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is part of a Final Year Project for academic purposes.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section above
2. Open an issue on GitHub
3. Verify all prerequisites are installed
4. Ensure API keys are correctly configured

## 🔗 API Endpoints

### FastAPI Endpoints
- `GET /conversations` - Retrieve all conversations
- `POST /conversation` - Add new conversation record

### Web Dashboard Features
- Real-time conversation monitoring
- Analytics and reporting
- Emergency call prioritization
- Department routing interface
- OpenStreetMap integration for location tracking
- Emotion detection from voice analysis

---

**Note**: This system is designed for educational and demonstration purposes. For production emergency dispatch systems, additional security, reliability, and compliance measures would be required.

