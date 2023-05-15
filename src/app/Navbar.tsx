import React, {useState} from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from "framer-motion"
import Link from 'next/link';

export const Navbar = () => {
    const [sideNavActive, setSideNavActive] = useState<boolean>(false)

    return (
        <Wrapper>
            <MobileWrapper>
                <MobileButton
                    onClick={() => {
                        setSideNavActive(value => !value)
                    }}
                >
                    <svg height="8" viewBox="0 0 54 40"><rect width="54" height="8" rx="4" fill="#FFF"></rect><rect y="16" width="54" height="8" rx="4" fill="#FFF"></rect><rect y="32" width="54" height="8" rx="4" fill="#FFF"></rect></svg>
                </MobileButton>
                <HeaderText>MetaMind Tracker</HeaderText>
            </MobileWrapper>

            {/* Side Navigation */}
            <AnimatePresence>
                {sideNavActive && <SideNavWrapper
	                initial={{ x: -480 }}
	                animate={{ x: 0 }}
	                exit={{ x: -480 }}
                    transition={{ type: 'easeInOut', duration: 0.3, }}
                >
                  <MiniSideNav>
                    <ButtonWrapper
	                    onClick={() => {
                          setSideNavActive(value => !value)
                      }}
                    >
	                    <MobileButton>
		                    X
	                    </MobileButton>
                    </ButtonWrapper>
                  </MiniSideNav>
                  <LinksWrapper>
                    <Link href="/">
                      <LinkBox>Timer</LinkBox>
                    </Link>
                    <Link href="/reports">
                      <LinkBox>Reports</LinkBox>
                    </Link>
                  </LinksWrapper>
                </SideNavWrapper>}
            </AnimatePresence>
        </Wrapper>
    )
}

const Wrapper = styled.nav`
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1;
`
const HeaderText = styled.h3`
  margin-left: 20px;
`

const MobileWrapper = styled.div`
  height: 80px;
  width: 100%;
  background-color: rgb(var(--nav-background-rgb));
  color: #FFF;
  padding: 10px 16px;
  display: flex;
  align-items: center;
`
const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
`

const MobileButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: rgb(65, 42, 76);
  cursor: pointer;
  color: #FFF;
`

const SideNavWrapper = styled(motion.div)`
  width: 100%;
  max-width: 480px;
  height: 100vh;
  position: absolute;
  top: 0;
  z-index: 4000;
  background-color: rgb(44, 19, 56);
  display: flex;
`;

const MiniSideNav = styled.div`
  background-color: rgb(34, 10, 46);
  padding: 8px 0 4px;
  width: 56px;
  height: 100vh;
`

const LinksWrapper = styled.div`
  padding: 20px;
  flex: 1;
`

const LinkBox = styled.div`
  padding: 10px 0;
  color: #FFF;
  width: 100%;
`

