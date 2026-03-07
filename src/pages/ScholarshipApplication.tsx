import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GraduationCap, Upload, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAdminData } from "@/contexts/AdminDataContext";
import type { ScholarshipFormField } from "@/contexts/AdminDataContext";

const ScholarshipApplication = () => {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { scholarshipId } = useParams<{ scholarshipId?: string }>();
    const navigate = useNavigate();
    const { scholarships, submitScholarshipApplication } = useAdminData();
    const selectedScholarship = scholarshipId ? scholarships.find((s) => s.id === scholarshipId) : null;
    const fields: ScholarshipFormField[] = Array.isArray(selectedScholarship?.formFields)
        ? selectedScholarship!.formFields
        : [];

    const [answers, setAnswers] = useState<Record<string, unknown>>({});

    const setAnswer = (fieldId: string, value: unknown) => {
        setAnswers((prev) => ({ ...prev, [fieldId]: value }));
    };

    const validate = (): string | null => {
        if (!selectedScholarship) return "Please select a scholarship.";
        if (fields.length === 0) return "This scholarship does not have an application form configured yet.";
        for (const f of fields) {
            if (!f.required) continue;
            const v = answers[f.id];
            const str = typeof v === "string" ? v.trim() : "";
            if (f.type === "number") {
                if (v === "" || v === null || v === undefined) return `Please fill in: ${f.label}`;
                if (typeof v === "number" && Number.isNaN(v)) return `Please fill in: ${f.label}`;
                if (typeof v === "string" && v.trim().length === 0) return `Please fill in: ${f.label}`;
            } else {
                if (!str) return `Please fill in: ${f.label}`;
            }
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const validationError = validate();
            if (validationError) {
                toast({
                    title: "Validation Error",
                    description: validationError,
                    variant: "destructive",
                });
                setIsSubmitting(false);
                return;
            }

            await submitScholarshipApplication({
                scholarshipId: selectedScholarship!.id,
                scholarshipTitle: selectedScholarship!.title,
                answers,
            });

            toast({
                title: "Application Submitted Successfully!",
                description: "We've received your scholarship application.",
            });

            setAnswers({});
        } catch (err) {
            toast({
                title: "Submission failed",
                description: err instanceof Error ? err.message : "Failed to submit application.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderField = (field: ScholarshipFormField) => {
        const commonLabel = (
            <Label htmlFor={field.id}>
                {field.label}
                {field.required ? " *" : ""}
            </Label>
        );

        if (field.type === "textarea") {
            return (
                <div key={field.id} className="space-y-2">
                    {commonLabel}
                    <Textarea
                        id={field.id}
                        value={typeof answers[field.id] === "string" ? (answers[field.id] as string) : ""}
                        onChange={(e) => setAnswer(field.id, e.target.value)}
                        required={field.required}
                        rows={4}
                    />
                </div>
            );
        }

        if (field.type === "select") {
            const options = Array.isArray(field.options) ? field.options : [];
            return (
                <div key={field.id} className="space-y-2">
                    {commonLabel}
                    <Select
                        value={typeof answers[field.id] === "string" ? (answers[field.id] as string) : ""}
                        onValueChange={(v) => setAnswer(field.id, v)}
                    >
                        <SelectTrigger id={field.id}>
                            <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                            {options.map((o) => (
                                <SelectItem key={o} value={o}>
                                    {o}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            );
        }

        const inputType: string = field.type;
        return (
            <div key={field.id} className="space-y-2">
                {commonLabel}
                <Input
                    id={field.id}
                    type={inputType}
                    value={typeof answers[field.id] === "string" || typeof answers[field.id] === "number" ? String(answers[field.id]) : ""}
                    onChange={(e) => {
                        if (field.type === "number") {
                            const raw = e.target.value;
                            setAnswer(field.id, raw === "" ? "" : Number(raw));
                        } else {
                            setAnswer(field.id, e.target.value);
                        }
                    }}
                    required={field.required}
                />
            </div>
        );
    };

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-gradient-hero py-12 md:py-16">
                    <div className="container">
                        <div className="mx-auto max-w-3xl">
                            <Link
                                to="/scholarship"
                                className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to Scholarship Information
                            </Link>
                            <div className="text-center">
                                <div className="mb-6 flex justify-center">
                                    <div className="rounded-full bg-primary/10 p-4">
                                        <GraduationCap className="h-12 w-12 text-primary md:h-14 md:w-14" />
                                    </div>
                                </div>
                                <h1 className="mb-4 font-heading text-3xl font-bold md:text-4xl lg:text-5xl">
                                    Scholarship Application
                                </h1>
                                <p className="text-lg text-muted-foreground">
                                    {selectedScholarship ? (
                                        <>Apply for: <span className="font-medium text-foreground">{selectedScholarship.title}</span></>
                                    ) : (
                                        <>Select a scholarship and complete the form below</>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Application Requirements Alert */}
                <section className="py-8">
                    <div className="container">
                        <div className="mx-auto max-w-4xl">
                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Before You Begin</AlertTitle>
                                <AlertDescription>
                                    Please ensure you have the following documents ready to upload:
                                    <ul className="mt-2 list-inside list-disc space-y-1">
                                        <li>Recent academic transcript or report card</li>
                                        <li>Letter of acceptance or enrollment confirmation</li>
                                        <li>Proof of NCAA membership (parent or applicant)</li>
                                        <li>Financial need statement or documentation</li>
                                        <li>Two letters of recommendation (for secondary and vocational scholarships)</li>
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        </div>
                    </div>
                </section>

                {/* Application Form */}
                <section className="pb-16 md:pb-24">
                    <div className="container">
                        <div className="mx-auto max-w-4xl">
                            <form onSubmit={handleSubmit}>
                                <Card className="mb-6">
                                    <CardHeader>
                                        <CardTitle>Scholarship</CardTitle>
                                        <CardDescription>Select the scholarship you are applying for</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="scholarship">Scholarship *</Label>
                                            <Select
                                                value={selectedScholarship?.id ?? ""}
                                                onValueChange={(id) => {
                                                    const next = scholarships.find((s) => s.id === id) ?? null;
                                                    if (!next) return;
                                                    navigate(`/scholarship/apply/${next.id}`);
                                                }}
                                            >
                                                <SelectTrigger id="scholarship">
                                                    <SelectValue placeholder="Select scholarship" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {scholarships.map((s) => (
                                                        <SelectItem key={s.id} value={s.id}>
                                                            {s.title}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {!selectedScholarship && (
                                            <Alert>
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertTitle>Choose a scholarship</AlertTitle>
                                                <AlertDescription>Select a scholarship to load its application form.</AlertDescription>
                                            </Alert>
                                        )}

                                        {selectedScholarship && fields.length === 0 && (
                                            <Alert>
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertTitle>Form not configured</AlertTitle>
                                                <AlertDescription>This scholarship does not have an application form configured yet.</AlertDescription>
                                            </Alert>
                                        )}
                                    </CardContent>
                                </Card>

                                {selectedScholarship && fields.length > 0 && (
                                    <Card className="mb-6">
                                        <CardHeader>
                                            <CardTitle>Application Form</CardTitle>
                                            <CardDescription>Please complete the required fields</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {fields.map(renderField)}
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Success Message */}
                                <Alert className="mb-6 border-green-200 bg-green-50">
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    <AlertTitle className="text-green-900">Application Review</AlertTitle>
                                    <AlertDescription className="text-green-800">
                                        Your application will be reviewed by the NCAA Education Committee. 
                                        Successful applicants will be notified by May 15th. You will receive 
                                        a confirmation email once your application is submitted.
                                    </AlertDescription>
                                </Alert>

                                {/* Submit Button */}
                                <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                                    <Button
                                        type="submit"
                                        size="lg"
                                        disabled={isSubmitting || !selectedScholarship || fields.length === 0}
                                        className="w-full sm:w-auto"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="mr-2">Submitting...</span>
                                                <span className="animate-spin">⏳</span>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="mr-2 h-5 w-5" />
                                                Submit Application
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        size="lg"
                                        variant="outline"
                                        asChild
                                        className="w-full sm:w-auto"
                                    >
                                        <Link to="/scholarship">Cancel</Link>
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default ScholarshipApplication;
