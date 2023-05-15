'use client'
import React from "react";
import './globals.css'
import { Inter } from 'next/font/google'
import {Navbar} from "@component/app/Navbar";
import styled from 'styled-components'
import {AppProvider} from "@component/context";

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
    <AppProvider>
        <body
            suppressHydrationWarning={true}
            className={inter.className}
        >
            <Navbar />
            <ChildrenWrapper>
                {children}
            </ChildrenWrapper>
        </body>
    </AppProvider>
    </html>
  )
}

const ChildrenWrapper = styled.div`
  padding-top: 80px;
`
