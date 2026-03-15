import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted">
      <h1 className="mb-4 text-6xl font-bold text-primary">404</h1>
      <p className="mb-8 text-lg text-secondary">
        요청하신 페이지를 찾을 수 없습니다.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary/90"
      >
        메인으로 돌아가기
      </Link>
    </div>
  );
}
