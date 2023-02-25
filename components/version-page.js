import { Table } from "react-bootstrap"

export default function VersionPage({ versions, url }) {
    function versionComponent(version, link) {
        let svg = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" /></svg>

        if (!url) {
            url = ''
            svg = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z" /></svg>
        }
        link = url.replace('{url_base}', link)
        // TODO: get file size
        /* let size = 0
        fetch('https://cors-anywhere.herokuapp.com/' + link,
            { method: 'HEAD' }).then((response) => {
                console.log(response.headers.get('Content-Length'))
                // convert to MB
                size = response.headers.get('Content-Length') / 1000000
            }) */
        return (
            <tr>
                <td>
                    {version}
                </td>
                <td>
                    <a href={link}>
                        <div style={{ width: '16px', height: '16px' }}>
                            {svg}
                        </div>
                    </a>
                </td>
            </tr>
        )
    }

    return (
        <>
            <Table>
                <thead>
                    <tr>
                        <th>Version</th>
                        <th> </th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(versions).map((version) => {
                        return versionComponent(version, versions[version])
                    }
                    )}
                </tbody>
            </Table>
        </>
    )
}