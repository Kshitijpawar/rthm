# RTHM Web App

## Overview
The **Setlist Web App** is a full-stack web application designed for creating, sharing, and managing setlists. Additionally, it incorporates authentication to ensure secure access for authenticated users only.

## Images
<div style="display: flex; flex-wrap: wrap; gap: 10px;">
  <img src="images/Screenshot 2024-12-28 at 10.30.26 PM.png" alt="homepage" width="100%">
  <img src="images/Screenshot 2024-12-28 at 10.32.47 PM.png" alt="setlistdetails" width="100%">
  <img src="images/Screenshot 2024-12-28 at 10.30.00 PM.png" alt="screenshot1" width="100%">
  <img src="images/Screenshot 2024-12-28 at 10.30.41 PM.png" alt="screenshot2" width="50%">
  <img src="images/Screenshot 2024-12-28 at 10.39.46 PM.png" alt="screenshot2" width="45%">
</div>



## Features
1. **Home Page**
   - A welcoming landing page introducing users to the app's features.

2. **View Setlists**
   - List all existing setlists stored in the Firebase Realtime Database.
   - View details of individual setlists, including the performance date and song list.

3. **Create Setlists**
   - Create new setlists with a name, performance date, and a collection of songs.
   - Update the Firebase Realtime Database with new setlist entries.

4. **Edit Setlists**
   - Edit existing setlists, allowing updates to song details or setlist metadata.
   - Provides an `Edit` button on the setlist details page for seamless modifications.

5. **Song Details**
   - View individual song attributes, including:
     - Spotify and YouTube links embedded for easy access.
     - Downloadable chord files for guitar, piano, and ukulele hosted on Supabase Storage.

6. **Protected Routes**
   - All application routes are protected using Firebase Authentication.
   - Only authenticated users can access and interact with the app's features.

## Technologies Used
### Frontend:
- **ReactJS**: Used for creating dynamic, reusable components and managing application state.
- **React Router**: For routing and navigation between pages.

### Backend:
- **Firebase Realtime Database**: Stores and manages JSON-structured data for setlists and songs.
- **Supabase Storage**: Hosts chord files for different instruments.
- **Firebase Authentication**: Manages user login and access control.

### Deployment:
- **Firebase Hosting**: Ensures fast and reliable deployment of the web application.

## Getting Started
### Prerequisites:
- Node.js

### Setup Instructions:
1. Clone the repository:
   ```bash
   git clone https://github.com/Kshitijpawar/rthm.git
   ```
2. Navigate to the project directory:
   ```bash
   cd pdf-crud-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure Firebase credentials in `.env` file.
5. Run the app:
   ```bash
   npm start
   ```
6. Access the app at `http://localhost:3000`.


---

Feel free to explore the app and contribute to its development! Contact me for collaborations or feedback.

---
**Author**: Kshitij Pawar
