import Link from "next/link";

export default function CreatePR() {
  return (
    <div className="w-100 d-flex flex-column align-items-center justify-content-center pb-3">
      <hr className="w-100" />
      <p className="main-text-regular text-center">
        Found a bug? Want to add a feature? We welcome contributions from the
        community.
      </p>
      <Link href={"https://www.gem5.org/contributing"} className="main-text-regular text-center">Contribute to gem5</Link>
    </div>
  );
}
