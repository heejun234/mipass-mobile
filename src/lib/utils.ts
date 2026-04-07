import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPhoneNumber(phoneNumber: string): string {
  if (!phoneNumber) return '';

  let numbers = phoneNumber.replace(/[^\d]/g, '');

  if (!numbers.startsWith('0')) {
    numbers = '0' + numbers;
  }

  if (numbers.length === 11) {
    return numbers.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  }

  if (numbers.length === 10) {
    if (numbers.startsWith('02')) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
    }
    return numbers.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  }

  return phoneNumber;
}

export function formatTelNumber(phoneNumber: string): string {
  if (!phoneNumber) return '';

  let numbers = phoneNumber.replace(/[^\d]/g, '');

  // 8자리면 4-4로 끊기
  if (numbers.length === 8 && numbers.startsWith('1')) {
    return numbers.replace(/(\d{4})(\d{4})/, '$1-$2');
  }

  // 0으로 시작하지 않으면 0 붙이기
  if (!numbers.startsWith('0')) {
    numbers = '0' + numbers;
  }

  // 02로 시작하면: 02-XXX(X)-XXXX
  if (numbers.startsWith('02')) {
    const front = numbers.slice(0, 2);
    const back = numbers.slice(-4);
    const middle = numbers.slice(2, -4);
    return `${front}-${middle}-${back}`;
  }

  // 그 외: 0XX-XXX(X)-XXXX
  const front = numbers.slice(0, 3);
  const back = numbers.slice(-4);
  const middle = numbers.slice(3, -4);
  return `${front}-${middle}-${back}`;
}

/**
 * 객체를 FormData로 변환
 * @param data - 변환할 객체
 * @returns FormData 객체
 */

export function toFormData<T extends Record<string, unknown>>(
  data: T,
): FormData {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  return formData;
}

export function handleNumericInput(e: React.ChangeEvent<HTMLInputElement>) {
  e.target.value = e.target.value.replace(/[^0-9]/g, '');
}

/**
 * Record 객체의 역매핑을 생성합니다
 * @param map - 원본 매핑 객체 (key → value)
 * @returns 역매핑 객체 (value → key)
 * @example
 * const COUNTRY_MAP = { KR: '대한민국', US: 'United States' };
 * const reverseMap = createReverseMap(COUNTRY_MAP);
 * reverseMap['대한민국'] // 'KR'
 */
export function createReverseMap<T extends Record<string, string>>(map: T) {
  return Object.fromEntries(Object.entries(map).map(([k, v]) => [v, k])) as {
    [K in keyof T as T[K]]: K;
  };
}
