import styled from 'styled-components';

export const LastDirectChildNoMargin = styled.div`
  // Ensure no bottom margin exists on the last direct child
  > *:last-child {
    margin-bottom: 0 !important;
  }
`;
