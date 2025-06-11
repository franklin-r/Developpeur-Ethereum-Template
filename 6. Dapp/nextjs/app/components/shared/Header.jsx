import Link from "next/link";

const Header = () => {
    return (
        <nav className="navbar">
            <div>Logo</div>
            {/* flex-between will be a custom class*/}
            {/* w-1/4 is a Tailwind class */ }
            <div className="flex-between w-1/4">
                {/* '/' redirects to app/page.js */}
                <Link href='/'>Home</Link>
                {/* "/cv" redirects to cv/page.js */}
                <Link href="/cv">CV</Link>
                {/* "/contact" redirects to contact/page.js */}
                <Link href="/contact">Contact</Link>
            </div>
        </nav>
    );
}

export default Header;