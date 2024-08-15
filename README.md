# Anime Tracker Project

This project was developed as part of the SoftUni ReactJS course.

## Project Overview

The main purpose of this project is to allow users to search for anime, view detailed information, add anime to their profile, and keep track of watched episodes. Additionally, users can engage in discussions through the forum.

### Key Features

- **Anime Search:** Users can search for anime using the Jikan API and view detailed information about each anime.
- **Profile Management:** Logged-in users can add anime to their profile and track episodes they've watched.
- **Forum:** A platform where users can discuss various topics related to anime.
- **Form Validation:** Implemented using the Yup library to ensure data integrity in forms.

### Public vs. Private Access

- **Public Access:**
  - Search for anime and view details.
- **Private Access (Logged-in Users):**
  - Add anime to profile and track watched episodes.
  - Create and participate in forum threads and comments.

## Additional Features

- **ErrorBoundary:** Catches JavaScript errors in the component tree, logs them, and displays a fallback UI to the user.
- **Message Component:** Provides feedback to the user for actions such as adding or deleting anime from their profile.
- **Page404 Component:** Displays a "Page Not Found" error page for invalid routes.
- **AuthGuard:** Protects routes from being accessed by users who are not logged in.
- **AlreadyAuthenticatedGuard:** Prevents logged-in users from accessing the login and register pages.
- **Pagination:** Implemented to handle large sets of data efficiently.

## Technologies Used

- **React:** For building the front-end of the application.
- **Firebase:** Used for database management and user authentication.
- **Yup:** For form validation.
- **Jikan API:** For fetching anime data.

![2024-08-15 18_18_49-Window](https://github.com/user-attachments/assets/1d8de431-287f-4e25-a617-faedb8dbfa8c)
![2024-08-15 18_20_26-Window](https://github.com/user-attachments/assets/7e8f01ae-3921-48cc-868b-8f871cb1c85a)
![2024-08-15 18_20_47-Window](https://github.com/user-attachments/assets/f6c05554-2ad4-4daa-9a69-f360a7b2a73c)
![2024-08-15 18_26_00-Window](https://github.com/user-attachments/assets/749bd637-cfb6-45eb-a72f-3b7a0d266dda)
![2024-08-15 18_25_54-Window](https://github.com/user-attachments/assets/d452b7eb-71a0-4e8a-8b81-5d932b5a1169)
![2024-08-15 18_25_44-Window](https://github.com/user-attachments/assets/a564d234-825d-4d97-a56e-f7ea65191b3c)
![2024-08-15 18_25_25-Window](https://github.com/user-attachments/assets/db5128b3-bff5-4875-a213-31b8752885af)
![2024-08-15 18_24_42-Window](https://github.com/user-attachments/assets/25ac6773-6498-4501-8856-28da0109e3da)
