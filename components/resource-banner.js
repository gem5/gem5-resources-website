import Image from 'next/image'
import styles from '/styles/banner.module.css'
import risc_v from '/public/risc_v.png'
import CopyIcon from './copy-icon'

export default function Banner({ resource }) {
    return (
        <div className={styles.banner}>
            <h1 className='text-muted'>
                {resource.id} <CopyIcon text={resource.id} />
            </h1>
            <div className='d-flex align-items-center'>
                <h5 className='text-muted'>
                    {/* {resource.date_published} */}
                    Published 6 months ago
                </h5>
                <div className={styles.dot}></div>
                <h5 className='primary'>
                    {resource.author ?? "Unknown"}
                </h5>
            </div>
            <div className='d-flex gap-4'>
                <p className="d-flex flex-row align-items-center gap-1">
                    <Image
                        src={risc_v}
                        alt="Gem5 Logo"
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
        </div>
    )
}