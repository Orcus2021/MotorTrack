import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components/macro";
import Calendar from "react-calendar";
import moment from "moment";
import { useForm } from "react-hook-form";

import calendarIcon from "../assets/icon/calendar.png";

const Container = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
`;

const InputFloat = styled.input<{ $isError: undefined | object }>`
  width: 100%;
  padding: 8px 10px;
  border: 1px solid
    ${(props) =>
      props.$isError ? "var(--errorColor)" : "rgba(255, 255, 255, 0.25)"};

  border-left: ${(props) =>
    props.$isError ? "10px solid var(--errorColor)" : ""};
  border-radius: 5px;
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
  $isWatch: boolean;
  $isError: undefined | object;
}>`
  position: absolute;
  left: 0;
  padding-left: 10px;
  pointer-events: none;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  transition: 0.5s;
  /* ${(props) => props.$isWatch && "color: var(--mainBack);"}
  ${(props) => props.$isWatch && "transform: translate(14px, -20px);"}
${(props) => props.$isWatch && "font-size: 0.8rem;"}
${(props) => props.$isWatch && "padding: 0 10px;"}
${(props) => props.$isWatch && "letter-spacing: 0.3rem;"}
${(props) => props.$isWatch && "border-radius: 2px;"}
${(props) => props.$isWatch && "background-color:var(--mainColor);"}
background-color: ${(props) =>
    props.$isError && props.$isWatch ? "var(--errorColor)" : ""}; */
`;
const Icon = styled.img`
  pointer-events: none;
  width: 20px;
  height: 20px;
  position: absolute;
  top: 7px;
  right: 10px;
`;

const CalendarWrapper = styled.div`
  /* ~~~ container styles ~~~ */
  position: absolute;
  top: 20px;
  left: 0px;

  width: 300px;
  margin: auto;
  margin-top: 20px;
  backdrop-filter: blur(5px);
  background: rgba(255, 255, 255, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.5);
  border-left: 1px solid rgba(255, 255, 255, 0.5);

  padding: 10px;
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
    /* background-color: var(--deepColor);
    border-radius: 4px; */
  }

  /* ~~~ button styles ~~~ */
  button {
    margin: 3px;
    /* background-color: var(--secondBack); */
    background-color: transparent;
    border: 0;
    border-radius: 3px;
    color: white;
    padding: 5px 0;
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
      background-color: var(--deepColor);
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
type Prop = {
  type: string;
  register: any;
  setValue?: any;
  watch?: any;
  name: string;
  content: string;
  error: undefined | object;
  require?: object;
  readOnly?: boolean;
  value?: any;
  setFocus?: any;
};

const Input: React.FC<Prop> = ({
  type,
  register,
  setValue,
  watch,
  name,
  content,
  require,
  error,
  readOnly,
  value,
  setFocus,
}) => {
  const [date, setDate] = useState<Date>(new Date());
  const [showDate, setShowDate] = useState<boolean>(false);
  const [isValue, setIsValue] = useState<boolean>(false);
  const { setFocus } = useForm();

  const isMounted = useRef(false);
  useEffect(() => {
    if (readOnly && value) {
      setValue(name, value);
      setFocus(name);
    } else if (readOnly) {
      setValue(name, "");
      setIsValue(false);
    }
  }, [watch, name, setValue, value, readOnly, setFocus]);

  useEffect(() => {
    if (isMounted.current && type === "date") {
      const newDate = moment(date).format("YYYY-MM-DD");
      setValue(name, newDate);
      setFocus(name);
    }
    isMounted.current = true;
  }, [date, setValue, name, isMounted, type, setFocus]);

  let newType = type;
  let newReadOnly = readOnly;
  let newWatch = (str: string) => {
    return false;
  };
  if (type === "date") {
    newType = "text";
    newReadOnly = true;
    newWatch = watch;
  }
  const dateHandler = (date: Date) => {
    if (type === "date") {
      setDate(date);
    }
  };
  const showCalendarHandler = () => {
    if (type === "date") {
      setShowDate((pre) => !pre);
    }
  };

  return (
    <>
      <Container onClick={showCalendarHandler}>
        <InputFloat
          $isError={error}
          type={newType}
          {...register(name, require)}
          required
          readOnly={newReadOnly}
        />
        <SpanFloat
          $isWatch={(newWatch(name) && type === "date") || isValue}
          $isError={error}
        >
          {content}
        </SpanFloat>
        {type === "date" && (
          <>
            {showDate && (
              <CalendarWrapper>
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
