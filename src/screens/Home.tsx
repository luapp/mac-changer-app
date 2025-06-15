/*
* Copyright (c) 2025 Paul Le Gall. All Rights Reserved.
* Licensed See LICENSE file in the project root for details.
*/

import { ShieldOff } from "lucide-react";
import { Button } from '@ui/core/Button';
import { P, H1, H2, H3, H4, H5 } from '@ui/core/Text';
import Navbar from '@ui/containers/Navbar';


const Home = () => {
    return (
        <div className="flex flex-col items-center min-h-screen bg-[var(--background)]">
            <Navbar />
            <ShieldOff className="w-21 h-21 text-red-500 mx-auto mt-12" />
            <H1 className="mt-6 text-4xl font-bold text-[var(--text)]">Protection Inactive</H1>
            <P className="text-[var(--text)] mt-3">Enable protection to spoof your MAC adress</P>
            <Button variant="primary" onClick={() => alert('Button Clicked!')}>
                Click Me
            </Button>
        </div>
    );
}

export default Home;
