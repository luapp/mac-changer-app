/*
* Copyright (c) 2025 Paul Le Gall. All Rights Reserved.
* Licensed See LICENSE file in the project root for details.
*/

import { ShieldOff } from "lucide-react";
import { P, H1, H2, H3, H4, H5 } from '@ui/core/Text';
import { Container } from '@ui/core/Container';
import { Toggle } from "@ui/shared/Toggle";
import Navbar from '@ui/containers/Navbar';
import React, { useState } from 'react';

const Home = () => {
    const [protectionEnabled, setProtectionEnabled] = useState(false);
  
    const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setProtectionEnabled(event.target.checked);
      console.log(`Protection is now ${event.target.checked ? 'enabled' : 'disabled'}`);
    };
  
    return (
      <div className="flex flex-col items-center min-h-screen bg-[var(--background)]">
        <Navbar />
        <ShieldOff className="w-21 h-21 text-red-500 mx-auto mt-12" />
        <H1 className="mt-6 text-4xl font-bold text-[var(--text)]">Protection Inactive</H1>
        <P className="text-[var(--text)] mt-3">Enable protection to spoof your MAC address</P>
        <Container className="mt-4 max-w-2xl text-center">
          <H2 className="text-3xl font-semibold text-[var(--text)]">Welcome to the Home Page</H2>
          <P className="text-lg text-[var(--text)] mt-2">
            This is a simple React application using Vite, Tailwind CSS, and TypeScript.
          </P>
          <Toggle
            id="protection-toggle"
            className="mt-6 pb-6 border-b border-[var(--text)] justify-center"
            checked={protectionEnabled}
            onChange={handleToggleChange}
            size="lg"
        />
            <H3 className="text-2xl font-semibold text-[var(--text)] mt-4">Toggle Protection</H3>
            <P className="text-lg text-[var(--text)] mt-2">
                Use the toggle above to enable or disable MAC address protection.
            </P>
            <H4 className="text-xl font-semibold text-[var(--text)] mt-4">Features</H4>
            <P className="text-lg text-[var(--text)] mt-2">
                This application serves as a template for building modern web applications with React.
            </P>
            <H5 className="text-lg font-semibold text-[var(--text)] mt-4">Get Started</H5>
            <P className="text-md text-[var(--text)] mt-2">
                Explore the features and customize the application to suit your needs.
            </P>
        </Container>
      </div>
    );
}


export default Home;
