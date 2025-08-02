import type { Metadata } from "next";
import { Nunito, Montserrat } from "next/font/google";
import ClientProviders from "@/app/ClientProviders";

import "./globals.css";

import HeaderLayout from "@/components/header/HeaderLayout";
import FooterLayout from "@/components/footer/FooterLayout";

const montserrat = Montserrat({
    subsets: ["latin"],
    variable: "--font-heading",
    weight: ["500", "600", "700", "800", "900"],
});

const nunito = Nunito({
    subsets: ["latin"],
    variable: "--font-body",
    weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
    title: "Hashi Ekshathe",
    description: "Official website of Hashi Ekshathe",
    icons: {
        icon: "/favicon-orange.svg",
        shortcut: "/favicon-orange.svg",
        apple: "/favicon-orange.svg",
    },
};

export default function RootLayout({
    children,
    }: Readonly<{
    children: React.ReactNode;
    }>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={`${nunito.variable} ${montserrat.variable}`}>
            <ClientProviders>
            <HeaderLayout />
            {children}
            <FooterLayout />
            </ClientProviders>
        </body>
        </html>
    );
}
