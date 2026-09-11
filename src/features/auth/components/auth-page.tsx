"use client";

import * as React from "react";
import { useEffect, useId, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/client";
import { getSafeRedirectTarget } from "@/lib/safe-redirect";
import { cn } from "@/lib/utils";

type AuthContentProps = {
  image?: {
    src: string;
    alt: string;
  };
  quote?: {
    text: string;
    author: string;
  };
};

type AuthPageProps = {
  signInContent?: AuthContentProps;
  signUpContent?: AuthContentProps;
};

type AuthFormProps = {
  isSubmitting: boolean;
  error: string | null;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

type AuthFormContainerProps = {
  isSignIn: boolean;
  onToggle: () => void;
  isSubmitting: boolean;
  error: string | null;
  onSignIn: (event: React.FormEvent<HTMLFormElement>) => void;
  onSignUp: (event: React.FormEvent<HTMLFormElement>) => void;
};

const defaultSignInContent = {
  image: {
    src: "/light-down.jpg",
    alt: "A beautiful interior design for sign-in",
  },
  quote: {
    text: "Welcome Back! ",
    author: "UnlockPi AI",
  },
};

const defaultSignUpContent = {
  image: {
    src: "https://i.ibb.co/HTZ6DPsS/original-33b8479c324a5448d6145b3cad7c51e7-removebg-preview.png",
    alt: "A vibrant, modern space for new beginnings",
  },
  quote: {
    text: "Create an account. A new chapter awaits.",
    author: "EaseMize UI",
  },
};

function Typewriter({
  text,
  speed = 100,
  cursor = "|",
  loop = false,
  deleteSpeed = 50,
  delay = 1500,
  className,
}: {
  text: string | string[];
  speed?: number;
  cursor?: string;
  loop?: boolean;
  deleteSpeed?: number;
  delay?: number;
  className?: string;
}) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [textArrayIndex, setTextArrayIndex] = useState(0);

  const textArray = Array.isArray(text) ? text : [text];
  const currentText = textArray[textArrayIndex] || "";

  useEffect(() => {
    if (!currentText) {
      return;
    }

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (currentIndex < currentText.length) {
            setDisplayText((previous) => previous + currentText[currentIndex]);
            setCurrentIndex((previous) => previous + 1);
          } else if (loop) {
            setTimeout(() => setIsDeleting(true), delay);
          }
        } else if (displayText.length > 0) {
          setDisplayText((previous) => previous.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentIndex(0);
          setTextArrayIndex((previous) => (previous + 1) % textArray.length);
        }
      },
      isDeleting ? deleteSpeed : speed,
    );

    return () => clearTimeout(timeout);
  }, [
    currentIndex,
    currentText,
    delay,
    deleteSpeed,
    displayText,
    isDeleting,
    loop,
    speed,
    textArray.length,
  ]);

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse">{cursor}</span>
    </span>
  );
}
import { EyeIcon, EyeOffIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Tooltip, TooltipPopup, TooltipTrigger } from "@/components/ui/tooltip";
import Logo from "@/components/logo";
type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

// The coss Input renders a positioned `<span>` wrapper around the actual
// <input>, so the eye toggle can sit inside that wrapper as a relative
// sibling. We stack it via the input's own [data-slot=input-control] parent
// by wrapping in a plain `<div className="relative">` — the coss Input keeps
// its shell styling; the button just floats on top of the right edge.
function PasswordInput({ className, label, ...props }: PasswordInputProps) {
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="grid w-full items-center gap-2">
      {label ? <Label htmlFor={id}>{label}</Label> : null}
      <InputGroup>
        <InputGroupInput
          id={id}
          type={showPassword ? "text" : "password"}
          nativeInput
          aria-label="Password with toggle visibility"
          placeholder="Enter your password"
          className={""}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        />
        <InputGroupAddon align="inline-end">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((previous) => !previous)}
                  size="icon-xs"
                  variant="ghost"
                />
              }
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </TooltipTrigger>
            <TooltipPopup>
              {showPassword ? "Hide password" : "Show password"}
            </TooltipPopup>
          </Tooltip>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
  return (
    <div className="grid w-full items-center gap-2">
      {label ? <Label htmlFor={id}>{label}</Label> : null}
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          nativeInput
          className={cn("pe-10", className)}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        />
        <button
          type="button"
          onClick={() => setShowPassword((previous) => !previous)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute inset-y-0 end-0 z-10 flex w-10 items-center justify-center text-muted-foreground/80 transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
        >
          {showPassword ? (
            <EyeOff className="size-4" aria-hidden="true" />
          ) : (
            <Eye className="size-4" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}

function SignInForm({ isSubmitting, error, onSubmit }: AuthFormProps) {
  return (
    <form onSubmit={onSubmit} autoComplete="on" className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-2 text-center">
       <Logo/>
        <h1 className="text-2xl font-bold">Sign in to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to sign in
        </p>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="signin-email">Email</Label>
          <Input
            id="signin-email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
            autoComplete="email"
          />
        </div>

        <PasswordInput
          name="password"
          label="Password"
          required
          autoComplete="current-password"
          placeholder="Password"
        />

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <Button type="submit" className="mt-2 w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </div>
    </form>
  );
}

function SignUpForm({ isSubmitting, error, onSubmit }: AuthFormProps) {
  return (
    <form onSubmit={onSubmit} autoComplete="on" className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your details below to sign up
        </p>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-1">
          <Label htmlFor="signup-name">Full Name</Label>
          <Input
            id="signup-name"
            name="name"
            type="text"
            placeholder="John Doe"
            required
            autoComplete="name"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
            autoComplete="email"
          />
        </div>

        <PasswordInput
          name="password"
          label="Password"
          required
          autoComplete="new-password"
          placeholder="Password"
        />

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <Button type="submit" className="mt-2 w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Sign Up"}
        </Button>
      </div>
    </form>
  );
}

function AuthFormContainer({
  isSignIn,
  onToggle,
  isSubmitting,
  error,
  onSignIn,
  onSignUp,
}: AuthFormContainerProps) {
  return (
    <div className="mx-auto grid w-[350px] gap-2">
      {isSignIn ? (
        <SignInForm
          isSubmitting={isSubmitting}
          error={error}
          onSubmit={onSignIn}
        />
      ) : (
        <SignUpForm
          isSubmitting={isSubmitting}
          error={error}
          onSubmit={onSignUp}
        />
      )}

      {/* <div className="text-center text-sm">
        {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
        <Button
          variant="link"
          className="pl-1 text-foreground"
          onClick={onToggle}
          type="button"
          disabled={isSubmitting}
        >
          {isSignIn ? "Sign up" : "Sign in"}
        </Button>
      </div>

      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">
          Or continue with
        </span>
      </div>

      <Button variant="outline" type="button" disabled>
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google icon"
          className="mr-2 h-4 w-4"
        />
        Continue with Google
      </Button> */}
    </div>
  );
}

export function AuthPage({
  signInContent = {},
  signUpContent = {},
}: AuthPageProps) {
  const [isSignIn, setIsSignIn] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  // Where to send the user once they're signed in — the route they
  // originally asked for before the auth gate bounced them here, or
  // /dashboard if there wasn't one (e.g. they landed on /auth/login
  // directly). Validated so a crafted `redirectTo` can't send them off-site.
  const redirectTarget = getSafeRedirectTarget(
    searchParams.get("redirectTo"),
    "/dashboard",
  );

  useEffect(() => {
    let isMounted = true;

    // Use getUser() (validated against Supabase) rather than getSession()
    // (cache-only from localStorage). A stale localStorage session would
    // otherwise bounce us to /dashboard, where the server's own getUser()
    // sees nothing valid and bounces us right back — an infinite loop.
    const checkSession = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (user && !userError) {
          router.replace(redirectTarget);
        }
      } finally {
        if (isMounted) {
          setIsSubmitting(false);
        }
      }
    };

    void checkSession();

    return () => {
      isMounted = false;
    };
  }, [redirectTarget, router]);

  const handleToggle = () => {
    setError(null);
    setIsSignIn((previous) => !previous);
  };

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      router.replace(redirectTarget);
    } catch (unknownError) {
      setError(
        unknownError instanceof Error
          ? unknownError.message
          : "Invalid email or password. Please try again.",
      );
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "");
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    try {
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      if (!data.session) {
        setIsSignIn(true);
        setError(
          "Account created. Please check your email to verify your account, then sign in.",
        );
        setIsSubmitting(false);
        return;
      }

      router.replace(redirectTarget);
    } catch (unknownError) {
      setError(
        unknownError instanceof Error
          ? unknownError.message
          : "Could not create account. Please verify details and try again.",
      );
      setIsSubmitting(false);
    }
  };

  const currentContent = isSignIn
    ? {
        image: { ...defaultSignInContent.image, ...signInContent.image },
        quote: { ...defaultSignInContent.quote, ...signInContent.quote },
      }
    : {
        image: { ...defaultSignUpContent.image, ...signUpContent.image },
        quote: { ...defaultSignUpContent.quote, ...signUpContent.quote },
      };

  return (
    <div className="min-h-screen w-full md:grid md:grid-cols-2">
      <style>{`
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear {
          display: none;
        }
      `}</style>

      <div className="flex h-screen items-center justify-center p-6 md:h-auto md:p-0 md:py-12">
        <AuthFormContainer
          isSignIn={isSignIn}
          onToggle={handleToggle}
          isSubmitting={isSubmitting}
          error={error}
          onSignIn={handleSignIn}
          onSignUp={handleSignUp}
        />
      </div>

      <div
        className="relative hidden bg-cover bg-center transition-all duration-500 ease-in-out md:block"
        style={{ backgroundImage: `url(${currentContent.image.src})` }}
        key={currentContent.image.src}
      >
        <div className="absolute inset-x-0 bottom-0 h-[100px] bg-gradient-to-t from-background to-transparent" />

        <div className="relative z-10 flex h-full flex-col items-center justify-end p-2 pb-6">
          <blockquote className="space-y-2 text-center text-foreground">
            <p className="text-lg font-medium text-white!">
              <span aria-hidden="true">&ldquo;</span>
              <Typewriter
                key={currentContent.quote.text}
                text={currentContent.quote.text}
                speed={60}
              />
              <span aria-hidden="true">&rdquo;</span>
            </p>
            <cite className="block text-sm font-light text-muted-foreground not-italic">
              - {currentContent.quote.author}
            </cite>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
