import Image from 'next/image'
import styles from '/styles/banner.module.css'
import risc_v from '/public/risc_v.png'
import CopyIcon from './copyIcon'
import x86 from "/public/x86.png";
import arm from "/public/arm.png";
import sparc from "/public/sparc.png";
import mips from "/public/mips.png";
import power from "/public/power.png";
import Link from 'next/link';
import { Badge, Placeholder, Row } from 'react-bootstrap';


/**
 * @component
 * @description A Banner that displays the resource's ID, category, architecture, and version.
 * @returns {JSX.Element} The JSX element to be rendered.
*/
export default function Banner({ resource, setShowMetadata }) {
    function getIcon(architecture) {
        switch (architecture) {
            case "X86":
                return x86;
            case "RISCV":
                return risc_v;
            case "ARM":
                return arm;
            case "SPARC":
                return sparc;
            case "MIPS":
                return mips;
            case "POWER":
                return power;
            default:
                return '';
        }
    }
    return (
        Object.keys(resource).length === 0 ? <>
            <Placeholder as="h2" animation="glow">
                <Placeholder xs={6} />
            </Placeholder>
            <Placeholder as="div" animation="glow" className='d-flex align-items-center mb-2 flex=grow-1'>
                <Placeholder as="h5" animation="glow" style={{ width: '10%' }}>
                    <Placeholder xs={12} />
                </Placeholder>
                <div className={styles.dot}></div>
                <Placeholder as="h5" animation="glow" style={{ width: '10%' }}>
                    <Placeholder xs={12} />
                </Placeholder>
            </Placeholder>
            <div className='d-flex gap-4 mb-2'>
                <div className="d-flex flex-row align-items-center gap-1 mt-0 mb-0">
                    <Placeholder as="p" animation="glow" style={{ width: '40px' }}>
                        <Placeholder xs={12} />
                    </Placeholder>
                    <Placeholder as="p" animation="glow" style={{ width: '40px' }}>
                        <Placeholder xs={12} />
                    </Placeholder>
                </div>
                <div className='d-flex flex-row gap-1'>
                    <h6 style={{ lineHeight: 'inherit', margin: '0' }}>
                        VERSION
                    </h6>
                    <Placeholder as="p" animation="glow" style={{ width: '40px' }}>
                        <Placeholder xs={12} />
                    </Placeholder>
                </div>
                <div className='d-flex flex-row gap-1'>
                    <h6 style={{ lineHeight: 'inherit', margin: '0' }}>
                        TAGS
                    </h6>
                    <Placeholder as="p" animation="glow" style={{ width: '40px' }}>
                        <Placeholder xs={12} />
                    </Placeholder>
                </div>
            </div>
        </> :
            <>
                <CopyIcon>
                    <h2 className='text-muted pe-3 mb-3'>
                        {resource.id}
                    </h2>
                </CopyIcon>

                <button className={styles.expand_metadata} onClick={() => { setShowMetadata(true) }}>
                    <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" stroke='#0095AF'><path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z" /></svg>
                </button>

                <div className='d-flex align-items-center mb-2'>
                    <h5 className='text-muted resource-date-published mb-0'>
                        {/* {resource.date_published} */}
                        Published 6 months ago
                    </h5>
                    <div className={styles.dot}></div>
                    <h5 className='mb-0' style={{ fontSize: '0px' }}>
                        <Link href={`/category/${resource.category}`} className='primary resource-category'>
                            {String(resource.category).charAt(0).toUpperCase() + String(resource.category).substring(1) ?? "Unknown"}
                        </Link>
                    </h5>
                </div>
                <div className='d-flex gap-4 mb-2'>
                    <p className="d-flex flex-row align-items-center gap-1 mt-0 mb-0">
                        <Image
                            src={getIcon(resource.architecture)}
                            alt={resource.architecture ?? "Unknown"}
                            height={15}
                        />
                        <Link className='text-decoration-none text-black' href={'/resources?q=architecture:' + resource.architecture}>
                            {resource.architecture}
                        </Link>
                    </p>
                    <div className='d-flex flex-row gap-1'>
                        <h6 style={{ lineHeight: 'inherit', margin: '0' }}>
                            VERSION
                        </h6>
                        {
                            resource.versions && resource.versions.length === 0 ? "None" :
                                <Link className='text-decoration-none text-black' href={'/resources?q=versions:' + (resource.versions && (resource.versions.length > 1 ? resource.versions[1].version : resource.versions[0].version))}>
                                    {
                                        resource.versions && (resource.versions.length > 1 ? resource.versions[1].version : resource.versions[0].version)
                                    }
                                </Link>
                        }
                    </div>
                    <div className='d-flex flex-row gap-1'>
                        <h6 style={{ lineHeight: 'inherit', margin: '0' }}>
                            TAGS
                        </h6>
                        {
                            resource.tags ? resource.tags.map((tag, index) => {
                                return (
                                    <Link key={tag}
                                        href={'/resources?q=tags:' + tag}
                                    >
                                        <Badge pill bg='primary' >
                                            {tag}
                                        </Badge>
                                    </Link>
                                )
                            }) : "None"
                        }
                    </div>
                </div>
            </>
    )
}