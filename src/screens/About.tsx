/*
* Copyright (c) 2025 Paul Le Gall. All Rights Reserved.
* Licensed See LICENSE file in the project root for details.
*/

import Navbar from '@ui/containers/Navbar';

const About = () => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
        <Navbar />
      <h1 className="text-4xl font-bold mb-4">About Us</h1>
      <p className="text-lg text-gray-700">
        This is a simple React application using Vite, Tailwind CSS, and TypeScript.
      </p>
      <p className="text-lg text-gray-700 mt-2">
        It serves as a template for building modern web applications.
      </p>
    </div>
  );
}

export default About;
