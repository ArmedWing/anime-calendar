This is my project for SoftUni ReactJS course.

The idea is for the user to be able to search for an anime, see details about it, add it to his profile and keep track of the episodes watched. There is also a forum where users can discuss different topics.

The project uses the React library for the front end and firebase as db and authentication. For for form validation I use yup library. For the anime search I use jikan API.

The project is split into private and public part. When you are not logged in, you can only search for anime and see its details, but not add it to profile, keep track of episodes watcher or create thread or comment.

The project also has: ErrorBoundary: designed to catch JavaScript errors anywhere in the child component tree, log those errors, and display a fallback UI.

Message component: displays to the users certain messages when he does something (eg add/delete anime in profile)

Page404 component: representing a "Page Not Found" error page.

Auth guard: prevents routes being accessed by not logged in user.

AlreadyAuthenticatedGuard Guard: Prevents the user to go to login and register page when already logged in.

Implemented Pagination

![2024-08-15 18_18_49-Window](https://github.com/user-attachments/assets/1d8de431-287f-4e25-a617-faedb8dbfa8c)
![2024-08-15 18_20_26-Window](https://github.com/user-attachments/assets/7e8f01ae-3921-48cc-868b-8f871cb1c85a)
![2024-08-15 18_20_47-Window](https://github.com/user-attachments/assets/f6c05554-2ad4-4daa-9a69-f360a7b2a73c)
![2024-08-15 18_26_00-Window](https://github.com/user-attachments/assets/749bd637-cfb6-45eb-a72f-3b7a0d266dda)
![2024-08-15 18_25_54-Window](https://github.com/user-attachments/assets/d452b7eb-71a0-4e8a-8b81-5d932b5a1169)
![2024-08-15 18_25_44-Window](https://github.com/user-attachments/assets/a564d234-825d-4d97-a56e-f7ea65191b3c)
![2024-08-15 18_25_25-Window](https://github.com/user-attachments/assets/db5128b3-bff5-4875-a213-31b8752885af)
![2024-08-15 18_24_42-Window](https://github.com/user-attachments/assets/25ac6773-6498-4501-8856-28da0109e3da)
