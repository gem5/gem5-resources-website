import Link from "next/link";

export default function SearchResult({ resource }) {
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
                    <p>
                        {resource.architecture ?? "Unknown"}
                    </p>
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