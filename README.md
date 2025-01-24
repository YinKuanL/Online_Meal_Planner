# Online Meal Planner API

## Project Overview
The **Online Meal Planner** is a dynamic web application that allows users to personalize their meal planning experience. Users can:
- Search for recipes based on their preferences.
- Save and download recipes for future use.
- View, add, and manage comments.
- Explore random recipe suggestions for variety.

---

## Features
- Interactive recipe management (CRUD operations).
- RESTful API for seamless client-server communication.
- User-friendly interface with responsive design.
- Background music and video integration.
- Local storage support for saving recipes.

---

## Technologies Used

### **Frontend (Client-Side)**
- **HTML5**: Structure of the web pages.
- **CSS3**: Styling and layout (with Bootstrap framework).
- **JavaScript**: Client-side interactivity.
- **jQuery**: Simplified DOM manipulation and AJAX requests.

### **Backend (Server-Side)**
- **Node.js**: Server runtime.
- **Express.js**: Framework for building RESTful APIs.
- **npm**: Package management.

---

## API Endpoints

### 1. **POST /save-recipe**
Save a new recipe to the database.

#### Request
- **Content-Type**: `application/json`
- **Body**:
  ```json
  {
    "recipe": "Pasta with Tomato Sauce"
  }
  ```

#### Response
- **200 OK**: Recipe saved successfully.
  ```json
  { "message": "Recipe saved successfully" }
  ```
- **400 Bad Request**: Invalid input.
  ```json
  { "error": "Recipe is required" }
  ```

### 2. **GET /recipe-details/:title**
Retrieve the details of a specific recipe by its title.

#### Response
- **200 OK**: Recipe details returned.
  ```json
  {
    "title": "Pasta with Tomato Sauce",
    "ingredients": ["Tomatoes", "Pasta", "Garlic"],
    "directions": ["Boil pasta", "Prepare sauce"]
  }
  ```
- **404 Not Found**: Recipe not found.
  ```json
  { "error": "Recipe not found" }
  ```

### 3. **PUT /recipe-details/:title**
Update an existing recipe.

#### Request
- **Content-Type**: `application/json`
- **Body**: Updated recipe details.

#### Response
- **200 OK**: Recipe updated successfully.
  ```json
  { "message": "Recipe updated successfully" }
  ```
- **404 Not Found**: Recipe not found.
  ```json
  { "error": "Recipe not found" }
  ```
- **500 Internal Server Error**: Error updating recipe.

### 4. **DELETE /recipe-details/:title**
Delete a specific recipe by its title.

#### Response
- **200 OK**: Recipe deleted successfully.
  ```json
  { "message": "Recipe deleted successfully" }
  ```
- **404 Not Found**: Recipe not found.

### 5. **GET /comments**
Fetch all comments.

#### Response
- **200 OK**: Comments retrieved successfully.
  ```json
  [
    {
      "name": "John",
      "comment": "Great recipe!",
      "timestamp": "2025-01-24T12:34:56.789Z"
    }
  ]
  ```
- **500 Internal Server Error**: Error loading comments.

### 6. **POST /comments**
Add a new comment.

#### Request
- **Content-Type**: `application/json`
- **Body**:
  ```json
  {
    "name": "John",
    "comment": "Great recipe!"
  }
  ```

#### Response
- **201 Created**: Comment added successfully.
  ```json
  {
    "name": "John",
    "comment": "Great recipe!",
    "timestamp": "2025-01-24T12:34:56.789Z"
  }
  ```
- **400 Bad Request**: Name and comment are required.
  ```json
  { "error": "Name and comment are required" }
  ```
- **500 Internal Server Error**: Error saving comment.

---

## Setup Guide

### Prerequisites
1. **Node.js**: Install from [Node.js official site](https://nodejs.org/).
2. **npm**: Verify installation:
   ```bash
   node -v
   npm -v
   ```

### Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/username/online-meal-planner.git
   ```
2. Navigate to the project directory:
   ```bash
   cd online-meal-planner
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application
Start the server:
```bash
node server.js
```
The application will run on `http://localhost:3001`.

---

## Debugging Tips
1. Use `console.log()` for debugging server and client code.
2. Check browser developer tools (F12) for network requests and console errors.
3. Ensure the Node.js server is running without errors in the terminal.

---

## License
This project is licensed under the MIT License.

---
