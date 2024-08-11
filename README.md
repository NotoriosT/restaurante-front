
# Restaurant Control System

## Overview

The Restaurant Control System is a real-time application designed to streamline the management of orders in a restaurant. The system allows waiters to place orders that are instantly sent to the kitchen and bar sections. Additionally, managers can oversee and control all operations within the restaurant through a dedicated dashboard.

### Key Features

- **Real-time Order Management:** Waiters can place and manage orders, which are updated instantly across the system.
- **Kitchen and Bar Displays:** Orders are automatically routed to the appropriate section (kitchen or bar) based on the items ordered.
- **Manager Dashboard:** Managers have comprehensive control and visibility over all restaurant operations.
- **WebSocket Integration:** Ensures real-time communication and updates between the frontend and backend.
- **MongoDB:** Efficiently stores orders, menus, and user data.

### Technologies Used

- **Frontend:** React (bootstrapped with Create React App)
- **Backend:** Spring Boot
- **Database:** MongoDB
- **Real-Time Communication:** WebSocket

## Getting Started

To get started with the project, follow these steps:

### Prerequisites

- Node.js
- npm
- Java (for running the Spring Boot backend)
- MongoDB

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/restaurant-control-system.git
   cd restaurant-control-system
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Open your browser and navigate to:

   ```
   http://localhost:3000
   ```

   The application should be running in development mode.

## Running the Backend

Ensure that the Spring Boot backend and MongoDB are running for the full functionality of the application.

## Adding a GIF Demo

If you have a GIF that demonstrates the functionality of the application, you can include it here:

![Restaurant Control System Demo](Projeto%20de%20Vídeo.gif)

## Available Scripts

In the project directory, you can run:

- **`npm start`**: Runs the app in development mode.
- **`npm test`**: Launches the test runner in interactive watch mode.
- **`npm run build`**: Builds the app for production.
- **`npm run eject`**: Ejects the configuration files to allow full control.

## Learn More

To learn more about React, check out the [React documentation](https://reactjs.org/). For more details on how this project was set up, refer to the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).
