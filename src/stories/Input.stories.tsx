import Input, { Props } from "../components/Input/Input";
import { Meta, Story } from "@storybook/react/types-6-0";
import InputFormProvider from "../Hook/InputFormProvider";
import { GlobalStyle } from "../App";

const meta: Meta = {
  title: "Input",
  component: Input,
  decorators: [
    (story) => (
      <InputFormProvider>
        <GlobalStyle />
        <div style={{ margin: "30px" }}>{story()}</div>
      </InputFormProvider>
    ),
  ],
};

export default meta;

const Template: Story<Props> = (args) => {
  return (
    <>
      <Input {...args} />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  type: "text",
  name: "text",
  content: "帳號",
  width: 250,
};

export const Date = Template.bind({});
Date.args = {
  type: "date",
  name: "date",
  content: "日期",
  width: 250,
};
