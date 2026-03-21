export const SITE_CONFIG = {
  name: "클레식",
  nameEn: "Clasic",
  description:
    "인조대리석 싱크대, 세면대, 카운터 맞춤 제작 및 시공 전문 업체. 대리석 가공부터 시공까지 원스톱 서비스를 제공합니다.",
  owner: "이상남",
  phone: "010-6213-3736",
  address: "경기도 남양주시 화도읍 비룡로 464번길 8-23",
  addressDetail: "",
  businessNumber: "126-08-69379",
  email: "mytimetime1@naver.com",
  adminEmail: "judiking1@naver.com",
  naverMapUrl: "https://naver.me/FJO2c6hq",
  latitude: 37.6288,
  longitude: 127.3052,
} as const;

export const NAV_ITEMS = [
  { label: "메인", href: "/" },
  { label: "시공사례", href: "/portfolio" },
  { label: "회사소개", href: "/about" },
  { label: "인조대리석 샘플", href: "/samples" },
  { label: "문의하기", href: "/contact" },
] as const;

export const PORTFOLIO_CATEGORIES = [
  { value: "all", label: "전체" },
  { value: "kitchen", label: "싱크대" },
  { value: "bathroom", label: "세면대" },
  { value: "counter", label: "카운터" },
  { value: "etc", label: "기타" },
] as const;

export const INQUIRY_TYPES = [
  { value: "kitchen", label: "싱크대 견적" },
  { value: "bathroom", label: "세면대 견적" },
  { value: "counter", label: "카운터 견적" },
  { value: "etc", label: "기타 문의" },
] as const;

export const SAMPLE_COLORS = [
  { value: "white", label: "화이트" },
  { value: "beige", label: "베이지" },
  { value: "gray", label: "그레이" },
  { value: "black", label: "블랙" },
  { value: "brown", label: "브라운" },
  { value: "etc", label: "기타" },
] as const;

export const SAMPLE_PATTERNS = [
  { value: "solid", label: "솔리드" },
  { value: "veined", label: "무늬결" },
  { value: "speckled", label: "칩" },
  { value: "etc", label: "기타" },
] as const;
