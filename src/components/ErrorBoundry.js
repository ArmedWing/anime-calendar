// import React, { Component } from "react";
// // Create and import 404 page component here

// export default class ErrorBoundary extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       hasError: false,
//     };
//   }

//   static getDerivedStateFromError(err) {
//     console.log("GetDerivedStateFromError");
//     return {
//       hasError: true,
//     };
//   }

//   componentDidCatch(error, errorInfo) {
//     console.log("componentDidCatch");
//   }

//   render() {
//     if (this.state.hasError) {
//       return <NotFound />;
//     }

//     return this.props.children;
//   }
// }
