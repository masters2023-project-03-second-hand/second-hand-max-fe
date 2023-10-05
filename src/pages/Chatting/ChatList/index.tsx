import styled, { css } from 'styled-components';
import { ChatListItem } from './ChatListItem';
import { useChatListInfiniteQuery } from '@hooks/queries/useChatListInfiniteQuery';
import { useFlattenPages } from '@hooks/useFlattenPages';
import { ErrorPage } from '@pages/ErrorPage';
import { Loader } from '@components/Loader';

export const ChatList: React.FC = () => {
  const { data, isLoading, isError } = useChatListInfiniteQuery({});
  const chatList = useFlattenPages(data);

  if (isError) {
    return <ErrorPage />;
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <StyledChatList>
      {chatList.length > 0 ? (
        chatList.map((chat) => <ChatListItem chat={chat} />)
      ) : (
        <NoChatRoomMessage>현재 대화중인 채팅방이 없습니다.</NoChatRoomMessage>
      )}
    </StyledChatList>
  );
};

const StyledChatList = styled.ul`
  ${({ theme: { colors } }) => css`
    width: 100%;
    display: flex;
    flex-direction: column;

    &:not(:last-child) {
      border-bottom: 0.8px solid ${colors.neutral.border};
    }
  `};
`;

const NoChatRoomMessage = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 56px;
`;
