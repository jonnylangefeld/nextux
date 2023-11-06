import dynamic from "next/dynamic"
import Content from "@/app/components/landing/Content"
import Demo from "@/app/components/landing/Demo"
import Foo from "@/app/components/landing/Footer"
import Header from "@/app/components/landing/Header"
import Hero from "@/app/components/landing/Hero"

const Background = dynamic(() => import("@/app/components/landing/Background"), {
  ssr: false,
})

export default function Home() {
  return (
    <>
      <Background />
      <Header />
      <Content>
        <Hero />
        <Demo />
        <Foo />
      </Content>
    </>
  )
}
