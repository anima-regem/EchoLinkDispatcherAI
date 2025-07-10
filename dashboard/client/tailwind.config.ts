import type { Config } from "tailwindcss";

const config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
    ],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        patterns: {
            opacities: {
                100: "1",
                80: ".80",
                60: ".60",
                40: ".40",
                20: ".20",
                10: ".10",
                5: ".05",
            },
            sizes: {
                1: "0.25rem",
                2: "0.5rem",
                4: "1rem",
                6: "1.5rem",
                8: "2rem",
                16: "4rem",
                20: "5rem",
                24: "6rem",
                32: "8rem",
            },
        },
        extend: {
            colors: {
                // shadcn
                text: "#020817",
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "#020817",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                emergency: {
                    critical: "#dc2626",
                    high: "#ea580c",
                    medium: "#ca8a04",
                    low: "#16a34a",
                    resolved: "#059669",
                },
                status: {
                    online: "#10b981",
                    offline: "#ef4444",
                    pending: "#f59e0b",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
                xs: "calc(var(--radius) - 6px)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                "fade-in": {
                    "0%": { opacity: "0", transform: "translateY(10px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                "slide-in-right": {
                    "0%": { transform: "translateX(100%)", opacity: "0" },
                    "100%": { transform: "translateX(0)", opacity: "1" },
                },
                "slide-in-left": {
                    "0%": { transform: "translateX(-100%)", opacity: "0" },
                    "100%": { transform: "translateX(0)", opacity: "1" },
                },
                "pulse-ring": {
                    "0%": { transform: "scale(1)", opacity: "1" },
                    "50%": { transform: "scale(1.2)", opacity: "0.7" },
                    "100%": { transform: "scale(1.4)", opacity: "0" },
                },
                "glow": {
                    "0%, 100%": { boxShadow: "0 0 5px rgba(59, 130, 246, 0.5)" },
                    "50%": { boxShadow: "0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.6)" },
                },
                "critical-pulse": {
                    "0%, 100%": { backgroundColor: "#dc2626", boxShadow: "0 0 0 rgba(220, 38, 38, 0.7)" },
                    "50%": { backgroundColor: "#ef4444", boxShadow: "0 0 0 6px rgba(220, 38, 38, 0.3)" },
                },
                "bounce-subtle": {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-2px)" },
                },
                "shimmer": {
                    "0%": { transform: "translateX(-100%)" },
                    "100%": { transform: "translateX(100%)" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "fade-in": "fade-in 0.5s ease-out",
                "slide-in-right": "slide-in-right 0.3s ease-out",
                "slide-in-left": "slide-in-left 0.3s ease-out",
                "pulse-ring": "pulse-ring 2s infinite",
                "glow": "glow 2s ease-in-out infinite",
                "critical-pulse": "critical-pulse 1.5s infinite",
                "bounce-subtle": "bounce-subtle 2s infinite",
                "shimmer": "shimmer 2s infinite",
            },
            transitionDuration: {
                "5000": "5000ms",
            },
        },
    },
    plugins: [
        require("tailwindcss-animate"),
        require("tailwindcss-bg-patterns"),
    ],
} satisfies Config;

export default config;
