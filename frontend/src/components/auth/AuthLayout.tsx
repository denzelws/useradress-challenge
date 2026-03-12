import solutionLogo from "@/assets/solution-logo.svg";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

interface AuthLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthLayout({
  title,
  description,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F4F4F5] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center mb-8">
          <img src={solutionLogo} alt="Solution Logo" className="h-12 w-auto" />
        </div>

        <Card className="bg-white border-[#0A0A0A]/10 shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-[#0A0A0A]">
              {title}
            </CardTitle>

            <CardDescription className="text-[#0A0A0A]/60">
              {description}
            </CardDescription>
          </CardHeader>

          <CardContent>{children}</CardContent>

          {footer && (
            <CardFooter className="flex justify-center border-t border-[#0A0A0A]/5 pt-4">
              {footer}
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
