import Background from "@/app/components/landing/Background"
import Content from "@/app/components/landing/Content"
import Demo from "@/app/components/landing/Demo"
import Foo from "@/app/components/landing/Footer"
import Header from "@/app/components/landing/Header"
import Hero from "@/app/components/landing/Hero"

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
