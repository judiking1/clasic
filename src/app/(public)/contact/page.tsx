import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactInfo } from "@/components/contact/ContactInfo";

export const metadata = {
  title: "문의하기",
  description: "인조대리석 시공 관련 문의를 남겨주시면 빠르게 답변드리겠습니다.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-20 lg:pt-24">
        {/* Hero */}
        <section className="bg-gray-900 py-16 text-center text-white sm:py-20">
          <div className="mx-auto max-w-3xl px-4">
            <h1 className="text-3xl font-bold sm:text-4xl">문의하기</h1>
            <p className="mt-4 text-lg text-gray-300">
              견적 문의나 궁금한 사항을 남겨주시면
              <br className="hidden sm:inline" />
              빠르게 연락드리겠습니다
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-5">
            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
                <h2 className="mb-6 text-xl font-bold text-gray-900">
                  문의 남기기
                </h2>
                <ContactForm />
              </div>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2">
              <ContactInfo />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
