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
import { Badge, Button, Placeholder, Row } from 'react-bootstrap';
import invalid from "/public/null.svg";

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
                return invalid;
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
                    <h6 style={{ lineHeight: 'inherit', margin: '0' }} className="main-text-semi">
                        VERSION
                    </h6>
                    <Placeholder as="p" animation="glow" style={{ width: '40px' }}>
                        <Placeholder xs={12} />
                    </Placeholder>
                </div>
                <div className='d-flex flex-row gap-1 align-items-center'>
                    <h6 style={{ lineHeight: 'inherit', margin: '0' }} className="main-text-semi">
                        TAGS
                    </h6>
                    <Placeholder as="p" animation="glow" style={{ width: '40px' }}>
                        <Placeholder xs={12} />
                    </Placeholder>
                </div>
            </div>
        </> :
            <>
                <h2 className="main-text-title-bold text-muted" aria-label="Database Name">
                    {resource.database ? `${resource.database} /` : 'gem5-resources /'}
                </h2>
                <CopyIcon>
                    <h2 className='text-muted pe-3 mb-3 page-title' aria-label="Resource ID">
                        {resource.id}
                    </h2>
                </CopyIcon>

                <Button className={styles.expand_metadata} onClick={() => { setShowMetadata(true) }}>
                    <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" stroke='#0095AF'><path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z" /></svg>
                </Button>

                <div className='d-flex align-items-center gap-2 mb-2'>
                    <div className='d-flex align-items-center'>
                        <h5 className='text-muted secondary-text-semi mb-0 me-1'>
                            Category:
                        </h5>
                        {/* <div className={styles.dot}></div> */}
                        <h5 className='mb-0' style={{ fontSize: '0px' }}>
                            <Link href={`/category#${resource.category}`} className='primary secondary-text-semi' aria-label="Resource Category">
                                {String(resource.category).charAt(0).toUpperCase() + String(resource.category).substring(1) ?? "Unknown"}
                            </Link>
                        </h5>
                    </div>
                </div>
                <div className='d-flex gap-4 mb-2 flex-wrap'>
                    <p className="d-flex flex-row align-items-center gap-1 mt-0 mb-0 main-text-semi">
                        <Image
                            src={getIcon(resource.architecture)}
                            alt={resource.architecture ?? "Unknown"}
                            height={15}
                        />
                        <Link className='text-black interactDecoration' href={'/resources?q=architecture:' + resource.architecture} aria-label="Resource Architecture">
                            {resource.architecture ?? "NONE"}
                        </Link>
                    </p>
                    <div className='d-flex flex-row gap-1 align-items-center'>
                        <h6 style={{ lineHeight: 'inherit', margin: '0' }} className="main-text-semi">
                            VERSION
                        </h6>
                        <h6 className='text-black main-text-regular m-0' aria-label="Resource Version">
                            {resource.resource_version}
                        </h6>
                    </div>
                    <div className='d-flex flex-row gap-1 align-items-center' aria-label="Resource Tags">
                        <h6 style={{ lineHeight: 'inherit', margin: '0' }}>
                            TAGS
                        </h6>
                        {
                            resource.tags.length > 0 ? resource.tags.map((tag, index) => {
                                return (
                                    <Link key={tag}
                                        href={'/resources?q=tags:' + tag}
                                    >
                                        <Badge bg='primary' className='interactDecoration' aria-label={"Tag " + tag}>
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