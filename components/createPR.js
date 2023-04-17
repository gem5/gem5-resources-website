import Link from "next/link";

/**
 * @component CreatePR
 * @description This component renders a "Create Pull Request" section with a copy icon alongside the given child element,
 * and copies the text content of the child element to the clipboard when the icon is clicked.
 * It also displays a tooltip message when the text has been successfully copied to the clipboard.
 * @returns {JSX.Element} - The JSX element representing the "Create Pull Request" section with copy icon and child element.
 */
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
