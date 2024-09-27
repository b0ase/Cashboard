import Link from 'next/link';

const Header = () => {
    return (
        <header>
            <h1>Welcome to My Website</h1>
            <nav>
                <ul>
                    <li><Link href="/"><a>Home</a></Link></li>
                    <li><Link href="/about"><a>About</a></Link></li>
                    <li><Link href="/services"><a>Services</a></Link></li>
                    <li><Link href="/contact"><a>Contact</a></Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;