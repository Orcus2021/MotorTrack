import styled from "styled-components/macro";

export const InputFloat = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 5px;
  outline: none;
  color: #fff;
  font-size: 1rem;
  background-color: transparent;
  transition: 0.5s;
  &:valid ~ span,
  &:focus ~ span {
    color: var(--mainBack);
    transform: translate(12px, -20px);
    font-size: 0.7rem;
    padding: 0 10px;
    background-color: var(--mainColor);
    /* border-left: 1px solid #00dfc4;
    border-right: 1px solid #00dfc4; */
    letter-spacing: 0.2rem;
    border-radius: 2px;
  }
  &:valid,
  &:focus {
    border: 1px solid var(--mainColor);
  }
`;

export const SpanFloat = styled.span`
  position: absolute;
  left: 0;
  padding: 10px;
  pointer-events: none;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.25);
  text-transform: uppercase;
  transition: 0.5s;
`;
export const Img = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  top: 1px;
  left: 0;
`;
export const NeonText = styled.p`
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-shadow: 0 0 10px var(--mainColor), 0 0 20px var(--mainColor),
    0 0 40px var(--mainColor), 0 0 80px var(--mainColor),
    0 0 120px var(--mainColor);
`;
