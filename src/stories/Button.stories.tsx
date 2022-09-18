import Button, { Props } from "../components/Button/Button";
import { Meta, Story } from "@storybook/react/types-6-0";
import { GlobalStyle } from "../App";

const meta: Meta = {
  title: "Button",
  component: Button,
  argTypes: { handleClick: { action: "clicked" } },
};

export default meta;

const Template: Story<Props> = (args) => (
  <>
    <GlobalStyle />
    <Button {...args} />
  </>
);

export const Primary = Template.bind({});
Primary.args = {
  label: "確認",
  type: "primary",
};

export const Reject = Template.bind({});
Reject.args = {
  label: "刪除",
  type: "reject",
};
export const Cancel = Template.bind({});
Cancel.args = {
  label: "取消",
  type: "cancel",
};
