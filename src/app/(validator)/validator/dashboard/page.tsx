import { Metadata } from "next";
import { getValidatorDashboardAction } from "@/actions/validator.actions";
import { ValidatorDashboardView } from "@/components/validator/ValidatorDashboardView";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Validator Evaluation Cockpit | Pepoltek",
  description: "Technical take-home grading, architecture scorecards, and healthcare primary source licensure verification desk.",
};

export default async function ValidatorDashboardPage() {
  const res = await getValidatorDashboardAction();

  if (!res.success || !res.data) {
    // If not authenticated or forbidden, redirect to login
    redirect("/login?callbackUrl=/validator/dashboard");
  }

  return <ValidatorDashboardView initialData={res.data} />;
}
