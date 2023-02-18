import Image from 'next/image'
import styles from '/styles/banner.module.css'
import risc_v from '/public/risc_v.png'
import CopyIcon from './copy-icon'
import x86 from "/public/x86.png";
import arm from "/public/arm.png";
import sparc from "/public/sparc.png";
import mips from "/public/mips.png";
import power from "/public/power.png";

export default function Banner({ resource }) {
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

        <>
            <CopyIcon>
                <h2 className='text-muted pe-3'>
                    {resource.id}
                </h2>
            </CopyIcon>

            <div className='d-flex align-items-center'>
                <h5 className='text-muted'>
                    {/* {resource.date_published} */}
                    Published 6 months ago
                </h5>
                <div className={styles.dot}></div>
                <h5 className='primary'>
                    {String(resource.category).charAt(0).toUpperCase()+String(resource.category).substring(1) ?? "Unknown"}
                </h5>
            </div>
            <div className='d-flex gap-4'>
                <p className="d-flex flex-row align-items-center gap-1">
                    <Image
                        src={getIcon(resource.architecture)}
                        alt={resource.architecture ?? "Unknown"}
                        height={15}
                    />
                    {resource.architecture}
                </p>

                <div className='d-flex flex-row gap-1'>
                    <h6 style={{ lineHeight: 'inherit', margin: '0' }}>
                        VERSION
                    </h6>
                    <p>
                        {resource.gem5_version}
                    </p>
                </div>
            </div>
        </>
    )
}