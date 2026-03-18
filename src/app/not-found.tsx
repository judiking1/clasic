import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-primary px-4">
      {/* Large 404 */}
      <h1 className="mb-2 text-[10rem] font-black leading-none tracking-tighter text-white/[0.03] sm:text-[14rem]">
        404
      </h1>

      {/* Overlay text */}
      <div className="-mt-24 text-center sm:-mt-32">
        <div className="mb-4 flex items-center justify-center gap-4">
          <div className="h-px w-8 bg-accent" />
          <span className="text-xs font-medium tracking-[0.3em] uppercase text-accent">
            Page Not Found
          </span>
          <div className="h-px w-8 bg-accent" />
        </div>

        <p className="mb-10 text-base text-white/40">
          요청하신 페이지를 찾을 수 없습니다
        </p>

        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-8 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition-all duration-300 hover:border-accent/50 hover:bg-accent/10"
        >
          <svg
            className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          메인으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
