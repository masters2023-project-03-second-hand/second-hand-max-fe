import Button from '@components/Button';
import Icons from '@design/Icons';
import { useModalStore } from 'stores/useModalStore';
import { css, styled } from 'styled-components';

export const AddRegionButton: React.FC = () => {
  const setIsRegionModalOpen = useModalStore(
    ({ setIsRegionModalOpen }) => setIsRegionModalOpen,
  );

  return (
    <StyledButton
      $flexible="Fixed"
      $type="Outline"
      onClick={() => setIsRegionModalOpen(true)}
    >
      <Icons.Plus />
      <span>위치 추가</span>
    </StyledButton>
  );
};

const StyledButton = styled(Button)`
  ${({ theme: { fonts, colors } }) => css`
    width: 100%;
    stroke: ${colors.neutral.textStrong};
    ${fonts.available.strong16};
  `};
`;
