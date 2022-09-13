import Progress, { Props } from "../components/Progress";
import { Meta, Story } from "@storybook/react/types-6-0";
import { GlobalStyle } from "../App";
import parts from "../utils/parts";
import returnIcon from "../assets/icon/return.png";

const categoryArr: string[] = [];
parts.forEach((value, key) => {
  categoryArr.push(key);
});

const meta: Meta = {
  title: "Progress",
  component: Progress,
  argTypes: {
    handleClick: { action: "clicked" },
    category: {
      control: {
        type: "select",
        options: categoryArr,
      },
    },
  },
  decorators: [
    (story) => (
      <>
        <GlobalStyle />
        <div style={{ margin: "30px", width: "500px" }}>{story()}</div>
      </>
    ),
  ],
};

export default meta;

const Template: Story<Props> = (args) => <Progress {...args} />;

export const Default = Template.bind({});
Default.args = {
  message: "可用6個月",
  category: "engineOil",
  percent: 50,
  returnIcon,
};

export const Error = Template.bind({});
Error.args = {
  message: "可用6個月",
  category: "engineOil",
  percent: 0,
  returnIcon,
};
