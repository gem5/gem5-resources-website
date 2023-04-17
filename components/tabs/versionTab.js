import Link from "next/link";
import { useEffect, useState } from "react";
import { Overlay, OverlayTrigger, Popover, Table } from "react-bootstrap"
import CopyIcon from "../copyIcon";
import styles from '/styles/versionpage.module.css'
import getVersions from "@/pages/api/getVersions";

/**
* @component
* @description This component renders a version component that displays
* the size of a file in different units (B, KB, MB, etc.).
* It also includes icons for downloading, code and cross, which render differently depending on information.
* @param {Object} props - The props object.
* @param {number} props.version - The version number of the file.
* @returns {JSX.Element} - The JSX element representing the version component.
*/

function VersionComponent({ version }) {
    function sizeof_fmt(num, suffix = 'B') {
        const units = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z'];
        let i = 0;
        while (Math.abs(num) >= 1024.0 && i < units.length - 1) {
            num /= 1024.0;
            i++;
        }
        return `${num.toFixed(1)} ${units[i]}${suffix}`;
    }

    let downloadSvg = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="24px" height="24px" fill='#0095AF'><path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" /></svg>
    let documentSvg = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px" fill='#0095AF'><path d="M13.744 8s1.522-8-3.335-8h-8.409v24h20v-13c0-3.419-5.247-3.745-8.256-3zm4.256 11h-12v-1h12v1zm0-3h-12v-1h12v1zm0-3h-12v-1h12v1zm-3.432-12.925c2.202 1.174 5.938 4.883 7.432 6.881-1.286-.9-4.044-1.657-6.091-1.179.222-1.468-.185-4.534-1.341-5.702z" /></svg>
    let addToCartSvg = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px" fill='#0095AF'><path d="M10.975 8l.025-.5c0-.517-.067-1.018-.181-1.5h5.993l-.564 2h-5.273zm-2.475 10c-.828 0-1.5.672-1.5 1.5 0 .829.672 1.5 1.5 1.5s1.5-.671 1.5-1.5c0-.828-.672-1.5-1.5-1.5zm11.305-15l-3.432 12h-10.428l-.455-1.083c-.323.049-.653.083-.99.083-.407 0-.805-.042-1.191-.114l1.306 3.114h13.239l3.474-12h1.929l.743-2h-4.195zm-6.305 15c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5c0-.828-.672-1.5-1.5-1.5zm-4.5-10.5c0 2.485-2.018 4.5-4.5 4.5-2.484 0-4.5-2.015-4.5-4.5s2.016-4.5 4.5-4.5c2.482 0 4.5 2.015 4.5 4.5zm-2-.5h-2v-2h-1v2h-2v1h2v2h1v-2h2v-1z" /></svg>
    let inCartSvg = <svg xmlns="http://www.w3.org/2000/svg" fill='#0095AF'><path d="M13.5 18c-.828 0-1.5.672-1.5 1.5 0 .829.672 1.5 1.5 1.5s1.5-.671 1.5-1.5c0-.828-.672-1.5-1.5-1.5zm-3.5 1.5c0 .829-.672 1.5-1.5 1.5s-1.5-.671-1.5-1.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5zm13.257-14.5h-1.929l-3.473 12h-13.239l-4.616-11h2.169l3.776 9h10.428l3.432-12h4.195l-.743 2zm-13.537 4.183l-2.325-2.183-1.395 1.435 3.746 3.565 6.559-6.592-1.422-1.408-5.163 5.183z" /></svg>
    let codeSvg = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="24px" height="24px" fill='#0095AF'><path d="M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z" /></svg>
    let crossSvg = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="24px" height="24px" fill='#0095AF'><path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z" /></svg>

    const [downloadUrl, setDownloadUrl] = useState('')

    useEffect(() => {
        if (!version.url) {
            return setDownloadUrl('')
        }
        // link = url.replace('{url_base}', link)
        // link = link.replace('http://', 'https://')
        setDownloadUrl(version.url)
    }, [version])

    return (
        <tr className={styles.versions_tr} key={version.resource_version}>
            <td className={`${styles.versions_td} main-text-regular`}>
                <a href={process.env.BASE_PATH + '/resources/' + version.id + "?database=" + version.database + "&version=" + version.resource_version} className="interactDecoration">
                    {version.resource_version}
                </a>
            </td>
            <td className={`${styles.versions_td} main-text-regular`}>
                {sizeof_fmt(version.size ?? 0)}
            </td>
            <td className={`${styles.versions_td} main-text-regular`}>
                {version.gem5_versions.sort().join(', ')}
            </td>

            <td style={{ width: '24px', height: '24px' }} className={styles.versions_td}>
                {version.url ?
                    <Link href={downloadUrl} download target="_blank" className="interactDecoration">
                        {downloadSvg}
                    </Link>
                    :
                    <div className={styles.icon_wrapper_div}>
                        {crossSvg}
                    </div>
                }
            </td>
            <td style={{ width: '24px', height: '24px' }} className={styles.versions_td}>
                {version.url ?
                    <div className={styles.icon_wrapper_div}>
                        <OverlayTrigger trigger="click" placement="bottom" overlay={
                            <Popover id="popover-basic" >
                                <Popover.Header as="h3">Download via Terminal</Popover.Header>
                                <Popover.Body>
                                    <CopyIcon>
                                        <code style={{ display: 'block' }}>
                                            {"wget " + downloadUrl}
                                        </code>
                                    </CopyIcon>
                                </Popover.Body>
                            </Popover>
                        }
                            rootClose>
                            {codeSvg}
                        </OverlayTrigger>
                    </div>
                    : null}
            </td>
            {/* <td style={{ width: '24px', height: '24px' }} className={styles.versions_td}>
                <div className={styles.icon_wrapper_div}>
                    {addToCartSvg}
                </div>
            </td> */}
        </tr>
    )
}


/**
 * @component
 * @description This component renders a table of versions with relevant information
 * such as version number, size, gem5 versions, and links.
 * It retrieves the versions data from the provided database based on the given ID prop
 * and renders VersionComponent for each version.
 * If there are no versions available, an empty fragment is returned.
 * @param {Object} props - The props object.
 * @param {string} props.id - The ID prop used to retrieve versions data from the database.
 * @param {Object} props.database - The database object used to fetch versions data.
 * @returns {JSX.Element} - The JSX element representing the table of versions.
 */

export default function VersionTab({ id, database }) {
    const [versions, setVersions] = useState([])

    useEffect(() => {
        getVersions(id, database).then((data) => {
            setVersions(data)
        })
    }, [id, database])

    return (
        versions.length === 0 ? <></> :
            <>
                <Table>
                    <thead>
                        <tr>
                            <th>Version</th>
                            <th>Size</th>
                            <th>gem5 Versions</th>
                            <th colSpan={3}>Links</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            versions.map((v) => (
                                <VersionComponent key={v.resource_version} version={v} />
                            ))
                        }
                    </tbody>
                </Table>
            </>
    )
}