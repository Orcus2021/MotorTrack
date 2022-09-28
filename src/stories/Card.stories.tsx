import Card, { Props } from "../components/Layout/Card";
import { Meta, Story } from "@storybook/react/types-6-0";
import { GlobalStyle } from "../App";

const meta: Meta = {
  title: "Card",
  component: Card,
  decorators: [
    (story) => (
      <>
        <GlobalStyle />
        <div style={{ margin: "30px" }}>{story()}</div>
      </>
    ),
  ],
  argTypes: { handleClick: { action: "clicked" } },
};

export default meta;

const Template: Story<Props> = (args) => <Card {...args} />;
export const Primary = Template.bind({});
Primary.args = {
  width: 80,
  height: 100,
  hover: false,
  boxShadow: true,
  isSelect: false,
  children: <p>Card</p>,
};

export const Hover = Template.bind({});
Hover.args = {
  width: 80,
  height: 100,
  hover: true,
  boxShadow: false,
  isSelect: false,
  children: <p>Card</p>,
};
export const Selected = Template.bind({});
Selected.args = {
  width: 80,
  height: 100,
  hover: true,
  boxShadow: false,
  isSelect: true,
  children: <p>Card</p>,
};
