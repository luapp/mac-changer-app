/*
* Copyright (c) 2025 Paul Le Gall. All Rights Reserved.
* Licensed See LICENSE file in the project root for details.
*/

import Navbar from '@ui/containers/Navbar';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-[var(--background)]">
        <Navbar />
      <h1 className="text-4xl font-bold text-red-600">404 - Not Found</h1>
      <p className="mt-4 text-lg text-gray-700">The page you are looking for does not exist.</p>
    </div>
  );
}

export default NotFound;
