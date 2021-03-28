export const Options = {
  account: [
    {
      label: "启用",
      value: "启用",
    },
    {
      label: "停用",
      value: "停用",
    },
  ],
  user: [
    {
      label: "试用员工",
      value: "试用员工",
    },
    {
      label: "正式员工",
      value: "正式员工",
    },
    // {
    //   label: "离职员工",
    //   value: "离职员工",
    // },
  ],
};

export interface TreeProps {
  label?: string;
  value?: string;
  title?: string;
  key?: string;
  disabled?: boolean;
  children?: TreeProps[];
}
