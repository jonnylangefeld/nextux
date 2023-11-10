import dynamic from "next/dynamic"
import Content from "@/app/components/landing/Content"
import Foo from "@/app/components/landing/Footer"
import Header from "@/app/components/landing/Header"
import Hero from "@/app/components/landing/Hero"
import MagicFormSkeleton from "@/app/components/landing/MagicFormSkeleton"

const Background = dynamic(() => import("@/app/components/landing/Background"), {
  ssr: false,
})

export default function Home() {
  const Demo = dynamic(() => import("@/app/components/landing/Demo"), {
    ssr: false,
    loading: () => <MagicFormSkeleton />,
  })

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
