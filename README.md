# hng-0
# HNG Stage 0 API

A simple REST API that returns personal information including email, current datetime, and GitHub repository URL.

## Prerequisites

Before you begin, make sure you have the following prerequisites installed on your system:

- Node.js and npm: Download and install Node.js from [nodejs.org](https://nodejs.org/).

## Installation

Install project dependencies using npm :
   ```bash
   npm install
   ```

### Local Development Setup
Clone the repository: 
  ```bash
   `git clone https://github.com/mercyio/hng-0.git`
   ```


Navigate to project directory:
  ```bash
    `cd stage-0`
   ```


Install dependencies: 
 ```bash
    `npm install`
   ```
OR

Install project dependencies using yarn :
```bash
yarn install
```

### Start the Project

Once you've done your installation setup, you can start your project:

```bash 
npm run start:dev
```
Your backend server should now be running.


## API Documentation

### Endpoint
Production: GET/`https://my-deployed-url.com`
Local: GET/`http://localhost:3000`

### Base URL
The API will be running at:
Production: `https://my-deployed-url.com`
Local: `http://localhost:3000`

### Example Request 
Using Browser
Simply visit `http://localhost:3000` in your web browser

Using cURL
curl `http://localhost:3000`

Using Postman
Open Postman
Create a new GET request
Enter URL: `http://localhost:3000`
Make sure your code is running
Click Send
View the JSON response

### Example Response

```json
{
  "statusCode": 200,
  "data": {
    "email": "mercydanke@gmail.com",
    "current_datetime": "2023-09-08T12:34:56Z",
    "github_url": "https://github.com/mercyio/hng-0"
  }
}

