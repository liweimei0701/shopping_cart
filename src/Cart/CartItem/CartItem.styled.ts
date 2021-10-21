import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  justify-conten: space-between;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ccc;
  div {
    flex: 1;
    div {
      display: flex;
      justify-content: space-between;
    }
  }
   img {
     max-width: 80px;
     object-fit: cover;
     margin-left: 40px;
   }
`;