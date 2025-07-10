# Emergency Dispatch System

This project contains an emergency dispatch system with voice processing and emotion detection capabilities.

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
