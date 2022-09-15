import ButtonBox, { Props } from "../components/Button/ButtonBox";
import { Meta, Story } from "@storybook/react/types-6-0";
import { GlobalStyle } from "../App";
// import Button from "../components/Button";
import * as ButtonStories from "./Button.stories";

const meta: Meta = {
  title: "ButtonBox",
  component: ButtonBox,
  argTypes: {
    // buttons: { action: "clicked" },
    // type: {
    //   control: {
    //     defaultValue: "alert",
    //     options: ["alert", "prompt", "custom"],
    //     type: "radio",
    //   },
    // },
  },
  decorators: [
    (story) => (
      <>
        <GlobalStyle />
        <div style={{ margin: "30px" }}>{story()}</div>
      </>
    ),
  ],
};

export default meta;

const Template: Story<Props> = (args) => <ButtonBox {...args} />;

export const Alert = Template.bind({});
Alert.args = {
  buttons: [{ label: "確認", type: "primary", handleClick: () => {} }],
};
export const Prompt = Template.bind({});
Prompt.args = {
  buttons: [
    { label: "取消", type: "cancel", handleClick: () => {} },
    { label: "確認", type: "primary", handleClick: () => {} },
  ],
};
export const Custom = Template.bind({});
Custom.args = {
  buttons: [
    { label: "取消", type: "cancel", handleClick: () => {} },
    { label: "刪除", type: "reject", handleClick: () => {} },
    { label: "確認", type: "primary", handleClick: () => {} },
  ],
};
