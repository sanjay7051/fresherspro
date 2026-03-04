import { Link } from "react-router-dom";

const MainHeader = () => {
    return (
        <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
            <div className="max-w-[1400px] mx-auto px-8 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3">
                    <img
                        src="/logo.png.png"
                        alt="FreshersPro Logo"
                        className="h-10 w-auto object-contain"
                    />
                    <span className="text-2xl font-bold tracking-tight">
                        FreshersPro
                    </span>
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-8 text-base font-medium">
                    <Link to="/" className="hover:text-gray-900 transition">
                        Home
                    </Link>

                    <Link to="/builder" className="hover:text-gray-900 transition">
                        Build Resume
                    </Link>

                    <Link to="/pricing" className="hover:text-gray-900 transition">
                        Pricing
                    </Link>
                </nav>

            </div>
        </header>
    );
};

export default MainHeader;