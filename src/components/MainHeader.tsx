import { Link } from "react-router-dom";

const MainHeader = () => {
    return (
        <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3">
                    <img
                        src="/logo.png.png"
                        alt="FreshersPro Logo"
                        className="h-10 w-auto object-contain"
                    />
                    <span className="text-xl font-bold tracking-tight">
                        FreshersPro
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                    <Link to="/">Home</Link>
                    <Link to="/builder">Build Resume</Link>
                    <Link to="/pricing">Pricing</Link>
                </div>
            </div>
        </header>
    );
};

export default MainHeader;