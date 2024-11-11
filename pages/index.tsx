import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ArrowRight, Brain, BarChart3, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { DigitalFitCheck } from "@/components/DigitalFitCheck"
import { useState } from "react"
export default function Home() {
  const [sessionState, setSessionState] = useState({
    isComplete: false,
    currentCategory: 0,
    currentQuestion: 0,
    answers: [],
    totalScore: 0,
    scores: []
  });
  const [message, setMessage] = useState('');

  const startDigitalFitCheck = async () => {
    try {
      const response = await fetch('/api/digital-fit-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'INIT_QUESTIONS'
        }),
      });

      const data = await response.json();
      setMessage(data.message);
      setSessionState(data.sessionState);
    } catch (error) {
      console.error('Error starting Digital Fit Check:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section with enhanced styling */}
      <section className="container px-4 md:px-6 flex flex-col items-center justify-center space-y-10 pt-24 pb-16">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-20 h-20">
              <Brain className="w-full h-full text-primary animate-pulse" />
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl"></div>
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            Wie digital ist Ihr Unternehmen?
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
            Ermitteln Sie Ihren Digital Fit und erfahren Sie, wie Sie Ihr Unternehmen mit 
            <span className="text-primary font-medium"> smarter KI</span> und 
            <span className="text-primary font-medium"> menschlicher Expertise</span> auf die nächste Stufe bringen.
          </p>
          <Button 
            size="lg" 
            className="mt-4 group transition-all duration-300 hover:scale-105"
            onClick={startDigitalFitCheck}
          >
            Digital Fit Check starten
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Testimonial */}
        <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 max-w-2xl mx-auto border border-gray-100 shadow-sm">
          <p className="italic text-gray-600">
            "InnovateX unterstützt uns mit moderner Technologie und einer persönlichen Note. 
            Unsere digitale Transformation war nie einfacher."
          </p>
          <div className="mt-4 flex items-center">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">Max Mustermann</p>
              <p className="text-xs text-gray-500">CEO, Digital Solutions GmbH</p>
            </div>
          </div>
        </div>

        {/* Solutions Preview Cards with enhanced styling */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          {solutions.map((solution, index) => (
            <Card 
              key={index} 
              className="relative group hover:shadow-lg transition-all duration-300 border-t-4 hover:-translate-y-1"
              style={{ borderTopColor: solution.color }}
            >
              <CardHeader>
                <div className="flex items-center space-x-3">
                  {solution.icon}
                  <CardTitle>{solution.title}</CardTitle>
                </div>
                <CardDescription>{solution.shortDesc}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {solution.description}
                </p>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="group/button"
                >
                  Mehr erfahren 
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/button:translate-x-1 transition-transform" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Digital Fit Score Calculator */}
      <section className="container px-4 md:px-6 py-12">
        <DigitalFitCheck 
          sessionState={sessionState}
          setSessionState={setSessionState}
          message={message}
          setMessage={setMessage}
        />
      </section>

      {message && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          {message}
        </div>
      )}
    </div>
  )
}

const solutions = [
  {
    title: "Digitalisierung",
    shortDesc: "KI-gestützte Transformation",
    description: "Transformieren Sie Ihr Unternehmen mit modernsten KI-Lösungen und zukunftssicheren Strategien.",
    icon: <Brain className="h-6 w-6 text-primary" />,
    color: "#0066FF"
  },
  {
    title: "Marktanalyse",
    shortDesc: "Datengetriebene Insights",
    description: "Gewinnen Sie wertvolle Einblicke in Ihre Marktposition durch KI-gestützte Analysen.",
    icon: <BarChart3 className="h-6 w-6 text-primary" />,
    color: "#0066FF"
  },
  {
    title: "Beratung",
    shortDesc: "Persönliche Expertise",
    description: "Profitieren Sie von unserer individuellen Beratung, die KI-Technologie mit menschlicher Erfahrung verbindet.",
    icon: <Users className="h-6 w-6 text-primary" />,
    color: "#0066FF"
  }
]