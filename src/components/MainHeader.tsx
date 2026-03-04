import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const MainHeader = () => {
    return (
        <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur-md">

            <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-3">
                    <img
                        src="/logo.png.png"
                        alt="FreshersPro"
                        className="h-10 w-auto object-contain"
                    />

                    <span className="text-xl font-bold text-primary">
                        FreshersPro
                    </span>
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">

                    <Link to="/" className="hover:text-black transition">
                        Home
                    </Link>

                    <Link to="/builder" className="hover:text-black transition">
                        Build Resume
                    </Link>

                    <Link to="/ats" className="hover:text-black transition">
                        ATS Checker
                    </Link>

                </nav>

                {/* Button */}
                <Link to="/builder">
                    <Button size="sm">
                        Build Resume
                    </Button>
                </Link>

            </div>

        </header>
    );
};

export default MainHeader;