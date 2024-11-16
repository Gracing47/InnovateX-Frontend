import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Brain,
  Users,
  BarChart3,
  CheckCircle,
  User,
  ShieldCheck,
} from "lucide-react";
import { SessionState } from "../types/digitalFitCheck";
import { cn } from "@/lib/utils";

const benefits = [
  {
    title: "Effizienz",
    description: "Steigern Sie Ihre Produktivität durch automatisierte Prozesse.",
    icon: <CheckCircle className="h-8 w-8 text-primary" />,
  },
  {
    title: "Personalisierung",
    description: "Individuelle Lösungen, maßgeschneidert für Ihr Unternehmen.",
    icon: <User className="h-8 w-8 text-primary" />,
  },
  {
    title: "Ethik",
    description: "Verantwortungsvolle KI-Entwicklung mit höchsten Standards.",
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
  },
];

const solutions = [
  {
    title: "Digitalisierung",
    shortDesc: "KI-gestützte Transformation",
    description:
      "Transformieren Sie Ihr Unternehmen mit modernsten KI-Lösungen und zukunftssicheren Strategien.",
    icon: <Brain className="h-8 w-8 text-primary" />,
    color: "bg-blue-500",
  },
  {
    title: "Marktanalyse",
    shortDesc: "Datengetriebene Insights",
    description:
      "Gewinnen Sie wertvolle Einblicke in Ihre Marktposition durch KI-gestützte Analysen.",
    icon: <BarChart3 className="h-8 w-8 text-primary" />,
    color: "bg-green-500",
  },
  {
    title: "Beratung",
    shortDesc: "Persönliche Expertise",
    description:
      "Profitieren Sie von unserer individuellen Beratung, die KI-Technologie mit menschlicher Erfahrung verbindet.",
    icon: <Users className="h-8 w-8 text-primary" />,
    color: "bg-orange-500",
  },
];

// 1. Konsistente Props für Section Component
interface SectionProps {
  title?: string;
  className?: string;
  children: React.ReactNode;
}

function Section({ title, className, children }: SectionProps) {
  return (
    <section className={cn("container mx-auto px-6 md:px-12 py-16", className)}>
      {title && (
        <h2 className="text-3xl font-semibold text-center mb-12 text-gray-900">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

// 2. Verbesserte NewsletterForm mit Validierung
function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
      return;
    }
    setError("");
    console.log("Newsletter abonniert:", email);
    // Hier API-Aufruf für Newsletter
  };

  return (
    <form className="w-full max-w-lg mx-auto flex flex-col" onSubmit={handleSubmit}>
      <div className="flex">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Ihre E-Mail-Adresse"
          className="flex-grow p-4 border border-gray-300 rounded-l-lg focus:outline-none focus:ring focus:ring-primary"
        />
        <Button type="submit" className="rounded-r-lg px-6 py-4 bg-primary text-white hover:bg-primary-dark">
          Abonnieren
        </Button>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </form>
  );
}

// 3. Modal für Solution Details
interface SolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  solution: (typeof solutions)[0];
}

function SolutionModal({ isOpen, onClose, solution }: SolutionModalProps) {
  if (!solution) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white p-8 rounded-lg shadow-lg max-w-lg">
        <div className="flex items-center space-x-4 mb-6">
          {solution.icon}
          <DialogTitle className="text-2xl font-semibold">
            {solution.title}
          </DialogTitle>
        </div>
        <DialogDescription className="text-gray-700">
          {solution.description}
        </DialogDescription>
        <Button onClick={onClose} className="mt-6">
          Schließen
        </Button>
      </DialogContent>
    </Dialog>
  );
}

// 4. Verbesserte SolutionSection mit Modal
function SolutionSection() {
  const [selectedSolution, setSelectedSolution] = useState<(typeof solutions)[0] | null>(null);

  return (
    <Section title="Unsere Lösungen">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {solutions.map((solution, index) => (
          <Card
            key={index}
            className={cn(
              "relative p-6 border shadow-md group rounded-lg transition-transform cursor-pointer",
              "hover:shadow-lg hover:scale-105"
            )}
            onClick={() => setSelectedSolution(solution)}
          >
            <div className="flex items-center space-x-4 mb-6">
              {solution.icon}
              <h3 className="text-xl font-semibold">{solution.title}</h3>
            </div>
            <p className="text-gray-700 mb-4">{solution.shortDesc}</p>
            <CardContent className="text-gray-800">{solution.description}</CardContent>
            <CardFooter>
              <Button
                variant="link"
                size="sm"
                className="text-primary hover:underline group-hover:text-primary-dark"
              >
                Mehr erfahren
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <SolutionModal
        isOpen={!!selectedSolution}
        onClose={() => setSelectedSolution(null)}
        solution={selectedSolution!}
      />
    </Section>
  );
}

// 5. Verbesserte NewsletterSection
function NewsletterSection() {
  return (
    <Section className="bg-gray-50">
      <div className="text-center">
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">
          Abonnieren Sie unseren Newsletter
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          Erhalten Sie spannende Einblicke und Updates direkt in Ihren Posteingang.
        </p>
        <NewsletterForm />
      </div>
    </Section>
  );
}

export default function Home() {
  const [sessionState, setSessionState] = useState<SessionState>({
    isComplete: false,
    currentCategory: 0,
    currentQuestion: 0,
    answers: [],
    totalScore: 0,
    scores: [],
    questions: [],
  });

  const [message, setMessage] = useState("");

  const startDigitalFitCheck = async () => {
    try {
      const response = await fetch("/api/digital-fit-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: "INIT_QUESTIONS" }),
      });

      const data = await response.json();
      setMessage(data.message);
      setSessionState(data.sessionState);
    } catch (error) {
      console.error("Error starting Digital Fit Check:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection startDigitalFitCheck={startDigitalFitCheck} />

      {/* Key Benefits Section */}
      <Section
        title="Ihre Vorteile mit humanzentrierten KI-Lösungen"
        className="bg-gray-50"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className="flex flex-col items-center text-center p-6 bg-white shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="mb-6">{benefit.icon}</div>
              <CardTitle className="mb-2 text-xl font-semibold">
                {benefit.title}
              </CardTitle>
              <CardDescription className="text-gray-800">
                {benefit.description}
              </CardDescription>
            </Card>
          ))}
        </div>
      </Section>

      {/* Solutions Section */}
      <SolutionSection />

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  );
}

// Reusable Components
function HeroSection({ startDigitalFitCheck }) {
  return (
    <section className="container mx-auto px-6 md:px-12 text-center pt-20 pb-16">
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24 mb-4">
          <Brain className="w-full h-full text-primary animate-pulse" />
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
        </div>
        <h1 className="text-4xl font-extrabold sm:text-5xl text-gray-900 mb-4">
          Die Brücke zwischen Mensch und KI
        </h1>
        <p className="max-w-xl mx-auto text-gray-700 text-lg sm:text-xl mb-6">
          AI Solutions Built Around You.
        </p>
        <Button
          onClick={startDigitalFitCheck}
          size="lg"
          className="px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105 hover:bg-primary/90"
        >
          Digital Fit Check starten
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </section>
  );
}