import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Unauthorized</h1>
      <p className="mb-6 text-gray-700">
        You do not have permission to view this page.
      </p>
      <Link
        to="/auth"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Go to Login
      </Link>
    </div>
  );
};

export default Unauthorized;