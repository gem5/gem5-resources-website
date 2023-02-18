import Link from "next/link";
import x86 from "/public/x86.png";
import risc_v from "/public/risc_v.png";
import Image from "next/image";
import arm from "/public/arm.png";
import sparc from "/public/sparc.png";
import mips from "/public/mips.png";
import power from "/public/power.png";

export default function SearchResult({ resource }) {
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
        <div className="search-result">
            <Link href={'/resources/' + resource.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="search-result__title">
                    <h4>{resource.id}</h4>
                </div>
                <div className="search-result__description">
                    <p>{resource.description}</p>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <div className="d-flex gap-1 align-items-center">
                        <Image
                            src={getIcon(resource.architecture)}
                            alt={resource.architecture ?? "Unknown"}
                            width={20}
                            className="mb-3"
                        />
                        <p>
                            {resource.architecture ?? "Unknown"}
                        </p>
                    </div>
                    <p className="text-capitalize fw-light">
                        {resource.category}
                    </p>
                    <p className="fw-light">
                        {resource.license ?? "Unknown"}
                    </p>
                </div>
            </Link>
        </div>
    )
}