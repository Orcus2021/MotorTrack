import React, { useEffect, useState } from "react";
import styled from "styled-components/macro";
import Calendar from "react-calendar";
import moment from "moment";
import { useFormContext } from "react-hook-form";

import calendarIcon from "../../assets/icon/calendar.png";

const Container = styled.div<{ $width: number | undefined }>`
  width: ${(props) => (props.$width ? `${props.$width}px` : "100%")};
  position: relative;
  display: flex;

  align-items: center;
`;

const InputFloat = styled.input<{
  $isError: undefined | boolean;

  $isWatch: boolean;
}>`
  width: 100%;

  padding: 8px 10px;

  border: 1px solid
    ${(props) => {
      if (props.$isError) {
        return "var(--errorColor)";
      } else if (props.$isWatch) {
        return "var(--mainColor)";
      } else {
        return "rgba(255, 255, 255, 0.6)";
      }
    }};

  border-left: ${(props) =>
    props.$isWatch ? "1px solid var(--mainColor)" : ""};
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
  $isWatch: boolean;
}>`
  position: absolute;
  left: 0;
  padding-left: 10px;
  pointer-events: none;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  transition: 0.5s;

  ${(props) => props.$isWatch && "color: var(--mainBack)"};
  ${(props) => props.$isWatch && "transform: translate(14px, -20px);"};
  ${(props) => props.$isWatch && "font-size: 0.8rem;"};
  ${(props) => props.$isWatch && "padding: 0 10px;"};
  ${(props) => props.$isWatch && " letter-spacing: 0.3rem;"};
  ${(props) => props.$isWatch && " border-radius: 2px;"};
  background-color: ${(props) =>
    props.$isError && props.$isWatch ? "var(--errorColor)" : ""};
  background-color: ${(props) => (props.$isWatch ? "var(--mainColor)" : "")};
`;
const Icon = styled.img`
  pointer-events: none;
  width: 20px;
  height: 20px;
  position: absolute;
  top: 7px;
  right: 10px;
`;

const CalendarWrapper = styled.div<{ $position: boolean }>`
  /* ~~~ container styles ~~~ */
  position: absolute;
  ${(props) => (props.$position ? "bottom: 50px" : " top: 20px")};
  z-index: 7;
  left: 0px;
  width: 250px;
  margin: auto;
  margin-top: 20px;

  background: rgba(1, 0, 44, 0.8);
  border-top: 1px solid rgba(255, 255, 255, 0.5);
  border-left: 1px solid rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  padding: 5px;
  border-radius: 3px;
  /* ~~~ navigation styles ~~~ */
  .react-calendar__navigation {
    display: flex;
    .react-calendar__navigation__label {
      font-weight: bold;
    }
    .react-calendar__navigation__arrow {
      flex-grow: 0.333;
    }
  }
  /* ~~~ label styles ~~~ */
  .react-calendar__month-view__weekdays {
    text-align: center;
  }
  .react-calendar__month-view__weekdays abbr {
    text-decoration: none;
    color: #fff;
    font-size: 12px;
    /* background-color: var(--deepColor);
    border-radius: 4px; */
  }

  /* ~~~ button styles ~~~ */
  button {
    margin: 2px;
    /* background-color: var(--secondBack); */
    background-color: transparent;
    border: 0;
    border-radius: 3px;
    color: white;
    padding: 3px 0;
    font-size: 12px;

    &:hover {
      background-color: var(--lightColor);
      color: var(--mainBack);
    }
    &:active {
      background-color: var(--deepColor);
    }
  }
  /* ~~~ day grid styles ~~~ */
  .react-calendar__month-view__days {
    display: grid !important;
    grid-template-columns: 14.2% 14.2% 14.2% 14.2% 14.2% 14.2% 14.2%;

    .react-calendar__tile {
      max-width: initial !important;
    }
    .react-calendar__tile--range {
      background-color: var(--mainColor);
    }
  }
  /* ~~~ neighboring month & weekend styles ~~~ */
  .react-calendar__month-view__days__day--neighboringMonth {
    opacity: 0.3;
  }
  .react-calendar__month-view__days__day--weekend {
    color: var(--errorColor);
  }
  /* ~~~ other view styles ~~~ */
  .react-calendar__year-view__months,
  .react-calendar__decade-view__years,
  .react-calendar__century-view__decades {
    display: grid !important;
    grid-template-columns: 20% 20% 20% 20% 20%;
    &.react-calendar__year-view__months {
      grid-template-columns: 33.3% 33.3% 33.3%;
    }

    .react-calendar__tile {
      max-width: initial !important;
    }
  }
`;

// FIXME
export type Props = {
  type: "text" | "number" | "date" | "password";
  name: string;
  content: string;
  error?: boolean;
  require?: object;
  readOnly?: boolean;
  value?: string | number;
  width?: number;
  calendarPosition?: "top" | "bottom";
};

const Input: React.FC<Props> = ({
  type,
  name,
  content,
  require,
  error = false,
  readOnly,
  value,
  width = undefined,
  calendarPosition = "bottom",
}) => {
  const methods = useFormContext();
  const { register, setValue, watch, getValues, clearErrors } = methods;
  const [date, setDate] = useState<Date>(new Date());
  const [showDate, setShowDate] = useState<boolean>(false);
  const [isValue, setIsValue] = useState<boolean>(false);

  useEffect(() => {
    if (watch(name)) {
      setIsValue(true);
    } else {
      setIsValue(false);
    }
  }, [watch, name, value, type]);
  let newType = type;

  if (type === "date") {
    newType = "text";
    readOnly = true;
  }
  const dateHandler = (date: Date) => {
    if (type === "date" && date) {
      const newDate = moment(date).format("YYYY-MM-DD");

      setDate(date);
      setValue(name, newDate);
      setIsValue(true);
      setShowDate(false);
      clearErrors(name);
    }
  };
  const showCalendarHandler = () => {
    if (type === "date") {
      setShowDate((pre) => !pre);
    }
  };
  const closeCalendarHandler = () => {
    if (type === "date") {
      setShowDate(false);
    }
  };

  const clearValueHandler = () => {
    if (type === "number" && watch(name) * 10 < 10) {
      setIsValue(true);
    }
    if (type === "number" && getValues(name) === 0) {
      setValue(name, null);
    }
  };

  return (
    <>
      <Container $width={width}>
        <InputFloat
          $isWatch={isValue}
          $isError={error}
          type={newType}
          {...register(name, require)}
          required
          readOnly={readOnly}
          onFocus={clearValueHandler}
          onClick={showCalendarHandler}
        />
        <SpanFloat $isWatch={isValue} $isError={error}>
          {content}
        </SpanFloat>
        {type === "date" && (
          <>
            {showDate && (
              <CalendarWrapper $position={calendarPosition === "top"}>
                <Calendar onClickDay={dateHandler} value={date} />
              </CalendarWrapper>
            )}

            <Icon src={calendarIcon} />
          </>
        )}
      </Container>
    </>
  );
};
export default Input;
