import { Link } from "react-router-dom";

const MainHeader = () => {
    return (
        <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
            <div className="max-w-[1700px] mx-auto px-6 py-5 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-3">
                    <img
                        src="/logo.png.png"
                        alt="FreshersPro Logo"
                        className="h-11 w-auto object-contain"
                    />
                    <span className="text-2xl font-bold tracking-tight">
                        FreshersPro
                    </span>
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-10 text-base font-medium text-gray-700">
                    <Link to="/" className="hover:text-black transition">
                        Home
                    </Link>

                    <Link to="/builder" className="hover:text-black transition">
                        Build Resume
                    </Link>

                    <Link to="/pricing" className="hover:text-black transition">
                        Pricing
                    </Link>
                </nav>

            </div>
        </header>
    );
};

export default MainHeader;