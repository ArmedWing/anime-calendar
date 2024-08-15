This is my project for SoftUni ReactJS course.

The idea is for the user to be able to search for an anime, see details about it, add it to his profile and keep track of the episodes watched. There is also a forum where users can discuss different topics.

The project uses the React library for the front end and firebase as db and authentication.
For for form validation I use yup library.
For the anime search I use jikan API.

The project is split into private and public part. When you are not logged in, you can only search for anime and see its details, but not add it to profile, keep track of episodes watcher or create thread or comment.

The project also has: 
ErrorBoundary: designed to catch JavaScript errors anywhere in the child component tree, log those errors, and display a fallback UI.

Message component: displays to the users certain messages when he does something (eg add/delete anime in profile)

Page404 component: representing a "Page Not Found" error page.

Auth guard: prevents routes being accessed by not logged in user.

AlreadyAuthenticatedGuard Guard: Prevents the user to go to login and register page when already logged in.
