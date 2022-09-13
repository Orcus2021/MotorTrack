import React from "react";
import styled from "styled-components/macro";
import { useFormContext } from "react-hook-form";

const Container = styled.div<{ $width: number | undefined }>`
  width: ${(props) => (props.$width ? `${props.$width}px` : "100%")};
  position: relative;
  display: flex;

  align-items: center;
`;

const InputFloat = styled.textarea<{
  $isError: undefined | boolean;
  $height: number | undefined;
}>`
  width: 100%;
  ${(props) => props.$height && `height:${props.$height}px;`}
  padding: 8px 10px;
  resize: none;

  border: 1px solid
    ${(props) => {
      if (props.$isError) {
        return "var(--errorColor)";
      } else {
        return "rgba(255, 255, 255, 0.25)";
      }
    }};

  border-left: ${(props) =>
    props.$isError ? "10px solid var(--errorColor)" : ""};
  border-radius: 4px;
  outline: none;
  color: #fff;
  font-size: 14px;
  background-color: transparent;
  transition: 0.5s;

  &:valid ~ span,
  &:focus ~ span {
    color: var(--mainBack);
    transform: translate(14px, -20px);
    font-size: 0.8rem;
    padding: 0 10px;
    background-color: ${(props) =>
      props.$isError ? "var(--errorColor)" : "var(--mainColor)"};
    letter-spacing: 0.3rem;
    border-radius: 2px;
  }
  &:valid,
  &:focus {
    border: 1px solid
      ${(props) => (props.$isError ? "var(--errorColor)" : "var(--mainColor)")};
    border-left: ${(props) =>
      props.$isError ? "10px solid var(--errorColor)" : ""};
  }
`;

const SpanFloat = styled.span<{
  $isError: boolean | undefined;
}>`
  position: absolute;
  left: 0;
  top: 10px;
  padding-left: 10px;
  pointer-events: none;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  transition: 0.5s;
  background-color: ${(props) => (props.$isError ? "var(--errorColor)" : "")};
`;

// FIXME
export type Props = {
  name: string;
  content: string;
  error?: boolean;
  require?: object;
  height?: number;
  width?: number;
};

const Textarea: React.FC<Props> = ({
  name,
  content,
  require,
  error = false,
  height = undefined,
  width = undefined,
}) => {
  const methods = useFormContext();
  const { register } = methods;
  //   const [isValue, setIsValue] = useState<boolean>(false);

  //   useEffect(() => {
  //     if (watch(name)) {
  //       setIsValue(true);
  //     } else {
  //       setIsValue(false);
  //     }
  //   }, [watch, name, value]);

  return (
    <>
      <Container $width={width}>
        <InputFloat
          //   $isWatch={isValue}
          $height={height}
          $isError={error}
          //   type={newType}
          {...register(name, require)}
          required
        />
        <SpanFloat $isError={error}>{content}</SpanFloat>
      </Container>
    </>
  );
};
export default Textarea;