import Topbar from './topbar'
import Footer from './footer'

export default function Layout({ children }) {
    return (
        <>
            <Topbar />
            <main>{children}</main>
            <Footer />
        </>
    )
}