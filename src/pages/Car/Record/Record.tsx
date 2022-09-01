import React, { useEffect } from "react";
import styled from "styled-components";
const CartBx = styled.div`
  position: relative;
  width: 100%;
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 20px;
`;
const Card = styled.div`
  position: relative;
  background: #fff;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
`;
const RecordDetail = styled.div`
  position: relative;
  width: 100%;
  padding: 20px;
  padding-top: 0;
  min-height: 530px;
`;

const Record = () => {
  return (
    <>
      <CartBx>
        <Card>
          <div>
            <div class="number">1042</div>
            <div class="cardName">Daily Views</div>
          </div>
          <div class="iconBox">
            <i class="fas fa-eye"></i>
          </div>
        </Card>
        <Card>
          <div>
            <div class="number">1042</div>
            <div class="cardName">Sales</div>
          </div>
          <div class="iconBox">
            <i class="fas fa-eye"></i>
          </div>
        </Card>
        <Card>
          <div>
            <div class="number">1042</div>
            <div class="cardName">Comments</div>
          </div>
          <div class="iconBox">
            <i class="fas fa-eye"></i>
          </div>
        </Card>
        <Card>
          <div>
            <div class="number">$1042</div>
            <div class="cardName">Earning</div>
          </div>
          <div class="iconBox">
            <i class="fas fa-eye"></i>
          </div>
        </Card>
      </CartBx>
      <RecordDetail></RecordDetail>
    </>
  );
};

export default Record;
