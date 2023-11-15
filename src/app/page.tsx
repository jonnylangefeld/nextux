import dynamic from "next/dynamic"
import Content from "@/app/components/landing/Content"
import DemoSkeleton from "@/app/components/landing/DemoSkeleton"
import Footer from "@/app/components/landing/Footer"
import Header from "@/app/components/landing/Header"
import Hero from "@/app/components/landing/Hero"
import Section from "@/app/components/landing/Section"

const Background = dynamic(() => import("@/app/components/landing/Background"), {
  ssr: false,
})

export default function Home() {
  const Demo = dynamic(() => import("@/app/components/landing/Demo"), {
    ssr: false,
    loading: () => <DemoSkeleton />,
  })

  return (
    <>
      <Background />
      <Header />
      <Content>
        <Hero />
        <Section className="z-10 -mt-48" id="demo">
          <Demo />
        </Section>
        <Footer />
      </Content>
    </>
  )
}
