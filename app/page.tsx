import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">⚽ Squad Builder</h1>
          <Link href="/squad-builder">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 text-gray-900">
            Build Your Dream Football Squad
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            AI-powered tactical recommendations for your wonderkid career mode. 
            Get starting XI suggestions, super sub picks, and formation strategies.
          </p>
          <Link href="/squad-builder">
            <Button size="lg" className="text-lg px-8 py-6">
              Start Building Your Squad →
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">👥</span>
                Player Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Add, edit, and organize your players with detailed stats including OVR, 
                position, playing style, and age.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🤖</span>
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Get intelligent starting XI picks, super sub suggestions, and tactical 
                strategies based on your squad composition.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">📊</span>
                Tactical Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Receive formation recommendations and strategies for different match 
                scenarios and opponent styles.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-pitch-green text-white rounded-lg p-12 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Dominate?</h3>
          <p className="text-lg mb-6 opacity-90">
            Build your squad, get AI recommendations, and export your tactical guide.
          </p>
          <Link href="/squad-builder">
            <Button size="lg" variant="secondary">
              Launch Squad Builder
            </Button>
          </Link>
        </div>
      </main>

      <footer className="border-t mt-16 py-8 text-center text-gray-600">
        <p>Football Squad Builder &copy; 2024 - AI-Powered Tactical Recommendations</p>
      </footer>
    </div>
  );
}
