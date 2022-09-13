import MessageBox, { Props } from "../components/Modal/MessageBox";
import { Meta, Story } from "@storybook/react/types-6-0";
import { GlobalStyle } from "../App";
// import Button from "../components/Button";

const meta: Meta = {
  title: "MessageBox",
  component: MessageBox,
  argTypes: {
    // handleClick: { action: "clicked" },
    // category: {
    //   control: {
    //     type: "select",
    //     options: categoryArr,
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

const Template: Story<Props> = (args) => <MessageBox {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: <p>Message</p>,
  setStyle: { width: 200, height: 200 },
};

export const Confirm = Template.bind({});
Confirm.args = {
  children: <p>Message</p>,
  setStyle: { width: 200, height: 200 },
};
