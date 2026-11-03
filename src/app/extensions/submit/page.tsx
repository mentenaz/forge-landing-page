import { redirect } from "next/navigation";

// There is no submission form any more: the catalogue is mirrored from the public
// extension catalogue, and extensions only we carry are added through a pull request.
// The page that explains how lives in the docs.
export default function SubmitExtension() {
	redirect("/docs/add-an-extension");
}
