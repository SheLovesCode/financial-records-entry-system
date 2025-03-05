# Financial Records Entry System

This is a full-stack web application to manage financial transactions (credits and debits) on a single account. The project consists of three main parts:

- **Frontend**: A React (TypeScript) Single Page Application (SPA).
- **Backend**: A Flask (Python) RESTful API.
- **Database**: PostgreSQL for storing transaction data.

The application is dockerized for easy development.

## Project Overview

This project allows users to track financial transactions for a single account. Users can view a list of transactions, add new transactions, and view the running total of credits and debits.

### Features:
- View current account balance.
- Add, edit, and delete transactions (credits/debits).
- View individual transactions and all transactions.
- Real-time update of the account balance.

---

## Technologies Used

- **Frontend**: React, TypeScript, Material UI
- **Backend**: Flask, Python
- **Database**: PostgreSQL
- **Containerization**: Docker

---

## Installation

### Prerequisites

Make sure you have the following installed on your local machine:

- **Docker** (version 20.10 or higher) [Install Docker](https://docs.docker.com/get-docker/)
- - Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) for your operating system.
- **Docker Compose**  (Only required if your Docker Version is less than 20.10)
  [Install Docker Compose](https://docs.docker.com/compose/install/)

### Clone the Repository

Clone the repository to your local machine:

### 1. Clone the Repository
```bash
    git clone https://github.com/your-username/financial-records-entry-system.git
    cd financial-records-entry-system
```

### 2. Start the Services
Make sure you Docker Desktop is open.

Make sure no other connections are services are running on ports 80, 5432, 3000 and 4000

Run the following command to build and start the required services:
```bash
  docker compose up --build [If on Docker 20.10+]
  docker-compose up --build [If Docker version is below 20.10]
```
This will start the following services:
- PostgreSQL Database (Port: 5432)
- Nginx (Port: 80)
- FastAPI Service (Port: 4000 )
- React Frontend (Port: 3000)

The app runs on `http://localhost:3000/`

## Stopping the Services
To stop the running containers, use:
```bash
  docker compose down -v
  
          OR
          
  docker-compose down -v
```

## Troubleshooting
- If you encounter a 'Connection to server at "postgres", port 5432 failed' after running 
  ``docker compose up --build``
  1. Stop your containers by CTRL+Z
  2. Run ``docker compose up`` 

- Ensure all ports (5432, 4000, 3000, 8080) are free before starting the services.

**Author:** Diana Munyaradzi





