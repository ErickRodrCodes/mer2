export type RadioPillOption = {
  id: string,
  value: string | number,
  label: string;
  disabled?: boolean;
}

export type RadioPillControlType = {
  name: string,
  label: string,
  defaultValue?: string;
  layout?: 'horizontal' | 'vertical';
  validation?: (value: string) => boolean | string;
  options: RadioPillOption[];
  keyValue?: string;
}
