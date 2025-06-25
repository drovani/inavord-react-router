import { CheckCircle2, Code, Layers, Sparkles } from "lucide-react";
import { Link } from "react-router";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { siteConfig } from "~/config/site";
import type { Route } from "./+types/_index";

const templateInfo = {
  lastUpdated: new Date("2025-6-25"),
  features: [
    "Complete authentication system with Supabase",
    "Role-based access control and user management",
    "Modern UI with shadcn/ui and Tailwind CSS v4",
    "File-based routing with React Router v7",
    "TypeScript strict mode and type safety",
    "Netlify deployment configuration"
  ],
};

export default function Index(_: Route.ComponentProps) {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">{siteConfig.name}</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {siteConfig.description}
        </p>
        <div className="flex justify-center gap-2">
          <Badge variant="secondary">React Router v7</Badge>
          <Badge variant="secondary">Supabase</Badge>
          <Badge variant="secondary">TypeScript</Badge>
          <Badge variant="secondary">Tailwind CSS v4</Badge>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tech-stack">Tech Stack</TabsTrigger>
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Modern React Application Template</CardTitle>
              <CardDescription>
                Everything you need to build a full-stack React application with authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                This template provides a solid foundation for building modern React applications with authentication,
                role-based access control, and a professional UI. It's designed with developer experience and
                production readiness in mind.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Card className="bg-muted/50">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      Authentication Ready
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    Complete Supabase authentication with email/password, OAuth providers, and password reset flows
                  </CardContent>
                </Card>
                <Card className="bg-muted/50">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Layers className="h-5 w-5" />
                      Role-Based Access
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    Built-in user roles (admin, editor, user) with protected routes and admin user management
                  </CardContent>
                </Card>
                <Card className="bg-muted/50">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Modern UI
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    shadcn/ui components with Tailwind CSS v4, responsive design, and dark mode support
                  </CardContent>
                </Card>
                <Card className="bg-muted/50">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5" />
                      Production Ready
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    TypeScript strict mode, Netlify deployment, and comprehensive development tooling
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {templateInfo.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tech Stack Tab */}
        <TabsContent value="tech-stack" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Technology Stack & Conventions</CardTitle>
              <CardDescription>
                Opinionated choices for modern React development
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">Core Technologies</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Frontend</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• React Router v7 (file-based routing)</li>
                      <li>• TypeScript (strict mode)</li>
                      <li>• Tailwind CSS v4</li>
                      <li>• shadcn/ui components</li>
                      <li>• Lucide React icons</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Backend & Infrastructure</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Supabase (auth, database, storage)</li>
                      <li>• Netlify (deployment, functions)</li>
                      <li>• Vite (build tool)</li>
                      <li>• loglevel (logging)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Coding Standards & Conventions</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium">Component Development</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground mt-1">
                      <li>• Always use shadcn CLI for UI components: <code className="bg-muted px-1 rounded">npx shadcn@latest add [component]</code></li>
                      <li>• Follow shadcn/ui patterns and conventions</li>
                      <li>• Use TypeScript strict mode (no <code className="bg-muted px-1 rounded">any</code> types)</li>
                      <li>• Responsive-first design with Tailwind breakpoints</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium">Architecture Patterns</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground mt-1">
                      <li>• Context-based state management (AuthContext)</li>
                      <li>• Protected route layouts for access control</li>
                      <li>• Repository pattern for data access (future)</li>
                      <li>• SSR-compatible Supabase client setup</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium">Development Practices</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground mt-1">
                      <li>• Use loglevel instead of console for logging</li>
                      <li>• Prefer editing existing files over creating new ones</li>
                      <li>• File-based routing with centralized route configuration</li>
                      <li>• Role-based navigation and access control</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roadmap Tab */}
        <TabsContent value="roadmap" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Future Roadmap</CardTitle>
              <CardDescription>
                Planned enhancements and features for the template
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-lg mb-2">Near Term (Next 3 months)</h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-amber-500 mt-0.5" />
                      <div>
                        <span className="font-medium">Enhanced User Management</span>
                        <p className="text-muted-foreground">Bulk user operations, user profiles, and advanced role management</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-amber-500 mt-0.5" />
                      <div>
                        <span className="font-medium">Repository Pattern Implementation</span>
                        <p className="text-muted-foreground">Complete data layer abstraction with base repository classes</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-amber-500 mt-0.5" />
                      <div>
                        <span className="font-medium">Testing Setup</span>
                        <p className="text-muted-foreground">Vitest configuration, component tests, and E2E testing with Playwright</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-lg mb-2">Medium Term (3-6 months)</h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Sparkles className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <span className="font-medium">Multi-tenant Architecture</span>
                        <p className="text-muted-foreground">Organization-based user management and role isolation</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Sparkles className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <span className="font-medium">Advanced Analytics</span>
                        <p className="text-muted-foreground">User activity tracking, performance monitoring, and usage dashboards</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Sparkles className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <span className="font-medium">Internationalization</span>
                        <p className="text-muted-foreground">i18n support with React Router v7 and dynamic locale loading</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-lg mb-2">Long Term (6+ months)</h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Sparkles className="h-5 w-5 text-purple-500 mt-0.5" />
                      <div>
                        <span className="font-medium">Real-time Features</span>
                        <p className="text-muted-foreground">WebSocket integration, live notifications, and collaborative features</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Sparkles className="h-5 w-5 text-purple-500 mt-0.5" />
                      <div>
                        <span className="font-medium">Mobile App Template</span>
                        <p className="text-muted-foreground">React Native version with shared authentication and design system</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Sparkles className="h-5 w-5 text-purple-500 mt-0.5" />
                      <div>
                        <span className="font-medium">CLI Generator</span>
                        <p className="text-muted-foreground">Command-line tool to scaffold new projects from this template</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recent Updates Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Template Features
            <Badge variant="outline" className="ml-2">v{siteConfig.version}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Authentication & Security</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Complete Supabase Auth integration</li>
                <li>• Role-based access control</li>
                <li>• Protected route layouts</li>
                <li>• Admin user management</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Developer Experience</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• TypeScript strict mode</li>
                <li>• shadcn/ui component library</li>
                <li>• Responsive design system</li>
                <li>• Production deployment ready</li>
              </ul>
            </div>
          </div>
          <div className="flex gap-4 justify-center mt-6">
            <Link
              to="/login"
              className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
            >
              Try Authentication
            </Link>
            <Link
              to="/admin/users"
              className="rounded-md border border-input bg-background px-4 py-2 hover:bg-accent hover:text-accent-foreground"
            >
              Admin Panel
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <footer className="text-center text-sm text-muted-foreground pt-4">
        <p>
          {siteConfig.name} template - A modern foundation for React applications
        </p>
        <p className="mt-1">
          Built with 💜 by <a href={siteConfig.author.url} className="text-primary hover:underline">{siteConfig.author.name}</a>
        </p>
      </footer>
    </div>
  );
}