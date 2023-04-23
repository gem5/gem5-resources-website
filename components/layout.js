import Topbar from './topbar'
import Footer from './footer'
import { Fade } from 'react-bootstrap'
import ScrollToTop from './scrollToTop'

/**
 * @component
 * @description This is the Layout component that wraps the entire application. It includes a Topbar and a Footer component and renders the children components passed in between them.
 * @param {ReactNode} children - The child components to be rendered between the Topbar and Footer components.
 * @returns {JSX.Element} - The JSX element representing the Layout component.
*/
export default function Layout({ children }) {
    return (
        <>
            <Topbar />
            <Fade in={true} appear={true} timeout={10}>
                <main style={{ minHeight: 'calc(100vh - 100px)' }} aria-label='main'>
                    {children}
                </main>
            </Fade>
            <ScrollToTop />
            <Footer />
        </>
    )
}