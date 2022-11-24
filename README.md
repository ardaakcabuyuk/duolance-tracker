# Duolance Tracker

## Running the Application

In the project directory, you can run:

### `npm run start`

Runs the app in the production mode.

The page will reload when you make changes.
You may also see any lint errors in the console.

### `npm run start:dev `

Runs the app in the production mode.


## Building the Application

To build the application, one should first build the screenshot service.

In the /capture_service directory, run:

### `python -m PyInstaller capture.py`

Then, build the electron application. To do this, run:

### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

This command also packages the application to the `dist` folder for distribution.
